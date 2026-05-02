#!/usr/bin/env bash
# Rend du tag d’images Docker Hub puis kubectl apply — appelé par le Jenkinsfile (agent Linux).
# Prérequis : kubectl ; PV/PVC Mongo (k8s/db-*.yaml) si stockage persist.
set -euo pipefail

: "${IMG_BACKEND:?missing IMG_BACKEND}"
: "${IMG_FRONTEND:?missing IMG_FRONTEND}"
: "${IMG_AI:?missing IMG_AI}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S="${ROOT}/k8s"

render_deployments() {
  sed \
    -e "s|pismartsite-backend:latest|${IMG_BACKEND}|g" \
    -e "s|pismartsite-frontend:latest|${IMG_FRONTEND}|g" \
    -e "s|pismartsite-ai:latest|${IMG_AI}|g" \
    "${K8S}/deployment.yaml"
}

echo ">>> K8s : stockage Mongo (ignore erreur si PV différent dans le cluster)"
kubectl apply -f "${K8S}/db-pv.yaml" || true
kubectl apply -f "${K8S}/db-pvc.yaml"

echo ">>> K8s : MongoDB"
kubectl apply -f "${K8S}/db-deployment.yaml"

echo ">>> K8s : Deployments backend + frontend + IA (avec tags CI)"
render_deployments | kubectl apply -f -

echo ">>> K8s : Services backend / frontend / IA"
kubectl apply -f "${K8S}/service.yaml"

echo ">>> K8s : rollout"
kubectl rollout status deployment/mongodb --timeout=240s
kubectl rollout status deployment/smartsite-ai --timeout=600s
kubectl rollout status deployment/backend --timeout=300s
kubectl rollout status deployment/frontend --timeout=300s

echo ">>> K8s : terminé"
