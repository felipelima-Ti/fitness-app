import type { Treino } from "@/lib/services/treino";

export function filtrarTreinos(
  treinos: Treino[],
  nome: string,
  data: string
) {
  return treinos.filter((treino) => {
    const matchNome = treino.exercicio
      .toLowerCase()
      .includes(nome.toLowerCase());

    let matchData = true;

    if (data) {
      const dataTreino = treino.createdAt.toDate();

      const dataFormatadaTreino = dataTreino
        .toISOString()
        .split("T")[0]; // yyyy-mm-dd

      matchData = dataFormatadaTreino === data;
    }

    return matchNome && matchData;
  });
}