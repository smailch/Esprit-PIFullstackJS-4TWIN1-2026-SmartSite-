/**
 * Base URL du backend pour les `route.ts` Next.js (exécution **serveur** uniquement).
 * `INTERNAL_API_URL` en priorité, sinon `NEXT_PUBLIC_API_URL` (souvent déjà définie),
 * sinon repli local (dev). La validation d’auth reste côté Nest.
 */
export function getServerBackendBaseUrl(): string {
  const raw =
    process.env.INTERNAL_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://127.0.0.1:3200";
}
