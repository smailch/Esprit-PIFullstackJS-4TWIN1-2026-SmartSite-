/**
 * Identifiant de conversation côté client (messagerie / assistant).
 * Préfère `crypto.randomUUID()` (non devinable) avec repli pour environnements anciens.
 */
export function createConversationId(): string {
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (c?.randomUUID) {
    return `conv_${c.randomUUID()}`;
  }
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
