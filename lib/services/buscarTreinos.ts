"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import type { Treino } from "./treino";

export async function buscarTodosTreinos(): Promise<Treino[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "treinos"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Treino, "id">),
  }));
}

export async function buscarCaloriasHoje(): Promise<number> {
  const treinos = await buscarTodosTreinos();

  const hoje = new Date().toLocaleDateString();

  return treinos
    .filter(
      (t) => t.createdAt.toDate().toLocaleDateString() === hoje
    )
    .reduce((total, t) => total + t.calorias, 0);
}