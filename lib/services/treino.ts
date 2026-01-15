"use client";

import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export type Treino = {
  id?: string;
  exercicio: string;
  duracao: number;
  calorias: number;
  createdAt: Timestamp;
  userId: string;
};

export async function salvarTreino(data: {
  exercicio: string;
  duracao: number;
  calorias: number;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  await addDoc(collection(db, "treinos"), {
    ...data,
    userId: user.uid,
    createdAt: Timestamp.now(),
  });
}