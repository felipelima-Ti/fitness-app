"use client";

import { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, Dumbbell, User } from "lucide-react";
import { salvarTreino } from "@/lib/services/treino";
import { calcularCalorias } from "@/lib/utilss";
import { buscarCaloriasHoje } from "@/lib/services/treinoo";
import { Treino } from "@/lib/services/treino";
import { filtrarTreinos } from "@/lib/filtro";
import { buscarTodosTreinos } from "@/lib/services/buscar";
import { calcularSemana } from "@/lib/utils/semana";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {

 useEffect(() => {
  async function carregarCalorias() {
    const totalHoje = await buscarCaloriasHoje();
    setCaloriasHoje(totalHoje);  
  }
  carregarCalorias();
}, []);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const dados = await buscarTodosTreinos();
      setTreinos(dados);
    }
  });
  return () => unsub();
  }, []);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const totalHoje = await buscarCaloriasHoje();
      setCaloriasHoje(totalHoje);
    }
    });
  return () => unsub();
}, []);

useEffect(() => {
  async function carregarTreinos() {
    const dados = await buscarTodosTreinos();
    setTreinos(dados);
  }

  carregarTreinos();
}, []);
  const [exercicio, setExercicio] = useState("");
  const [peso, setPeso] = useState("");
  const [duracao, setDuracao] = useState("");
  const [met, setMet] = useState(6);
  const [caloriasHoje, setCaloriasHoje] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calorias, setCalorias] = useState("");
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaData, setBuscaData] = useState("");
  const treinosFiltrados = filtrarTreinos(
  treinos,
  buscaNome,
  buscaData
  );
  const semana = calcularSemana(treinos);
  
  async function handleSalvarTreino() {
     if (!exercicio || !peso || !duracao) {
      alert("Preencha todos os campos");
      return;
    }
     const caloriasCalculadas = calcularCalorias(
      Number(peso),
      Number(duracao),
      met
    );

    setLoading(true);

    try {
      await salvarTreino({
        exercicio,
        duracao: Number(duracao),
        calorias: caloriasCalculadas,
      });
       setCaloriasHoje((prev) => prev + caloriasCalculadas);
      // limpa formulário
      setExercicio("");
      setDuracao("");
      setCalorias("");
      setMet(6);

      alert("Treino salvo com sucesso 💪");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar treino");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MyFitness</h1>
        <nav className="flex gap-6 text-sm">
          <button className="flex items-center gap-1">
            <Dumbbell size={16} /> Treinos
          </button>
          <button className="flex items-center gap-1">
            <Calendar size={16} /> Semanal
          </button>
          <button className="flex items-center gap-1">
            <User size={16} /> Perfil
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Registro de Treino */}
         <Card className="md:col-span-2 rounded-2xl shadow text-black">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Registro de Treino
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-white">
              <input
                placeholder="Exercício"
                className="p-2 rounded border-2"
                value={exercicio}
                onChange={(e) => setExercicio(e.target.value)}
              />

              <select
                className="p-2 rounded border-2"
                value={met}
                onChange={(e) => setMet(Number(e.target.value))}
              >
                <option value={3.5}>Treino leve</option>
                <option value={6}>Treino moderado</option>
                <option value={8}>Treino intensivo</option>
                <option value={10}>HIIT</option>
              </select>

              <input
                placeholder="Seu Peso (kg)"
                type="number"
                className="p-2 rounded border-2"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />

              <input
                placeholder="Duração (min)"
                type="number"
                className="p-2 rounded border-2"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              />
            </div>

            <div className="text-center">
              <Button
                onClick={handleSalvarTreino}
                disabled={loading}
                className="mt-4 bg-black text-white"
              >
                {loading ? "Salvando..." : "Salvar Treino"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calorias Hoje */}
        <Card className="rounded-2xl shadow text-black">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Flame size={32} className="text-red-500" />
            <p className="text-sm mt-2">Calorias Queimadas Hoje</p>
            <h3 className="text-3xl font-bold">
              {caloriasHoje} kcal
            </h3>
          </CardContent>
        </Card>

        {/* Acompanhamento Semanal */}
        <Card className="md:col-span-3 rounded-2xl shadow text-black">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Meus Treinos</h2>
            <div className="flex gap-4 mb-4">
  <input
    placeholder="Buscar exercício"
    className="p-2 border rounded"
    value={buscaNome}
    onChange={(e) => setBuscaNome(e.target.value)}
  />

  <input
    type="date"
    className="p-2 border rounded w-34"
    value={buscaData}
    onChange={(e) => setBuscaData(e.target.value)}
  />
</div>
<ul className="space-y-2 mb-50">
  {treinosFiltrados.map((treino) => (
    <li
      key={treino.id}
      className="bg-white p-3 rounded shadow border"
    >
      <strong>Nome do Treino:</strong> {treino.exercicio}{" "}
      <br></br>
      <strong>Perda:</strong> {treino.calorias} kcal 
      <br></br>  
      <strong>Tempo:</strong> {treino.duracao} Minutos   
      <br />
      <span className="text-xs text-gray-700">
        <b>
        Data: {treino.createdAt.toDate().toLocaleDateString()}
        </b>
      </span>
    </li>
  ))}
</ul>
          <h2 className="text-lg font-semibold mb-4">
  Acompanhamento Semanal
</h2>

<div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
  {Object.entries(semana).map(([dia, calorias]) => (
    <div
      key={dia}
      className="bg-white rounded-xl p-3 shadow-sm"
    >
      <p className="text-sm font-medium">{dia}</p>
      <p className="text-xs text-gray-500">
        {calorias > 0 ? "Treino" : "Descanso"}
      </p>
      <p className="text-sm font-semibold">
        {calorias} kcal
      </p>
    </div>
  ))}
</div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
