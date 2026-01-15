import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function registrarUsuario(
  email: string,
  senha: string,
  nome: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    nome,
    email,
    criadoEm: new Date(),
  });

  return cred.user;
}

export async function loginUsuario(email: string, senha: string) {
  const cred = await signInWithEmailAndPassword(auth, email, senha);
  return cred.user;
}