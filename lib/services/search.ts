import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Treino } from "./treino";

export async function buscarTreinosPorMes(
  userId: string,
  mes: number, // 0-11
  ano: number
): Promise<Treino[]> {
  const inicio = new Date(ano, mes, 1);
  const fim = new Date(ano, mes + 1, 1);

  const q = query(
    collection(db, "treinos"),
    where("userId", "==", userId),
    where("createdAt", ">=", inicio),
    where("createdAt", "<", fim)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Treino[];
}