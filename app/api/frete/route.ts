import { NextRequest, NextResponse } from "next/server";
import { calculateFreight, isValidCep, FreightError } from "@/lib/melhorEnvio";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const cep = String(body?.cep || "").replace(/\D/g, "");
  const quantity = Number(body?.quantity);

  if (!isValidCep(cep)) {
    return NextResponse.json({ error: "CEP inválido." }, { status: 400 });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
  }

  try {
    const options = await calculateFreight(cep, quantity);
    return NextResponse.json({ options });
  } catch (err) {
    const message =
      err instanceof FreightError ? err.message : "Não foi possível calcular o frete.";
    const status = err instanceof FreightError ? err.status : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
