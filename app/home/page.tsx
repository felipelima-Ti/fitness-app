"use client";

import { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, Dumbbell, User } from "lucide-react";
import { salvarTreino } from "@/lib/services/treino";
import { calcularCalorias } from "@/lib/calcularcalorias";
import { buscarCaloriasHoje } from "@/lib/services/buscarTreinos";
import type { Treino } from "@/lib/services/treino";
import { buscarTodosTreinos } from "@/lib/services/busca";
import { calcularSemana } from "@/lib/utils/semana";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { excluirTreino } from "@/lib/services/excluirTreino";
import Link from "next/link";
import { buscarMetas } from "@/lib/services/buscarMetas";
import { calcularProgressoMeta } from "@/lib/utils/progressoMeta";
import { excluirMeta } from "@/lib/services/excluirMeta";

export function filtrarTreinosAvancado(
  treinos: Treino[],
  nome: string,
  dataInicio: string,
  dataFim: string
) {
  return treinos.filter((treino) => {
    const matchNome = treino.exercicio
      .toLowerCase()
      .includes(nome.toLowerCase());

    let matchData = true;

    if (dataInicio || dataFim) {
      const dataTreino = treino.createdAt
        .toDate()
        .toISOString()
        .split("T")[0];

      if (dataInicio && dataTreino < dataInicio) {
        matchData = false;
      }

      if (dataFim && dataTreino > dataFim) {
        matchData = false;
      }
    }

    return matchNome && matchData;
  });
}

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
useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const dadosMetas = await buscarMetas();
      setMetas(dadosMetas);
    }
  });

  return () => unsub();
}, []);
async function handleExcluirTreino(id: string, calorias: number) {
  if (!confirm("Deseja realmente excluir este treino?")) return;

  try {
    await excluirTreino(id);

    setTreinos((prev) => prev.filter((t) => t.id !== id));

    setCaloriasHoje((prev) => Math.max(0, prev - calorias));

    alert("Treino excluído com sucesso");
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir treino");
  }
}
async function handleExcluirMeta(id: string) {
  if (!confirm("Deseja realmente excluir esta meta?")) return;

  try {
    await excluirMeta(id);

    setMetas((prev) => prev.filter((meta) => meta.id !== id));

    alert("Meta excluída com sucesso");
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir meta");
  }
}

  const [exercicio, setExercicio] = useState("");
  const [peso, setPeso] = useState("");
  const [duracao, setDuracao] = useState("");
  const [met, setMet] = useState(6);
  const [caloriasHoje, setCaloriasHoje] = useState(0);
  const [loading, setLoading] = useState(false);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [treinosDoDia, setTreinosDoDia] = useState<Treino[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const treinosFiltrados = filtrarTreinosAvancado(
  treinos,
  buscaNome,
  dataInicio,
  dataFim
);
  const semana = calcularSemana(treinos);
  const totalSemana = calcularTotalSemana(semana);
  const [metas, setMetas] = useState<any[]>([]);
  
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
      setMet(6);

      alert("Treino salvo com sucesso 💪");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar treino");
    } finally {
      setLoading(false);
    }
  }
  function abrirModal(dia: string) {
  const treinosFiltrados = treinos.filter((t) => {
    const dataTreino = t.createdAt
      .toDate()
      .toLocaleDateString();

    return dataTreino === dia;
  });

  setDiaSelecionado(dia);
  setTreinosDoDia(treinosFiltrados);
  setModalAberto(true);
}
function nomeDoDia(data: string) {
  const [dia, mes, ano] = data.split("/").map(Number);

  const date = new Date(ano, mes - 1, dia);

  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
  });
}
function ordenarSemana(semanaObj: Record<string, number>) {
  const ordem = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  return Object.entries(semanaObj).sort(([dataA], [dataB]) => {
    const diaA = nomeDoDia(dataA);
    const diaB = nomeDoDia(dataB);

    return ordem.indexOf(diaA) - ordem.indexOf(diaB);
  });
}
function calcularTotalSemana(semanaObj: Record<string, number>) {
  return Object.values(semanaObj).reduce((total, atual) => total + atual, 0);
}
 
  return (
    <div className="min-h-screen">
      {/* Header */}
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MFitness</h1>
        <nav className="flex gap-5 text-sm">
      <button className="flex items-center gap-1">
            <Dumbbell size={16} /> <Link href="#treinos">Treinos</Link>
          </button>
      <button className="flex items-center gap-1">
            <Calendar size={16} /> <Link href="/metas">Metas</Link>
          </button>
      <button className="flex items-center gap-1">
          <User size={16} /> <Link href="/profile">Perfil</Link>
        </button>
        </nav>
      </header>
<div className="bg-gray-950">
      {/* Main */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Registro de Treino */}
        <Card className="md:col-span-2 rounded-2xl shadow text-white bg-gray-800">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Registro de Treino
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-800">
          <input
            placeholder="Exercício"
            className="p-2 rounded border-1 text-white"
            value={exercicio}
            onChange={(e) => setExercicio(e.target.value)}
          />
              <select
                className="p-2 rounded border-1"
                value={met}
                onChange={(e) => setMet(Number(e.target.value))}
              >
                <option className="text-black" value={3.5}>Treino leve</option>
                <option className="text-black" value={6}>Treino moderado</option>
                <option className="text-black" value={8}>Treino intensivo</option>
                <option className="text-black" value={10}>HIIT</option>
              </select>

          <input
            placeholder="Seu Peso (kg)"
            type="number"
            className="p-2 rounded border-1 border-white-600"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />

          <input
            placeholder="Duração (min)"
            type="number"
            className="p-2 rounded border-1"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
          />
        </div>

      <div className="text-center">
          <Button
            onClick={handleSalvarTreino}
            disabled={loading}
            className="mt-4 bg-blue-700 text-white hover:bg-blue-600 w-50"
           >
            {loading ? "Salvando..." : "Salvar Treino"}
          </Button>
      </div>
    </CardContent>
  </Card>

        {/* Calorias Hoje */}
<Card className="rounded-2xl shadow text-white bg-gray-800">
    <CardContent className="p-6 flex flex-col items-center justify-center">
    <Flame size={32} className="text-red-500" />
    <p className="text-sm mt-2">Calorias Queimadas Hoje</p>
  <h3 className="text-3xl font-bold">
    {caloriasHoje} kcal
  </h3>
    </CardContent>
</Card>
<Card className="rounded-2xl shadow text-white bg-gray-800">
  <CardContent className="p-6">
    <p className="mt-2 text-lg font-semibold mb-4">Minhas Metas</p>

    {metas.length === 0 ? (
      <p className="text-sm text-gray-400">
        Nenhuma meta cadastrada ainda
      </p>
    ) : (
      <div className="space-y-4">
        {metas.map((meta) => {
          const {
            caloriasQueimadas,
            objetivo,
            progresso,
            treinosNoPeriodo,
          } = calcularProgressoMeta(treinos, meta);

          return (
            <div
              key={meta.id}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700"
            >
              <p className="font-bold text-blue-400 text-lg">
                {meta.nome}
              </p>

              <p className="text-sm mt-1">
                📅 {meta.inicio} → {meta.termino}
              </p>

              <p className="text-sm mt-1">
                🏋️ Treinos no período: {treinosNoPeriodo}
              </p>

              <p className="text-sm mt-1">
                🔥 Progresso: {caloriasQueimadas} / {objetivo} kcal
              </p>

              {/* BARRA DE PROGRESSO */}
              <div className="w-full bg-gray-700 rounded-full h-4 mt-3">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>

              <p className="text-xs mt-2 text-gray-300">
                {progresso.toFixed(1)}% concluído
              </p>

              {progresso >= 100 && (
                <p className="text-green-400 text-sm mt-2 font-semibold">
                  🎉 Meta concluída parabens!
                </p>
              )}
                <button
                  onClick={() => handleExcluirMeta(meta.id)}
                  className="mt-3 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white px-3 py-1 rounded text-sm"
                >
                Excluir Meta
                </button>
            </div>
          );
        })}
      </div>
    )}
  </CardContent>
</Card>

{/* Acompanhamento Semanal */}
      <Card className="md:col-span-3 rounded-2xl shadow text-black mb-30">
      <CardContent className="p-6">
        <section id="treinos"></section>
      <h2 className="text-lg font-semibold mb-4">Meus Treinos</h2>
      <div className="flex gap-2 mb-4">
  <input
    placeholder="Buscar exercício"
    className="p-2 border rounded w-33"
    value={buscaNome}
    onChange={(e) => setBuscaNome(e.target.value)}
  />
  <br></br>

  <input
    type="date"
    className="p-2 border rounded w-33"
    value={dataInicio}
    onChange={(e) => setDataInicio(e.target.value)}
    placeholder="data"
  />
</div>
<ul className="space-y-2 mb-50">
  {treinosFiltrados.map((treino) => (
    <li
      key={treino.id}
      className="bg-white p-3 rounded shadow border"
    >
     <div>
    <strong>Nome do Treino:</strong> {treino.exercicio}
    <br />
    <strong>Perda:</strong> {treino.calorias} kcal
    <br />
    <strong>Tempo:</strong> {treino.duracao} Minutos
    <br />
    <span className="text-xs text-gray-700">
      <b>
        Data: {treino.createdAt.toDate().toLocaleDateString()}
      </b>
    </span>
  </div>
<button
  onClick={() => handleExcluirTreino(treino.id, treino.calorias)}
  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
>
  Excluir
</button>
    </li>
  ))}
</ul>
<section id="semanal"></section>
          <h2 className="text-lg font-semibold mb-4">
  Acompanhamento Semanal
</h2>
<p className="text-xm mb-4">
  Total na semana : <b>{totalSemana} kcal</b>
</p>

<div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center border-20 bg-gray-300 border-gray-300">
  {ordenarSemana(semana).map(([data, calorias]) => (
    <div
      key={data}
      className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:bg-gray-100"
      onClick={() => abrirModal(data)}
    >
      <p className="text-sm font-medium capitalize">
        {nomeDoDia(data)}
      </p>

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
         {modalAberto && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px]">
      <h2 className="text-lg font-bold mb-4">
        Treinos do dia {diaSelecionado}
      </h2>

      {treinosDoDia.length === 0 ? (
        <p>Nenhum treino registrado nesse dia.</p>
      ) : (
      <ul className="space-y-2">
        {treinosDoDia.map((t) => (
         <li
          key={t.id}
          className="border p-2 rounded bg-gray-50"
           >
            <strong>{t.exercicio}</strong>
            <br />
            Calorias: {t.calorias} kcal
            <br />
            Duração: {t.duracao} min
          </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setModalAberto(false)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Fechar
      </button>
    </div>
  </div>
)}
      </main>
      </div>
    </div>
  );
}
