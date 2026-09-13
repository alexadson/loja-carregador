import { NextRequest, NextResponse } from "next/server";
import { product } from "@/lib/product";
import { calculateFreight, isValidCep, FreightError } from "@/lib/melhorEnvio";

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "MERCADOPAGO_ACCESS_TOKEN não configurado. Veja o README para criar sua conta Mercado Pago e adicionar a chave em .env.local.",
      },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const quantity = Number(body?.quantity);
  const cep = String(body?.cep || "").replace(/\D/g, "");
  const freightName = String(body?.freightName || "");

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
  }
  if (!isValidCep(cep)) {
    return NextResponse.json({ error: "Informe um CEP válido para calcular o frete." }, { status: 400 });
  }

  // O preço do frete é sempre recalculado aqui no servidor (nunca confiamos
  // no valor que vier do navegador) para evitar que alguém manipule o preço
  // cobrado antes de enviar para o Mercado Pago.
  let freight;
  try {
    const options = await calculateFreight(cep, quantity);
    freight = options.find((opt) => opt.name === freightName);
  } catch (err) {
    const message =
      err instanceof FreightError ? err.message : "Não foi possível calcular o frete.";
    const status = err instanceof FreightError ? err.status : 502;
    return NextResponse.json({ error: message }, { status });
  }

  if (!freight) {
    return NextResponse.json(
      { error: "A opção de frete escolhida expirou. Calcule o frete novamente." },
      { status: 409 }
    );
  }

  const origin = req.nextUrl.origin;
  const isPubliclyReachable = origin.startsWith("https://");

  const preference: Record<string, unknown> = {
    items: [
      {
        title: product.fullName,
        quantity,
        unit_price: product.price,
        currency_id: "BRL",
      },
      {
        title: `Frete — ${freight.name}`,
        quantity: 1,
        unit_price: freight.price,
        currency_id: "BRL",
      },
    ],
    back_urls: {
      success: `${origin}/sucesso`,
      failure: `${origin}/#comprar`,
      pending: `${origin}/#comprar`,
    },
  };

  // O Mercado Pago só aceita auto_return com uma URL pública (https).
  // Em desenvolvimento local (http://localhost) isso é omitido.
  if (isPubliclyReachable) {
    preference.auto_return = "approved";
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status });
  }

  return NextResponse.json({ init_point: data.init_point });
}
