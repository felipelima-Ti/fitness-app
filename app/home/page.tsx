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
  const [modoTreino, setModoTreino] = useState(false);
  const [tempoAtivo, setTempoAtivo] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [treinoAtual, setTreinoAtual] = useState({
  nome: "",
  intensidade: 6
  });
  const [modalTreinoAberto, setModalTreinoAberto] = useState(false);
  const [cronometroRodando, setCronometroRodando] = useState(false);
  
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
 function iniciarTreino() {
  if (!treinoAtual.nome) {
    alert("Digite o nome do treino antes de iniciar");
    return;
  }

  setModoTreino(true);
  setModalTreinoAberto(true);
  setTempoAtivo(0);
  setCronometroRodando(false);
}

async function finalizarTreino() {
  if (timerId) {
    clearInterval(timerId);
  }

  const minutos = Math.ceil(tempoAtivo / 60);

  const caloriasCalculadas = calcularCalorias(
    Number(peso || 70),
    minutos,
    treinoAtual.intensidade
  );

  try {
    await salvarTreino({
      exercicio: treinoAtual.nome,
      duracao: minutos,
      calorias: caloriasCalculadas,
    });

    setCaloriasHoje((prev) => prev + caloriasCalculadas);

    alert(
      `Treino finalizado!\nDuração: ${minutos} min\nCalorias: ${caloriasCalculadas}`
    );
  } catch (error) {
    alert("Erro ao salvar treino finalizado");
  }

  setModoTreino(false);
  setModalTreinoAberto(false);
  setCronometroRodando(false);
  setTreinoAtual({ nome: "", intensidade: 6 });
}
function formatarTempo(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;

  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
  function iniciarCronometro() {
  if (cronometroRodando) return;

  setCronometroRodando(true);

  const id = setInterval(() => {
    setTempoAtivo((prev) => prev + 1);
  }, 1000);

  setTimerId(id);
}
  function pausarCronometro() {
  if (timerId) {
    clearInterval(timerId);
    setTimerId(null);
  }

  setCronometroRodando(false);
}
 function fecharModalTreino() {
  if (cronometroRodando) {
    const confirmar = confirm(
      "O cronômetro está rodando. Deseja realmente sair do treino?"
    );

    if (!confirmar) return;

    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }

  setModalTreinoAberto(false);
  setModoTreino(false);
  setCronometroRodando(false);
  setTempoAtivo(0);
}
  return (
    <div className="min-h-screen">
      {/* Header */}
   <header className="fixed top-0 left-0 w-full bg-black text-white px-6 py-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">MFitness</h1>
        <nav className="flex gap-5 text-sm">
      <button className="flex items-center gap-1">
      <Link className="flex" href="#treinos"><Dumbbell className="mr-1" size={16} />Treinos</Link>
          </button>
      <button className="flex items-center gap-1">
       <Link className="flex" href="/metas"><Calendar className="mr-1" size={16} />Metas</Link>
          </button>
      <button className="flex items-center gap-1">
       <Link className="flex" href="/profile"><User className="mr-1" size={16} />Perfil</Link>
        </button>
        </nav>
      </header>
<div className="bg-gray-950 mt-10">
      {/* Main */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Registro de Treino */}
    
      
   <Card className="md:col-span-0 rounded-2xl border-0 shadow text-white bg-gray-900">
  <CardContent className="p-6">

    <h2 className="text-lg font-semibold mb-4">
      Iniciar Novo Treino
    </h2>

    <input
      placeholder="Nome do treino"
      className="p-2 rounded border w-full mb-3 text-white bg-gray-900"
      value={treinoAtual.nome}
      onChange={(e) =>
        setTreinoAtual({ ...treinoAtual, nome: e.target.value })
      }
    />

    <select
      className="p-2 rounded border w-full mb-3 bg-gray-900"
      value={treinoAtual.intensidade}
      onChange={(e) =>
        setTreinoAtual({
          ...treinoAtual,
          intensidade: Number(e.target.value),
        })
      }
    >
      <option value={3.5}>Leve</option>
      <option value={6}>Moderado</option>
      <option value={8}>Intenso</option>
      <option value={10}>HIIT</option>
    </select>

    <Button
      onClick={iniciarTreino}
      className="w-full bg-green-700 hover:bg-green-600"
    >
      Iniciar Treino
    </Button>

  </CardContent>
</Card>
  <Card className="md:col-span-2 rounded-2xl border-0 shadow text-white bg-gray-900">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Registro de treino
          </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-900">
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
<Card className="rounded-2xl shadow border-white/20 text-white bg-gray-900">
    <CardContent className="p-6 flex flex-col items-center justify-center">
    <Flame size={32} className="text-red-500" />
    <p className="text-sm mt-2">Calorias Queimadas Hoje</p>
  <h3 className="text-3xl font-bold">
    {caloriasHoje} kcal
  </h3>
    </CardContent>
</Card>
    

{modalTreinoAberto && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="bg-gray-900 text-white p-8 rounded-2xl w-[90%] max-w-md text-center relative">

      {/* BOTÃO DE FECHAR NO CANTO */}
      <button
        onClick={fecharModalTreino}
        className="absolute top-3 right-3 text-white text-xl hover:text-red-400"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Treino em Andamento
      </h2>

      <p className="mb-2 text-lg font-semibold text-blue-400">
        {treinoAtual.nome}
      </p>

      <div className="text-5xl font-mono my-6">
        {formatarTempo(tempoAtivo)}
      </div>

      <p className="mb-6 text-sm text-gray-400">
        Intensidade: {treinoAtual.intensidade}
      </p>

      <div className="flex flex-col gap-3">

        {!cronometroRodando ? (
          <Button
            onClick={iniciarCronometro}
            className="bg-green-700 hover:bg-green-600 w-full"
          >
            ▶ Iniciar Cronômetro
          </Button>
        ) : (
          <Button
            onClick={pausarCronometro}
            className=" mb-50 bg-yellow-700 hover:bg-yellow-600 w-full"
          >
             Pausar
          </Button>
        )}
        <Button
          onClick={finalizarTreino}
          className="bg-red-700 hover:bg-red-600 w-full"
        >
          Finalizar Treino
        </Button>
      </div>
    </div>
  </div>
)}

<Card className=" md:col-span-4 rounded-2xl border-0 shadow text-white bg-gray-900">
  <CardContent className="p-6">
    <div className="flex text-center">
   <Calendar className="text-blue-500"></Calendar> <p className="ml-2 text-lg font-semibold mb-4 text-white/90">Minhas Metas</p>
  </div>
    {metas.length === 0 ? (
      <p className="text-center text-xs">
        Nenhuma meta cadastrada ainda
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metas.map((meta) => {
          const {
            caloriasQueimadas,
            objetivo,
            progresso,
            treinosNoPeriodo,
          } = calcularProgressoMeta(treinos, meta);

          return (
           <div key={meta.id}className=" bg-gray-800 p-4 rounded-lg border border-gray-700 w-full md:w-[600px]">
              <p className="mb-5 font-bold text-blue-500 text-lg">
                {meta.nome}
              </p>
              <div className="flex">
                <Calendar className="text-blue-500 mr-2 mb-2 "></Calendar><b>{meta.inicio} → {meta.termino}</b>
              </div>
              <div className="flex">
             
                <Dumbbell className="text-orange-300/50 mr-2 mb-2 "></Dumbbell> <b>{treinosNoPeriodo}</b>
             
              </div>
              <div className="flex">
      
                <Flame className="text-red-500 mr-2 mb-2 "></Flame> <b>{caloriasQueimadas} / {objetivo} kcal</b>
              
              </div>
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
      <Card className="md:col-span-4 rounded-2xl border-0 shadow text-white mb-30 bg-gray-900">
      <CardContent className="p-6">
        <section id="treinos"></section>
        <div className="flex">
          <Dumbbell size={25} className="text-orange-300/50 mr-2 " />
        <h2 className="text-xl font-semibold mb-4">Meus Treinos</h2>
     </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
         
        
        
        <p className="mt-2 text-xm font-bold">Buscar Exercicio:</p>
  <input
    placeholder="Nome do exercicio"
    className="border-1 border-white/30 p-2 rounded w-33 bg-gray-900 text-white mr-10"
    value={buscaNome}
    onChange={(e) => setBuscaNome(e.target.value)}
  />

<p className="mt-2 text-xm font-bold">Buscar Data</p>

  <input
    type="date"
    className="p-2 border-1 border-white/30 rounded w-33 bg-gray-900 text-white/50 [color-scheme:dark]"
    value={dataInicio}
    onChange={(e) => setDataInicio(e.target.value)}
    placeholder="data"
  />
</div>
<ul className="space-y-2 mb-10">
  {treinosFiltrados.map((treino) => (
    <li
      key={treino.id}
      className="p-3 rounded shadow  bg-gray-800 mb-10"
    >
     <div>
    <strong>Nome do Treino:</strong> {treino.exercicio}
    <br />
    <strong>Perda:</strong> {treino.calorias} kcal
    <br />
    <strong>Tempo:</strong> {treino.duracao} Minutos
    <br />
    <span className="text-xs text-white/70">
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
<section id="semanal">
          <h2 className="text-xl font-semibold mb-4">
  Acompanhamento Semanal
</h2>
<hr className="border-1 border-blue-500"></hr>
<p className=" mt-5 text-xm mb-4">
 <b> Total na semana :</b> {totalSemana} kcal
</p>

<div className="rounded-xl grid grid-cols-2 md:grid-cols-7 gap-3 text-center bg-gray-900 ">
  {ordenarSemana(semana).map(([data, calorias]) => (
    <div
      key={data}
      className="bg-gray-800 border-1 border-white/20 rounded-xl p-3 shadow-sm cursor-pointer hover:bg-gray-800"
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
</section>
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
