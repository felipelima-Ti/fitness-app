import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { Treino } from "./treino";

export async function buscarTodosTreinos(): Promise<Treino[]> {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "treinos"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Treino[];
}