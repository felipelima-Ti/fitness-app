import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface Treino {
  id: string;
  exercicio: string;
  duracao: number;
  calorias: number;
  uid: string;
  createdAt: Timestamp;
}

export async function salvarTreino(treino: {
  exercicio: string;
  duracao: number;
  calorias: number;
}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await addDoc(collection(db, "treinos"), {
    ...treino,
    userId: user.uid,
    createdAt: Timestamp.now(),
  });
}
