import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function excluirMeta(id: string) {
  const ref = doc(db, "metas", id);
  await deleteDoc(ref);
}
