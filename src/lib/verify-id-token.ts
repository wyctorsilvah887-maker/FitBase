import { firebaseConfig } from "@/firebase/config";

/**
 * Confere no Firebase Auth se o token é válido e devolve o uid (ou null).
 * Usa a API REST pública, então não precisa do SDK de administrador.
 */
export async function verifyIdToken(idToken: string | undefined): Promise<string | null> {
  if (!idToken || idToken.length > 4096) return null;
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { users?: { localId?: string }[] };
    return data.users?.[0]?.localId ?? null;
  } catch {
    return null;
  }
}
