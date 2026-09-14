import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const paymentId = req.nextUrl.searchParams.get("id");

  if (!accessToken) {
    return NextResponse.json({ error: "MERCADOPAGO_ACCESS_TOKEN não configurado." }, { status: 500 });
  }
  if (!paymentId || !/^\d+$/.test(paymentId)) {
    return NextResponse.json({ error: "ID de pagamento inválido." }, { status: 400 });
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status });
  }

  return NextResponse.json({ status: data.status });
}
