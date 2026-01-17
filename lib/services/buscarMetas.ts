import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export async function buscarMetas() {
  const usuario = auth.currentUser;

  if (!usuario) return [];

  const q = query(
    collection(db, "metas"),
    where("userId", "==", usuario.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
