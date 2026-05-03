#!/usr/bin/env bash
# Substitution des tags Docker Hub puis kubectl apply — appelé par le Jenkinsfile (agent Linux).
# Scénario par défaut (Atlas, sans Mongo incrusté, sans IA) :
#   • Créez le secret pismartsite-runtime avec MONGODB_URI avant la première fois.
#   • DEPLOY_CLUSTER_MONGO=false, DEPLOY_AI_SERVICE=false (défauts).
set -euo pipefail

: "${IMG_BACKEND:?missing IMG_BACKEND}"
: "${IMG_FRONTEND:?missing IMG_FRONTEND}"

DEPLOY_CLUSTER_MONGO="${DEPLOY_CLUSTER_MONGO:-false}"
DEPLOY_AI_SERVICE="${DEPLOY_AI_SERVICE:-false}"
K8S_NAMESPACE="${K8S_NAMESPACE:-default}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S="${ROOT}/k8s"

render_core() {
  sed \
    -e "s|pismartsite-backend:latest|${IMG_BACKEND}|g" \
    -e "s|pismartsite-frontend:latest|${IMG_FRONTEND}|g" \
    "${K8S}/deployment-core.yaml"
}

render_ai() {
  : "${IMG_AI:?missing IMG_AI (requis si DEPLOY_AI_SERVICE=true)}"
  sed \
    -e "s|pismartsite-ai:latest|${IMG_AI}|g" \
    "${K8S}/deployment-ai.yaml"
}

if [[ "${DEPLOY_CLUSTER_MONGO}" == "true" ]]; then
  echo ">>> K8s : stockage Mongo embarqué"
  kubectl apply -f "${K8S}/db-pv.yaml" || true
  kubectl apply -f "${K8S}/db-pvc.yaml"

  echo ">>> K8s : MongoDB (Pods cluster)"
  kubectl apply -f "${K8S}/db-deployment.yaml"
else
  echo ">>> K8s : MongoDB cluster désactivé (Atlas / Mongo externe)."
  if [[ "${SKIP_KUBE_ATLAS_SECRET_CHECK:-false}" != "true" ]]; then
    if ! kubectl get secret pismartsite-runtime -n "${K8S_NAMESPACE}" >/dev/null 2>&1; then
      echo "[ERREUR] Secret Atlas manquant. Créez-le puis relancez, ex. :" >&2
      echo '  kubectl create secret generic pismartsite-runtime -n '"${K8S_NAMESPACE}"' \\' >&2
      echo "    --from-literal=MONGODB_URI='mongodb+srv://USER:PWD@CLUSTER.mongodb.net/smartsite?retryWrites=true&w=majority'" >&2
      echo "Ou export SKIP_KUBE_ATLAS_SECRET_CHECK=true pour ignorer (clusters déjà peuplés)." >&2
      exit 1
    fi
  fi
fi

echo ">>> K8s : backend + frontend (${IMG_BACKEND} | ${IMG_FRONTEND})"
render_core | kubectl apply -n "${K8S_NAMESPACE}" -f -

if [[ "${DEPLOY_AI_SERVICE}" == "true" ]]; then
  echo ">>> K8s : smartsite-ai (${IMG_AI})"
  render_ai | kubectl apply -n "${K8S_NAMESPACE}" -f -
else
  echo ">>> K8s : service IA non déployé (DEPLOY_AI_SERVICE=false)."
fi

echo ">>> K8s : Services (NodePort frontend 30080, backend 30320)"
kubectl apply -n "${K8S_NAMESPACE}" -f "${K8S}/service.yaml"

echo ">>> K8s : rollout"
if [[ "${DEPLOY_CLUSTER_MONGO}" == "true" ]]; then
  kubectl rollout status deployment/mongodb -n "${K8S_NAMESPACE}" --timeout=240s
fi
if [[ "${DEPLOY_AI_SERVICE}" == "true" ]]; then
  kubectl rollout status deployment/smartsite-ai -n "${K8S_NAMESPACE}" --timeout=600s
fi
kubectl rollout status deployment/backend -n "${K8S_NAMESPACE}" --timeout=300s
kubectl rollout status deployment/frontend -n "${K8S_NAMESPACE}" --timeout=300s

echo ">>> K8s : terminé"
