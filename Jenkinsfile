// PiSmartSite — pipeline type (declarative). Ajustez les labels d’agents et les chemins si besoin.
pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Install') {
      steps {
        dir('smartsite-backend') {
          sh 'npm ci || npm install'
        }
        dir('smarsite-frontend') {
          sh 'npm ci || npm install'
        }
      }
    }

    stage('Test backend') {
      steps {
        dir('smartsite-backend') {
          sh 'mkdir -p ../reports/junit'
          sh 'npm run test:ci'
        }
      }
    }

    stage('Test frontend') {
      steps {
        dir('smarsite-frontend') {
          sh 'mkdir -p ../reports/junit'
          sh 'npm run test:ci'
        }
      }
    }

    stage('Coverage backend') {
      steps {
        dir('smartsite-backend') {
          sh 'mkdir -p ../reports/junit'
          sh 'npm run test:cov:ci'
        }
      }
    }

    stage('Coverage frontend') {
      steps {
        dir('smarsite-frontend') {
          sh 'mkdir -p ../reports/junit'
          sh 'npm run test:cov:ci'
        }
      }
    }

    stage('Archive artifacts') {
      steps {
        archiveArtifacts artifacts: 'reports/junit/*.xml, smartsite-backend/coverage/**, smarsite-frontend/coverage/**', allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      junit 'reports/junit/*.xml'
    }
  }
}
