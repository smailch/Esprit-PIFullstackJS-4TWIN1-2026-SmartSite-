# Production : secrets via env au run (--env-file, Secret K8s) — pas hardcodés ici.
# Build : depuis smartsite-backend/ → docker build -t <user>/pismartsite-backend:<tag> .
ARG NODE_IMAGE=node:20-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM ${NODE_IMAGE}
WORKDIR /app
ENV NODE_ENV=production
LABEL org.opencontainers.image.title="pismartsite-backend"
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# Multer utilise ./uploads au chargement ; user node doit pouvoir écrire.
RUN mkdir -p /app/uploads/progress-photos /app/uploads/progress /app/uploads/humans \
  && chown -R node:node /app
EXPOSE 3200
USER node
CMD ["node", "dist/main.js"]
