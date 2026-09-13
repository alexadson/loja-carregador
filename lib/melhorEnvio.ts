import { ORIGIN_CEP, PACKAGE } from "@/lib/shipping";
import { product } from "@/lib/product";

export type FreightOption = { name: string; price: number; days: number };

type MelhorEnvioOption = {
  name: string;
  price: string;
  delivery_time: number;
  company: { name: string };
  error?: string;
};

const MOCK_OPTIONS: FreightOption[] = [
  { name: "PAC (exemplo)", price: 19.9, days: 7 },
  { name: "SEDEX (exemplo)", price: 32.9, days: 3 },
];

export class FreightError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function calculateFreight(
  destinationCep: string,
  quantity: number
): Promise<FreightOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    return MOCK_OPTIONS;
  }

  const response = await fetch(
    "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "TrioCharge (contato@triocharge.com.br)",
      },
      body: JSON.stringify({
        from: { postal_code: ORIGIN_CEP },
        to: { postal_code: destinationCep },
        products: [
          {
            id: "1",
            width: PACKAGE.width,
            height: PACKAGE.height,
            length: PACKAGE.length,
            weight: PACKAGE.weight,
            insurance_value: product.price,
            quantity,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new FreightError(
      "Não foi possível calcular o frete no momento.",
      response.status >= 500 ? 502 : 400
    );
  }

  const data: MelhorEnvioOption[] = await response.json();

  const options = data
    .filter((opt) => !opt.error && Number(opt.price) > 0)
    .map((opt) => ({
      name: `${opt.company.name} · ${opt.name}`,
      price: Number(opt.price),
      days: opt.delivery_time,
    }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  if (options.length === 0) {
    throw new FreightError(
      "Nenhuma transportadora disponível para esse CEP.",
      422
    );
  }

  return options;
}

export function isValidCep(cep: string): boolean {
  return /^\d{8}$/.test(cep);
}
