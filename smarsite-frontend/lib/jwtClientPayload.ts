/**
 * Décode le payload d’un JWT côté navigateur (affichage / rôle UI).
 * La signature n’est pas vérifiée ici : l’API Nest valide le token sur chaque requête.
 */
export function decodeJwtPayloadLoose(token: string | null): Record<
  string,
  unknown
> | null {
  if (!token) return null;
  try {
    const b64 = token.split(".")[1];
    if (!b64) return null;
    return JSON.parse(atob(b64)) as Record<string, unknown>; // NOSONAR
  } catch {
    return null;
  }
}
