import { NextRequest, NextResponse } from "next/server";
import { product } from "@/lib/product";

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

  const { quantity = 1 } = await req.json();
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
