import { NextRequest, NextResponse } from "next/server";

// TODO: substituir por uma chamada real à API do Melhor Envio (ou Correios)
// usando MELHOR_ENVIO_TOKEN. Por enquanto retorna um valor fixo de exemplo
// para a interface funcionar antes da conta estar configurada.
export async function POST(req: NextRequest) {
  const { cep } = await req.json();

  const digits = String(cep || "").replace(/\D/g, "");
  if (digits.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  return NextResponse.json({
    mock: true,
    options: [
      { name: "PAC", price: 19.9, days: 7 },
      { name: "SEDEX", price: 32.9, days: 3 },
    ],
  });
}
