# Jenkins + Docker — faire tourner les conteneurs correctement

Ce guide complète le [`Jenkinsfile`](../Jenkinsfile) racine et le [`docker-compose.yml`](../docker-compose.yml) pour que les images produites par la CI/CD se comportent comme en local (API, front, CORS, photos `/uploads/`).

---

## 1. Ce que le pipeline Jenkins construit

| Étape | Résultat |
|--------|----------|
| `CD — Docker build` | Images `DOCKER_IMAGE_OWNER/pismartsite-backend:BUILD-GITHASH` et `…/pismartsite-frontend:…` |
| Build frontend | `--build-arg NEXT_PUBLIC_API_URL=…` — **cette URL est figée dans le bundle JS** (voir §3). |

Les tags exacts sont dans les logs : `IMAGE_TAG_FULL=…` et `IMG_BACKEND` / `IMG_FRONTEND`.

---

## 2. Variables de job Jenkins à renseigner

| Variable | Obligatoire | Rôle |
|----------|-------------|------|
| `DOCKER_IMAGE_OWNER` | Oui (sinon le stage *préparation* peut échouer si vide) | Compte Docker Hub (`missaouimourad`, etc.). |
| Credential **ID** `dockerhub` | Oui pour le push | Type *Username with password* (token Hub). Surcharge : `DOCKER_CREDENTIAL_ID`. |
| **`NEXT_PUBLIC_API_URL_BUILD`** ou **`NEXT_PUBLIC_API_URL`** | **Fortement recommandé en préprod/prod** | URL de l’API **telle que le navigateur des utilisateurs l’atteint** (pas `http://backend:3200`, pas un nom interne K8s seul). |
| `SKIP_KUBERNETES_DEPLOY` | Optionnel | `true` = uniquement build + push Hub, pas `kubectl`. |
| `KUBECONFIG_CREDENTIAL_ID` | Si K8s | Fichier kubeconfig (défaut `kubeconfig`). |

**Important :** si `NEXT_PUBLIC_API_URL_*` reste `http://127.0.0.1:3200`, l’image front compilée appellera l’API sur la machine **du client**, pas sur votre serveur — connexion refusée ou mauvaise instance.

Exemples :

- Docker sur une VM : `http://IP_PUBLIQUE:3200` (port backend exposé).
- Kubernetes NodePort (fichier `k8s/service.yaml`) : `http://IP_DU_NODE:30320`.
- Ingress : `https://api.votredomaine.fr`.

---

## 3. `NEXT_PUBLIC_API_URL` — règle d’or

- Elle est lue **au build** du Dockerfile frontend (`ARG NEXT_PUBLIC_API_URL`).
- Après déploiement, changer seulement une variable d’environnement **runtime** sur le conteneur front **ne met pas à jour** l’URL API dans le JS déjà buildé.
- **Chaque environnement** (dev / préprod / prod) doit avoir une **image front rebuildée** avec la bonne `NEXT_PUBLIC_API_URL`, ou un job Jenkins par environnement avec la variable adaptée.

---

## 4. Lancer la stack avec Docker Compose (après push Hub)

Sur la machine cible (avec le dépôt ou au minimum `docker-compose.yml` + fichiers `env`) :

1. Créer le réseau une fois :  
   `docker network create pismartsite-net`

2. Renseigner `smartsite-backend/.env` (MongoDB Atlas, secrets Nest, etc.) et `smarsite-frontend/.env.local` si besoin.

3. Exporter les **mêmes tags** que Jenkins, et l’URL API **vue du navigateur** :

```bash
export BACKEND_IMAGE="missaouimourad/pismartsite-backend:123-abcdef12"
export FRONTEND_IMAGE="missaouimourad/pismartsite-frontend:123-abcdef12"
export NEXT_PUBLIC_API_URL="http://VOTRE_IP_OU_DNS:3200"
docker compose pull
docker compose up -d
```

4. **CORS** : dans `docker-compose.yml`, adaptez `CORS_ORIGINS` côté backend pour inclure l’URL du front (`http://hôte:3000`, domaine HTTPS, etc.).

5. **Volumes** : `./smartsite-backend/uploads:/app/uploads` assure la persistance des fichiers (photos). En pur « pull image » sans ce montage, les uploads sont perdus au redémarrage.

---

## 5. Déploiement Kubernetes (pipeline Jenkins)

1. Secret Atlas (si `DEPLOY_CLUSTER_MONGO=false`) :

```bash
kubectl create secret generic pismartsite-runtime \
  --from-literal=MONGODB_URI='mongodb+srv://...'
```

2. **CORS** : éditez `k8s/deployment-core.yaml` (champ `CORS_ORIGINS` du conteneur `backend`) pour ajouter l’URL réelle du front (Ingress, `http://NODE:30080`, etc.), puis réappliquez ou laissez Jenkins le faire au prochain run.

3. Le manifeste `deployment-core.yaml` expose pour le front :
   - `INTERNAL_API_URL` et **`BACKEND_PROXY_TARGET`** → `http://backend:3200` (rewrites Next / appels serveur vers le service `backend`).

4. **Build front** : comme en Compose, `NEXT_PUBLIC_API_URL` doit avoir été correcte **au moment du docker build** (variable Jenkins §2).

5. **Uploads** : le déploiement utilise `emptyDir` pour `/app/uploads` — les fichiers ne survivent pas à un reschedule de pod. Pour la prod, prévoir un PVC (hors scope de ce document).

---

## 6. Jenkins dans Docker (`docker-compose.jenkins.yml`)

- Le conteneur Jenkins monte `docker.sock` : les `docker build` du pipeline utilisent le moteur de l’hôte.
- Vérifier : `docker exec -it pismartsite-jenkins docker version`.

---

## 7. Checklist rapide « ça ne marche pas »

| Symptôme | Piste |
|----------|--------|
| Front charge mais « Failed to fetch » / API | Mauvaise `NEXT_PUBLIC_API_URL` **au build** ; CORS backend ; pare-feu / ports (3200 ou 30320). |
| Login OK, images `/uploads/` cassées | URL API incohérente ; volume uploads manquant en Compose ; en K8s pod sans stockage persistant. |
| Erreur push Docker | Credential Jenkins `dockerhub` ; droits sur l’org Hub. |
| `kubectl apply` échoue | Secret `pismartsite-runtime` ; `SKIP_KUBE_ATLAS_SECRET_CHECK=true` seulement si vous assumez le risque. |
| API injoignable depuis le navigateur | Ouvrir le port backend (3200 ou NodePort 30320) ; vérifier `NEXT_PUBLIC_API_URL` = cette URL **au build** du front. |

---

## 8. Fichiers utiles

| Fichier | Rôle |
|---------|------|
| [`Jenkinsfile`](../Jenkinsfile) | CI + build/push + option K8s |
| [`docker-compose.yml`](../docker-compose.yml) | Référence runtime (réseau, env, volumes) |
| [`docker-compose.jenkins.yml`](../docker-compose.jenkins.yml) | Agent Jenkins local |
| [`scripts/jenkins-k8s-deploy.sh`](../scripts/jenkins-k8s-deploy.sh) | Substitution des tags + `kubectl apply` |
| [`k8s/deployment-core.yaml`](../k8s/deployment-core.yaml) | Backend + frontend (env, CORS) |

Pour la configuration générale des jobs (SCM, plugins, Sonar), voir [`JENKINS-CI-CD.md`](./JENKINS-CI-CD.md).
