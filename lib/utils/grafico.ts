import type { Treino } from "@/lib/services/treino";

export function gerarGraficoUltimos7Dias(treinos: Treino[]) {
  const hoje = new Date();

  const dias = Array.from({ length: 7 }).map((_, i) => {
    const data = new Date();
    data.setDate(hoje.getDate() - (6 - i));
    return data.toLocaleDateString();
  });

  const caloriasPorDia: Record<string, number> = {};

  dias.forEach((d) => (caloriasPorDia[d] = 0));

  treinos.forEach((treino) => {
    const data = treino.createdAt.toDate().toLocaleDateString();

    if (caloriasPorDia[data] !== undefined) {
      caloriasPorDia[data] += treino.calorias;
    }
  });

  return {
    labels: dias,
    valores: dias.map((d) => caloriasPorDia[d]),
  };
}