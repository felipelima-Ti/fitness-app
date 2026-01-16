"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buscarTodosTreinos } from "@/lib/services/busca";
import type { Treino } from "@/lib/services/treino";
import { gerarGraficoUltimos7Dias } from "@/lib/utils/grafico";
import { getUsuarioAtual } from "@/lib/services/user";

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
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      const dados = await buscarTodosTreinos();
      setTreinos(dados);

      const user = getUsuarioAtual();
      setUsuario(user);
    }

    carregar();
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
    <div className="min-h-screen bg-gray-100 p-6">
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
    </div>
  );
}