"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function MetasPage() {
  const [treinos, setTreinos] = useState("");
  const [calorias, setCalorias] = useState("");
  const [inicio, setInicio] = useState("");
  const [termino, setTermino] = useState("");
  const [nome, setNome] = useState("");

  const [metas, setMetas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  const usuario = auth.currentUser;

  // 🔥 Função para buscar metas do banco
  const carregarMetas = async () => {
    if (!usuario) return;

    const q = query(
      collection(db, "metas"),
      where("userId", "==", usuario.uid)
    );

    const snapshot = await getDocs(q);

    const lista: any[] = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setMetas(lista);
  };

  // 🔥 Salvar meta no Firestore
  const salvarMeta = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario) {
      alert("Você precisa estar logado para salvar metas!");
      return;
    }

    setCarregando(true);

    try {
      await addDoc(collection(db, "metas"), {
        nome,
        treinos,
        calorias,
        inicio,
        termino,
        userId: usuario.uid,
        criadoEm: new Date(),
      });

      alert("Meta salva com sucesso!");

      setNome("");
      setTreinos("");
      setCalorias("");
      setInicio("");
      setTermino("");

      carregarMetas();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar meta");
    }

    setCarregando(false);
  };

  useEffect(() => {
    carregarMetas();
  }, [usuario]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 mt-30">
        Definir Meta de Treino
      </h1>

      <p className="text-center text-bold text-xl mb-10">
        Defina suas metas agora para seus treinos e acompanhe seus resultados
      </p>

      <form
        onSubmit={salvarMeta}
        className="bg-gray-900 p-5 rounded-xl max-w-200 space-y-4 w-full mb-10"
      >
        <div>
          <label className="block mb-1">Nome da sua Meta</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
            placeholder="Ex: Emagrecer para o Verão"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Quantidade de Treinos no Mês</label>
          <input
            type="number"
            value={treinos}
            onChange={(e) => setTreinos(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
            placeholder="Ex: 20"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Calorias que deseja perder</label>
          <input
            type="number"
            value={calorias}
            onChange={(e) => setCalorias(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
            placeholder="Ex: 5000"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Data de Início</label>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Data de Término</label>
          <input
            type="date"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 w-full mb-5"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 p-3 rounded-lg font-semibold"
        >
          {carregando ? "Salvando..." : "Salvar Meta"}
        </button>
      </form>

      {/* 🔥 Renderização das metas salvas */}
      <div className="w-full max-w-200 space-y-4 p-5">
        <p className="mb-5"><b className="p-5">Minhas metas salvas</b></p>
        
        {metas.map((meta) => (
          <div
            key={meta.id}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h2 className="text-xl font-bold text-green-400 mb-2">
              {meta.nome}
            </h2>

            <p>🏋️ Treinos planejados: {meta.treinos}</p>
            <p>🔥 Calorias a perder: {meta.calorias}</p>
            <p>📅 Início: {meta.inicio}</p>
            <p>🏁 Término: {meta.termino}</p>
          </div>
        ))}

        {metas.length === 0 && (
          <p className="text-center text-gray-400">
            Nenhuma meta cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}