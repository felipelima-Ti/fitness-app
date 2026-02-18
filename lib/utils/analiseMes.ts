import type { Treino } from "@/lib/services/treino";

export function analisarMes(treinos: Treino[]) {
  const totalTreinos = treinos.length;
  const totalCalorias = treinos.reduce((acc, t) => acc + t.calorias, 0);

  const porDia: Record<string, number> = {};

  treinos.forEach((t) => {
    const dia = t.createdAt.toDate().toLocaleDateString();
    porDia[dia] = (porDia[dia] || 0) + t.calorias;
  });

  let melhorDia = "";
  let maior = 0;

  Object.entries(porDia).forEach(([dia, valor]) => {
    if (valor > maior) {
      maior = valor;
      melhorDia = dia;
    }
  });

  return { totalTreinos, totalCalorias, melhorDia, maior };
}