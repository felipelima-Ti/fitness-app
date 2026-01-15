import { Treino } from "@/lib/services/treino";

export function filtrarTreinos(
  treinos: Treino[],
  nome: string,
  data?: string
) {
  return treinos.filter((treino) => {
    const nomeMatch = treino.exercicio
      .toLowerCase()
      .includes(nome.toLowerCase());

    let dataMatch = true;

    if (data) {
      const dataTreino = treino.createdAt.toDate();
      const dataFiltro = new Date(data);

      dataMatch =
        dataTreino.getFullYear() === dataFiltro.getFullYear() &&
        dataTreino.getMonth() === dataFiltro.getMonth() &&
        dataTreino.getDate() === dataFiltro.getDate();
    }

    return nomeMatch && dataMatch;
  });
}