import type { Treino } from "@/lib/services/treino";

export function calcularSemana(treinos: Treino[]) {
  const hoje = new Date();

  const resultado: Record<string, number> = {};

  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(hoje.getDate() - i);

    const chave = data.toLocaleDateString();

    resultado[chave] = 0;
  }

  treinos.forEach((t) => {
    const data = t.createdAt.toDate().toLocaleDateString();

    if (resultado[data] !== undefined) {
      resultado[data] += t.calorias;
    }
  });

  return resultado;
}