import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMQyKRaQkXLvpYleSzXZgHZZwcF2IyjEk",
  authDomain: "fitness-app-6f093.firebaseapp.com",
  projectId: "fitness-app-6f093",
  storageBucket: "fitness-app-6f093.appspot.com",
  messagingSenderId: "471526500657",
  appId: "1:471526500657:web:36f5cbfa1032385d726810",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

console.log("🔥 Firebase conectado:", app.options.projectId);
export const auth = getAuth(app);
export const db = getFirestore(app);