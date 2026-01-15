export function calcularCalorias(
  pesoKg: number,
  minutos: number,
  met: number
) {
  const horas = minutos / 60;
  return Math.round(met * pesoKg * horas);
}