import type { Treino } from "@/lib/services/treino";

export function calcularProgressoMeta(
  treinos: Treino[],
  meta: any
) {
  const inicio = new Date(meta.inicio);
  const termino = new Date(meta.termino);

  // Filtra treinos dentro do período da meta
  const treinosNoPeriodo = treinos.filter((treino) => {
    const dataTreino = treino.createdAt.toDate();
    return dataTreino >= inicio && dataTreino <= termino;
  });

  // Soma calorias queimadas no período
  const caloriasQueimadas = treinosNoPeriodo.reduce(
    (total, treino) => total + treino.calorias,
    0
  );

  const objetivo = Number(meta.calorias);

  const progresso = Math.min(
    (caloriasQueimadas / objetivo) * 100,
    100
  );

  return {
    caloriasQueimadas,
    objetivo,
    progresso,
    treinosNoPeriodo: treinosNoPeriodo.length,
  };
}
