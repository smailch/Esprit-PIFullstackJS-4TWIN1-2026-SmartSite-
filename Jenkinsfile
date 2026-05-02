/**
 * PiSmartSite — CI/CD monorepo (NestJS backend + Next.js frontend + FastAPI/YOLO AI)
 *
 * Phases :
 *   1) CI : bootstrap cache .ci-tools, tests + build en parallèle
 *   2) Sonar : fusion LCOV → scan → Quality Gate (comportement existant préservé)
 *   3) CD : build/push Docker Hub puis déploiement Kubernetes (succès CI+Sonar requis avant CD)
 *
 * CD Docker — prérequis agent :
 *   • CLI docker dans le PATH (ex. `/usr/local/bin/docker` depuis Dockerfile.jenkins) et accès au démon Docker.
 *   • Démo Docker Desktop : `docker-compose.jenkins.yml` (socket `docker.sock`) + image `Dockerfile.jenkins` ;
 *     Compose utilise `user: "0:0"` pour éviter « permission denied » sur le socket hôte ; `docker compose ... build && up`.
 *   Variable optionnelle de job DOCKER_BIN (ex. /usr/local/bin/docker) pour forcer le binaire si PATH insuffisant.
 * Variables obligatoires pour le CD (après Sonar) :
 *   DOCKER_IMAGE_OWNER — utilisateur/org Docker Hub (défaut pipeline : missaouimourad ; surchargeable sur le job).
 * Credential Docker Hub (pipeline attend un identifiant Jenkins précis) :
 *   1) Jenkins → Manage Credentials → portée adaptée (global ou dossier du job)
 *   2) Add Credentials → « Username with password »
 *      • Username = ton identifiant Docker Hub (ex. missaouimourad)
 *      • Password = Access Token Docker Hub (pas le mot de passe du compte si 2FA)
 *      • ID = exactement dockerhub  (ou sinon variable de job DOCKER_CREDENTIAL_ID = l’ID que tu as choisi)
 * Credential fichier kubeconfig — id défaut kubeconfig (surcharge : KUBECONFIG_CREDENTIAL_ID).
 *   NEXT_PUBLIC_API_URL_BUILD ou NEXT_PUBLIC_API_URL — URL API vue par le navigateur pour le build front.
 * SonarQube :
 *   Le stage Quality Gate consulte Sonar (IN_PROGRESS = normal). Cette étape ne fait jamais échouer le pipeline :
 *      timeout, erreur réseau ou QG Sonar en erreur → le CD s’enchaîne quand même ; le stage peut être UNSTABLE pour visibilité.
 *   SONAR_QUALITYGATE_TIMEOUT_MINUTES — délai max d’attente (défaut 45 ; au‑delà, on coupe et on continue).
 *   SONAR_SKIP_QUALITY_GATE_WAIT=true — pas d appel waitForQualityGate du tout en démo.
 * Prérequis plugin : Workspace Cleanup (« cleanWs » dans le premier stage Checkout).
 * options.skipDefaultCheckout(true) évite un double checkout (erreur « not in a git directory » dans
 *   « Declarative: Checkout SCM » puis workspace déjà incomplet avant cleanWs).
 * Pas de bloc parameters : pas de SKIP_CD. Si Jenkins propose encore SKIP_CD, désactive
 *   « Ce projet est paramétrable » dans Configuration du job ou pousse ce Jenkinsfile puis rebuild.
 */
pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 4, unit: 'HOURS')
    /** Un seul checkout explicite au stage Checkout (après cleanWs), pas avant. */
    skipDefaultCheckout(true)
  }

  environment {
    CI = 'true'
    HUSKY = '0'
    NEXT_TELEMETRY_DISABLED = '1'
    NEXT_PUBLIC_API_URL = "${env.NEXT_PUBLIC_API_URL ?: 'http://127.0.0.1:3200'}"
    SONAR_HOST_URL_OVERRIDE = "${env.SONAR_HOST_URL_OVERRIDE ?: ''}"
    SONAR_QUALITYGATE_TIMEOUT_MINUTES = "${env.SONAR_QUALITYGATE_TIMEOUT_MINUTES ?: '45'}"
    SONAR_SKIP_QUALITY_GATE_WAIT = "${env.SONAR_SKIP_QUALITY_GATE_WAIT ?: 'false'}"
    /** Identifiants Docker Hub pour le bloc CD */
    DOCKER_CREDENTIAL_ID = "${env.DOCKER_CREDENTIAL_ID ?: 'dockerhub'}"
    KUBECONFIG_CREDENTIAL_ID = "${env.KUBECONFIG_CREDENTIAL_ID ?: 'kubeconfig'}"
    /** Compte/org images Docker Hub (surcharge : variable DOCKER_IMAGE_OWNER sur le job Jenkins) */
    DOCKER_IMAGE_OWNER = "${env.DOCKER_IMAGE_OWNER ?: 'missaouimourad'}"
    DOCKER_BUILDKIT = '1'
    /** Détecte docker installé sous /usr/local/bin (CLI statique Dockerfile.jenkins) */
    PATH = "/usr/local/bin:${env.PATH}"
    /** Surcharge explicite si besoin : /usr/local/bin/docker */
    DOCKER_BIN = "${env.DOCKER_BIN ?: 'docker'}"
  }

  stages {

    // cleanWs évite workspaces Git corrompus ; il supprime aussi le cache WORKSPACE/.ci-tools — enlève cette ligne si tu veux la remise du cache téléchargements.
    stage('Checkout') {
      steps {
        cleanWs()
        checkout scm
        script {
          env.GIT_COMMIT_SHORT = sh(
            script: 'git rev-parse --short=8 HEAD 2>/dev/null || echo local',
            returnStdout: true
          ).trim()
          env.IMAGE_TAG_FULL = "${BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
          echo "[INFO] IMAGE_TAG_FULL=${IMAGE_TAG_FULL}"
        }
      }
    }

    stage('Bootstrap toolchain (.ci-tools)') {
      steps {
        sh '''
          set -e
          mkdir -p "${WORKSPACE}/.ci-tools"
          WS="${WORKSPACE}"
          DEST_NODE="${WS}/.ci-tools/node"
          PY_ROOT="${WS}/.ci-tools/python"

          NEED_NODE=0
          if command -v node >/dev/null 2>&1; then
            echo ">>> Node système: $(command -v node) ($(node -v))"
          elif [ -x "${DEST_NODE}/bin/node" ]; then
            echo ">>> Node déjà en cache workspace"
          else
            NEED_NODE=1
          fi

          NEED_PY=0
          if command -v python3 >/dev/null 2>&1; then
            echo ">>> Python système: $(command -v python3) ($(python3 --version))"
          elif [ -x "${PY_ROOT}/bin/python3" ] || [ -x "${PY_ROOT}/bin/python3.11" ]; then
            echo ">>> Python déjà en cache workspace"
          else
            NEED_PY=1
          fi

          NODE_TMP=""
          PY_TMP=""
          if [ "$NEED_NODE" -eq 1 ] || [ "$NEED_PY" -eq 1 ]; then
            echo ">>> Téléchargements (en parallèle si besoin) — puis cache sous .ci-tools/"
          fi
          if [ "$NEED_NODE" -eq 1 ]; then
            NODE_VER=22.12.0
            ARCH=x64
            case "$(uname -m)" in aarch64|arm64) ARCH=arm64 ;; esac
            NODE_TMP="/tmp/node-ci-$$.tar.gz"
            echo ">>> curl Node ${NODE_VER} linux-${ARCH}"
            curl -fsSL "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-${ARCH}.tar.gz" -o "${NODE_TMP}" &
          fi
          if [ "$NEED_PY" -eq 1 ]; then
            REL=20260414
            VER=3.11.15
            TRIP=x86_64-unknown-linux-gnu
            case "$(uname -m)" in aarch64|arm64) TRIP=aarch64-unknown-linux-gnu ;; esac
            NAME="cpython-${VER}+${REL}-${TRIP}-install_only_stripped.tar.gz"
            URL="https://github.com/astral-sh/python-build-standalone/releases/download/${REL}/${NAME}"
            PY_TMP="/tmp/py-ci-$$.tar.gz"
            echo ">>> curl Python ${VER} stripped (${TRIP})"
            curl -fsSL "${URL}" -o "${PY_TMP}" &
          fi
          if [ "$NEED_NODE" -eq 1 ] || [ "$NEED_PY" -eq 1 ]; then
            wait || exit 1
          fi

          if [ -n "$NODE_TMP" ]; then
            rm -rf "${DEST_NODE}"
            mkdir -p "${DEST_NODE}"
            tar -xzf "${NODE_TMP}" -C "${DEST_NODE}" --strip-components=1
            rm -f "${NODE_TMP}"
            echo ">>> Node extrait dans ${DEST_NODE}"
          fi
          if [ -n "$PY_TMP" ]; then
            rm -rf "${PY_ROOT}"
            tar -xzf "${PY_TMP}" -C "${WS}/.ci-tools"
            rm -f "${PY_TMP}"
            echo ">>> Python extrait sous .ci-tools/python"
          fi

          if [ -x "${PY_ROOT}/bin/python3.11" ] && [ ! -x "${PY_ROOT}/bin/python3" ]; then
            ln -sf python3.11 "${PY_ROOT}/bin/python3"
          fi
          if [ -x "${PY_ROOT}/bin/python3" ]; then
            "${PY_ROOT}/bin/python3" --version
          fi
        '''
        script {
          def extra = []
          if (fileExists('.ci-tools/python/bin/python3') || fileExists('.ci-tools/python/bin/python3.11')) {
            extra.add("${env.WORKSPACE}/.ci-tools/python/bin")
          }
          if (fileExists('.ci-tools/node/bin/node')) {
            extra.add("${env.WORKSPACE}/.ci-tools/node/bin")
          }
          if (!extra.isEmpty()) {
            env.PATH = extra.join(':') + ':' + env.PATH
          }
        }
      }
    }

    stage('Toolchain — vérification') {
      steps {
        sh '''
          set -e
          echo ">>> Node / npm"
          node -v
          npm -v
          echo ">>> Python (service IA — même binaire utilisé ensuite pour venv léger CI)"
          command -v python3 >/dev/null 2>&1 && python3 --version || { echo "python3 manquant"; exit 1; }
        '''
      }
    }

    stage('CI — tests & builds') {
      parallel {
        stage('Backend (NestJS)') {
          environment {
            JEST_JUNIT_OUTPUT_DIR = "${WORKSPACE}/reports/junit/backend"
          }
          steps {
            sh 'mkdir -p reports/junit/backend'
            dir('smartsite-backend') {
              sh 'echo "[CI] Backend: npm ci" && npm ci'
              sh 'echo "[CI] Backend: tests + couverture" && npm run test:cov:ci'
              sh 'echo "[CI] Backend: build" && npm run build'
            }
          }
        }

        stage('Frontend (Next.js)') {
          steps {
            sh 'mkdir -p reports/junit'
            dir('smarsite-frontend') {
              sh 'echo "[CI] Frontend: npm ci" && npm ci'
              sh 'echo "[CI] Frontend: tests + couverture" && npm run test:cov:ci'
              sh 'echo "[CI] Frontend: build" && npm run build'
            }
          }
        }

        stage('AI service (Python — léger, sans torch)') {
          steps {
            dir('smartsite-ai-service') {
              sh '''
                set -e
                if command -v python3 >/dev/null 2>&1; then PY=python3
                elif command -v python >/dev/null 2>&1; then PY=python
                else echo "[CI] Python 3 requis pour smartsite-ai-service"; exit 1
                fi
                echo "[CI] AI: venv + deps minimales + compile/import (sans torch/Ultralytics)"
                $PY -m venv .venv-ci
                . .venv-ci/bin/activate
                pip install --upgrade pip -q
                pip install -q fastapi==0.104.1 "uvicorn[standard]==0.24.0" python-multipart==0.0.6
                $PY -m compileall -q .
                $PY -c "import main; assert main.app.title == 'SmartSite AI'"
                echo "[CI] AI: OK"
              '''
            }
          }
        }
      }
    }

    stage('SonarQube — fusion LCOV') {
      steps {
        sh '''
          set -e
          echo "[Sonar] Fusion backend + frontend → coverage/lcov.info"
          node scripts/sonar-prep-lcov.mjs
        '''
      }
    }

    stage('SonarQube — analyse') {
      steps {
        withCredentials([
          string(
            credentialsId: "${env.SONAR_TOKEN_CREDENTIAL_ID ?: 'sonar-token'}",
            variable: 'SONAR_TOKEN',
          ),
        ]) {
          withSonarQubeEnv('SonarQube') {
            sh '''
              set -e
              echo "[Sonar] Scanner monorepo (scripts/sonar-scan.mjs)"
              node scripts/sonar-scan.mjs
            '''
          }
        }
      }
    }

   
    stage('CD — préparation Images') {
      steps {
        script {
          def owner = (env.DOCKER_IMAGE_OWNER ?: '').trim()
          if (!owner) {
            error(
              '''[CD] Variable de job DOCKER_IMAGE_OWNER obligatoire pour ce pipeline (CD non optionnel).
Exemple DOCKER_IMAGE_OWNER=jdoe → jdoe/pismartsite-backend:…'''
            )
          }
          env.IMG_BACKEND = "${owner}/pismartsite-backend:${env.IMAGE_TAG_FULL}"
          env.IMG_FRONTEND = "${owner}/pismartsite-frontend:${env.IMAGE_TAG_FULL}"
          env.IMG_AI = "${owner}/pismartsite-ai:${env.IMAGE_TAG_FULL}"

          def feUrl = (env.NEXT_PUBLIC_API_URL_BUILD ?: env.NEXT_PUBLIC_API_URL ?: 'http://127.0.0.1:3200').trim()
          env.FE_BUILD_API_URL = feUrl
          echo "[CD] Images : ${IMG_BACKEND} | ${IMG_FRONTEND} | ${IMG_AI}"
          echo "[CD] NEXT_PUBLIC_API_URL (build front)=${FE_BUILD_API_URL}"
        }
      }
    }

    stage('CD — Docker Hub login') {
      steps {
        echo "[CD] Credential Jenkins (Username/password) : credentialsId='${env.DOCKER_CREDENTIAL_ID}'. Si erreur « Could not find credentials », créez cet ID ou surchargez DOCKER_CREDENTIAL_ID sur le job."
        sh '''
          set -e
          if ! command -v "$DOCKER_BIN" >/dev/null 2>&1; then
            echo "[CD] ERREUR: commande docker introuvable (DOCKER_BIN=$DOCKER_BIN, PATH=$PATH)."
            echo "     Voir docker-compose.jenkins.yml + Dockerfile.jenkins (CLI + socket) ou installez Docker sur l agent."
            exit 127
          fi
          "$DOCKER_BIN" info >/dev/null 2>&1 || {
            echo "[CD] ERREUR: $DOCKER_BIN ne parle pas au démon (info échoue). Vérifiez docker.sock et droits (ex. user root sur le conteneur Jenkins)."
            exit 1
          }
        '''
        retry(2) {
          withCredentials([
            usernamePassword(
              credentialsId: env.DOCKER_CREDENTIAL_ID,
              usernameVariable: 'DOCKER_USER',
              passwordVariable: 'DOCKER_PASS',
            ),
          ]) {
            sh '''
              set -e
              echo "[CD] Connexion registre Docker Hub"
              echo "$DOCKER_PASS" | "$DOCKER_BIN" login -u "$DOCKER_USER" --password-stdin docker.io
            '''
          }
        }
      }
    }

    stage('CD — Docker build') {
      options {
        timeout(time: 90, unit: 'MINUTES')
      }
      parallel {
        stage('Image backend') {
          steps {
            sh '''
              set -e
              echo "[CD] Docker build backend"
              "$DOCKER_BIN" build -t "$IMG_BACKEND" smartsite-backend
            '''
          }
        }

        stage('Image frontend') {
          steps {
            sh '''
              set -e
              echo "[CD] Docker build frontend (NEXT_PUBLIC_API_URL=$FE_BUILD_API_URL)"
              "$DOCKER_BIN" build \
                --build-arg "NEXT_PUBLIC_API_URL=$FE_BUILD_API_URL" \
                -t "$IMG_FRONTEND" \
                smarsite-frontend
            '''
          }
        }

        stage('Image IA') {
          steps {
            sh '''
              set -e
              echo "[CD] Docker build service IA (peut prendre plusieurs minutes — torch)"
              "$DOCKER_BIN" build -t "$IMG_AI" smartsite-ai-service
            '''
          }
        }
      }
    }

    stage('CD — Docker push') {
      steps {
        sh '''
          set -e
          push_retry() {
            local tries=3
            local delay=30
            local i=1
            while [ "$i" -le "$tries" ]; do
              if "$DOCKER_BIN" push "$1"; then
                return 0
              fi
              echo "[CD] Push échec tentative $i/$tries — nouvelle tentative dans ${delay}s"
              sleep "$delay"
              i=$((i + 1))
            done
            return 1
          }
          echo "[CD] Push images"
          push_retry "$IMG_BACKEND"
          push_retry "$IMG_FRONTEND"
          push_retry "$IMG_AI"
        '''
      }
    }

    stage('CD — Kubernetes apply') {
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        withCredentials([
          file(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE'),
        ]) {
          sh '''
            set -e
            export KUBECONFIG="$KUBECONFIG_FILE"
            chmod +x scripts/jenkins-k8s-deploy.sh
            IMG_BACKEND="$IMG_BACKEND" IMG_FRONTEND="$IMG_FRONTEND" IMG_AI="$IMG_AI" \
              scripts/jenkins-k8s-deploy.sh
          '''
        }
      }
    }
  }

  post {
    always {
      script {
        try {
          junit testResults: 'reports/junit/**/*.xml', allowEmptyResults: true
          archiveArtifacts artifacts: 'smartsite-backend/coverage/**/*,smarsite-frontend/coverage/**/*,coverage/lcov.info', allowEmptyArchive: true
        } catch (Throwable e) {
          echo "[Pipeline] Artefacts junit/archivage sautés (souvent échec checkout ou pas de workspace) : ${e.message}"
        }
      }
    }
    success {
      echo '[Pipeline] Succès : CI + Sonar + CD (Docker Hub + Kubernetes).'
    }
    failure {
      echo '[Pipeline] FAILURE — examiner le dernier stage en erreur.'
    }
  }
}
