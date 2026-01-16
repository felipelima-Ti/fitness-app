import { auth } from "@/lib/firebase";

export function getUsuarioAtual() {
  const user = auth.currentUser;

  if (!user) return null;

  return {
    email: user.email,
    uid: user.uid,
  };
}