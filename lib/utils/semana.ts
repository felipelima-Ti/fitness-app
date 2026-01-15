import { Treino } from "@/lib/services/treino";

export function calcularSemana(treinos: Treino[]) {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const semana: Record<string, number> = {
    Dom: 0,
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sáb: 0,
  };

  treinos.forEach((treino) => {
    const data = treino.createdAt.toDate();
    if (data >= inicioSemana) {
      const dia = dias[data.getDay()];
      semana[dia] += treino.calorias;
    }
  });

  return semana;
}