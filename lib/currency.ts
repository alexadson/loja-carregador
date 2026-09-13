const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(value: number): string {
  return formatter.format(value);
}

// Soma valores em reais evitando erro de ponto flutuante (ex: 0.1 + 0.2),
// somando em centavos (inteiros) e convertendo de volta no final.
export function sumBRL(...values: number[]): number {
  const cents = values.reduce((total, v) => total + Math.round(v * 100), 0);
  return cents / 100;
}
