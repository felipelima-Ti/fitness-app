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
    <div className="min-h-screen bg-gray-100 p-6 h-350">
      <h1 className="text-2xl font-bold mb-4">
        Perfil do Usuário
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Dados</h2>
            <p>Total de treinos: {totalTreinos}</p>
            <p>Total calorias: {totalCalorias} kcal</p>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">
             Calorias queimadas Últimos 7 dias
            </h2>

            <Line data={data} />
          </CardContent>
        </Card>
      </div>
 <div className=" flex grid md:grid-cols-2 gap-4">
      <Card className="mt-6">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Histórico Completo
          </h2>

          <ul className="space-y-2">
            {treinos.map((t) => (
              <li
                key={t.id}
                className="border p-2 rounded bg-white"
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
        <Card className="mt-6">
          <CardContent>
          <div className="">
        <div className="gap-2 mb-4 text-lg font-semibold">
       <p className="mr-2">Busca avançada de treinos</p>
 <select
  className="border-2 border-black p-2 rounded h-11"
  onChange={(e) => setMes(Number(e.target.value))}
>
  <option value="">Escolha o mês</option>
  <option value="0">Janeiro</option>
  <option value="1">Fevereiro</option>
  <option value="2">Março</option>
  <option value="3">Abril</option>
  <option value="4">Maio</option>
  <option value="5">Junho</option>
  <option value="6">Julho</option>
  <option value="7">Agosto</option>
  <option value="8">Setembro</option>
  <option value="9">Outubro</option>
  <option value="10">Novembro</option>
  <option value="11">Dezembro</option>
</select>

 
  {analiseMes && (
  <Card className="mt-20">
    <CardContent className="p-4">
      <h2 className="font-semibold text-lg">Resumo do mês</h2>

      <p>Total treinos: {analiseMes.totalTreinos}</p>
      <p>Total calorias: {analiseMes.totalCalorias} kcal</p>
      <p>Melhor dia: {analiseMes.melhorDia}</p>
      <p>Maior queima: {analiseMes.maior} kcal</p>
      <ul className="space-y-2 mt-20">
  {treinosMes.map((t) => (
    <li key={t.id} className="border p-2 rounded bg-white">
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
    className="bg-black text-white px-4 rounded w-40 h-10 ml-40 mt-10"
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