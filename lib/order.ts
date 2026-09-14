import { product } from "@/lib/product";
import { calculateFreight, isValidCep, FreightError, type FreightOption } from "@/lib/melhorEnvio";
import { sumBRL } from "@/lib/currency";

export { FreightError };

export type OrderInput = {
  quantity: number;
  cep: string;
  freightName: string;
};

export type ResolvedOrder = {
  quantity: number;
  freight: FreightOption;
  total: number;
};

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function parseOrderInput(body: unknown): OrderInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const quantity = Number(b.quantity);
  const cep = String(b.cep || "").replace(/\D/g, "");
  const freightName = String(b.freightName || "");

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    throw new OrderError("Quantidade inválida.");
  }
  if (!isValidCep(cep)) {
    throw new OrderError("Informe um CEP válido para calcular o frete.");
  }

  return { quantity, cep, freightName };
}

// Sempre recalcula o frete aqui no servidor (nunca confia no valor vindo do
// navegador) para evitar que alguém manipule o preço cobrado.
export async function resolveOrder(input: OrderInput): Promise<ResolvedOrder> {
  const options = await calculateFreight(input.cep, input.quantity);
  const freight = options.find((opt) => opt.name === input.freightName);

  if (!freight) {
    throw new OrderError(
      "A opção de frete escolhida expirou. Calcule o frete novamente.",
      409
    );
  }

  const total = sumBRL(product.price * input.quantity, freight.price);

  return { quantity: input.quantity, freight, total };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
