import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function buscarUsuario(uid: string) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();
}