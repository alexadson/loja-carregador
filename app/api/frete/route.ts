import { NextRequest, NextResponse } from "next/server";
import { ORIGIN_CEP, PACKAGE } from "@/lib/shipping";
import { product } from "@/lib/product";

type MelhorEnvioOption = {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  company: { name: string };
  error?: string;
};

export async function POST(req: NextRequest) {
  const { cep, quantity = 1 } = await req.json();

  const digits = String(cep || "").replace(/\D/g, "");
  if (digits.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    // Sem token configurado: retorna um valor fixo de exemplo.
    return NextResponse.json({
      mock: true,
      options: [
        { name: "PAC", price: 19.9, days: 7 },
        { name: "SEDEX", price: 32.9, days: 3 },
      ],
    });
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
        to: { postal_code: digits },
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
    const data = await response.json().catch(() => null);
    return NextResponse.json(
      { error: data || "Não foi possível calcular o frete." },
      { status: response.status }
    );
  }

  const data: MelhorEnvioOption[] = await response.json();

  const options = data
    .filter((opt) => !opt.error && opt.price)
    .map((opt) => ({
      name: `${opt.company.name} · ${opt.name}`,
      price: Number(opt.price),
      days: opt.delivery_time,
    }))
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  if (options.length === 0) {
    return NextResponse.json(
      { error: "Nenhuma transportadora disponível para esse CEP." },
      { status: 422 }
    );
  }

  return NextResponse.json({ mock: false, options });
}
