import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export async function buscarCaloriasHoje(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;

  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, "treinos"),
    where("userId", "==", user.uid),
    where("createdAt", ">=", Timestamp.fromDate(inicioDia))
  );

  const snapshot = await getDocs(q);

  let total = 0;
  snapshot.forEach((doc) => {
    total += doc.data().calorias || 0;
  });

  return total;
}