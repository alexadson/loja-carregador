import { NextRequest, NextResponse } from "next/server";
import { product } from "@/lib/product";
import { parseOrderInput, resolveOrder, OrderError } from "@/lib/order";

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

  let order;
  try {
    const input = parseOrderInput(await req.json().catch(() => null));
    order = await resolveOrder(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não foi possível processar o pedido.";
    const status = err instanceof OrderError ? err.status : 502;
    return NextResponse.json({ error: message }, { status });
  }

  const { quantity, freight, total } = order;
  const origin = req.nextUrl.origin;
  const isPubliclyReachable = origin.startsWith("https://");

  const successUrl = new URL("/sucesso", origin);
  successUrl.searchParams.set("value", total.toFixed(2));
  successUrl.searchParams.set("quantity", String(quantity));

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
      success: successUrl.toString(),
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

  return NextResponse.json({ init_point: data.init_point, total, quantity });
}
