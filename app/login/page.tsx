"use client";

import { useState } from "react";
import { registrarUsuario, loginUsuario } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";



export default function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
  if (!email || !senha || (modoCadastro && !nome)) {
    alert("Preencha todos os campos");
    return;
  }

  setLoading(true);

  try {
    if (modoCadastro) {
      await registrarUsuario(email, senha, nome);
      router.push("/home"); 
    } else {
      await loginUsuario(email, senha);
      router.push("/home"); 
    }
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 ">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-gray-400 border-4 border-gray-300 m-3">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">
            {modoCadastro ? "Criar Conta" : "Entrar"}
          </h1>

          {modoCadastro && (
            <input
              placeholder="Nome"
              className="w-full p-2 border rounded"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Senha"
            type="password"
            className="w-full p-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button
            className="w-full bg-black text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Processando..."
              : modoCadastro
              ? "Criar Conta"
              : "Entrar"}
          </Button>

          <p className="text-sm text-center">
            {modoCadastro ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button
              className="text-blue-600 font-semibold"
              onClick={() => setModoCadastro(!modoCadastro)}
            >
              {modoCadastro ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}