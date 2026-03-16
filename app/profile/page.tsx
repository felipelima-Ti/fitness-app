"use client";

import { analisarMes } from "@/lib/utils/analiseMes";
import { buscarTreinosPorMes } from "@/lib/services/search";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buscarTodosTreinos } from "@/lib/services/busca";
import type { Treino } from "@/lib/services/treino";
import { gerarGraficoUltimos7Dias } from "@/lib/utils/grafico";
import { getUsuarioAtual } from "@/lib/services/user";
import { auth } from "@/lib/firebase";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Profile() {
const [mes, setMes] = useState<number>(new Date().getMonth());
const [ano, setAno] = useState<number>(new Date().getFullYear());
const [treinosMes, setTreinosMes] = useState<Treino[]>([]);
const [analiseMes, setAnaliseMes] = useState<any>(null);

  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const dados = await buscarTodosTreinos();
        setTreinos(dados);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const totalCalorias = treinos.reduce(
    (acc, t) => acc + t.calorias,
    0
  );

  const totalTreinos = treinos.length;

  const grafico = gerarGraficoUltimos7Dias(treinos);

  const melhorDia = Math.max(...grafico.valores);
  const indice = grafico.valores.indexOf(melhorDia);
  const melhorDiaLabel = grafico.labels[indice];

  const data = {
    labels: grafico.labels,
    datasets: [
      {
        label: "Calorias queimadas",
        data: grafico.valores,
        borderColor: "black",
        backgroundColor: "gray",
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 h-350 bg-gradient-to-b from-gray-950 to-gray-950 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Perfil do Usuário
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h2 className="font-semibold">Dados</h2>
            <p>Total de treinos: {totalTreinos}</p>
            <p>Total calorias: {totalCalorias} kcal</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h2 className="font-semibold">Análise</h2>

            <p>
              Melhor dia: <b>{melhorDiaLabel}</b>
            </p>

            <p>
              Maior perda: <b>{melhorDia} kcal</b>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">
             Calorias queimadas Últimos 7 dias
            </h2>
            <Line data={data} className="bg-gray-800 rounded" />
          </CardContent>
        </Card>
      </div>
 <div className=" flex grid md:grid-cols-2 gap-4">
      <Card className="mt-6 bg-gray-800 ">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-white">
            Histórico Completo
          </h2>
      
          <ul className="space-y-2">
            {treinos.map((t) => (
              <li
                key={t.id}
                className="border p-2 rounded bg-gray-700 text-white"
              >
                <strong>{t.exercicio}</strong> –{" "}
                {t.calorias} kcal – {t.duracao} min
                <br />
                <span className="text-xs">
                  {t.createdAt
                    .toDate()
                    .toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
          </Card>
        <Card className="mt-6 bg-gray-800 text-white">
          <CardContent>
          <div className="bg-gray-800  rounded text-white">
            <p className="mr-2 font-semibold mb-7">Busca avançada de treinos</p>
        <div className="gap-2 mb-4 text-lg bg-gray-700 text-white p-2 rounded border w-70">
 <select
  className=" text-whitep-2 rounded h-11"
  onChange={(e) => setMes(Number(e.target.value))}
>
  <option className="text-black" value="">Escolha o mês</option>
  <option className="text-black" value="0">Janeiro</option>
  <option className="text-black" value="1">Fevereiro</option>
  <option className="text-black" value="2">Março</option>
  <option className="text-black" value="3">Abril</option>
  <option className="text-black" value="4">Maio</option>
  <option className="text-black" value="5">Junho</option>
  <option className="text-black" value="6">Julho</option>
  <option className="text-black" value="7">Agosto</option>
  <option className="text-black" value="8">Setembro</option>
  <option className="text-black" value="9">Outubro</option>
  <option className="text-black" value="10">Novembro</option>
  <option className="text-black" value="11">Dezembro</option>
</select>

 
  {analiseMes && (
  <Card className="mt-20 bg-gray-800 text-white">
    <CardContent className="p-4">
      <h2 className="font-semibold text-lg">Resumo do mês</h2>

      <p>Total treinos: {analiseMes.totalTreinos}</p>
      <p>Total calorias: {analiseMes.totalCalorias} kcal</p>
      <p>Melhor dia: {analiseMes.melhorDia}</p>
      <p>Maior queima: {analiseMes.maior} kcal</p>
      <ul className="space-y-2 mt-20">
  {treinosMes.map((t) => (
    <li key={t.id} className="border p-2 rounded bg-gray-700 text-white">
      <strong>{t.exercicio}</strong> – {t.calorias} kcal – {t.duracao} min
      <br />
      <span className="text-xs">
        {t.createdAt.toDate().toLocaleDateString()}
      </span>
    </li>
  ))}
</ul>
    </CardContent>
  </Card>
)}

</div>
 <button
    className="bg-gray-700 text-white px-4 rounded w-60 h-10 mt-5 border"
    onClick={async () => {
  const user = getUsuarioAtual();
  if (!user) {
    alert("Usuário não logado!");
    return;
  }
  const dados = await buscarTreinosPorMes(user.uid, mes, ano);
  setTreinosMes(dados);
  setAnaliseMes(analisarMes(dados));
}}
  >
    Buscar mês
  </button>
  </div>
  </CardContent>
  </Card>
  </div> 
    </div>
  );
}