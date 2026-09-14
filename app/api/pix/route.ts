import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { product } from "@/lib/product";
import { parseOrderInput, resolveOrder, isValidEmail, OrderError } from "@/lib/order";

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
  const email = String((body as Record<string, unknown> | null)?.email || "").trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  let order;
  try {
    const input = parseOrderInput(body);
    order = await resolveOrder(input);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Não foi possível processar o pedido.";
    const status = err instanceof OrderError ? err.status : 502;
    return NextResponse.json({ error: message }, { status });
  }

  const { quantity, freight, total } = order;

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify({
      transaction_amount: total,
      description: `${product.fullName} (${quantity}x) + frete ${freight.name}`,
      payment_method_id: "pix",
      payer: { email },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status });
  }

  const transactionData = data.point_of_interaction?.transaction_data;

  if (!transactionData?.qr_code) {
    return NextResponse.json(
      { error: "O Mercado Pago não retornou o QR Code do Pix." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    paymentId: data.id,
    status: data.status,
    qrCode: transactionData.qr_code,
    qrCodeBase64: transactionData.qr_code_base64,
    expiresAt: data.date_of_expiration,
    total,
    quantity,
  });
}
