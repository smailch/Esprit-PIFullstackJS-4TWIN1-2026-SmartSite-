# Build-arg obligatoire en prod/K8s : URL API vue par le navigateur (NodePort Ingress, etc.)
# docker build --build-arg NEXT_PUBLIC_API_URL=http://<node-ip>:30320 -t <user>/pismartsite-frontend:<tag> .
ARG NODE_IMAGE=node:20-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

FROM ${NODE_IMAGE}
WORKDIR /app
ENV NODE_ENV=production
LABEL org.opencontainers.image.title="pismartsite-frontend"
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Next doit pouvoir créer `.next/cache/*` avec `USER node` (après COPY, les fichiers appartiennent à root).
RUN chown -R node:node /app/.next /app/public
EXPOSE 3000
USER node
# SSR / route handlers : définir au run INTERNAL_API_URL (ex. compose : http://backend:3200 ou
# hors compose : `-e INTERNAL_API_URL=http://host.docker.internal:3200`). NEXT_PUBLIC_* = ce que voit le navigateur.
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
