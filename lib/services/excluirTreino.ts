import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function excluirTreino(id: string) {
  try {
    await deleteDoc(doc(db, "treinos", id));
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    throw error;
  }
}