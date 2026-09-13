"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { trackPurchase } from "@/lib/analytics";

export default function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const value = Number(searchParams.get("value"));
    const quantity = Number(searchParams.get("quantity"));
    // Mercado Pago adiciona payment_id na volta — usamos como chave para
    // não disparar o evento de compra de novo se o cliente atualizar a página.
    const paymentId = searchParams.get("payment_id");
    const dedupeKey = paymentId ? `purchase_tracked_${paymentId}` : null;

    if (!value || !quantity) return;
    if (dedupeKey && sessionStorage.getItem(dedupeKey)) return;

    trackPurchase({ value, quantity });
    if (dedupeKey) sessionStorage.setItem(dedupeKey, "1");
  }, [searchParams]);

  return (
    <div className="max-w-md text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
      <h1 className="mt-6 text-2xl font-extrabold text-neutral-900">Pedido confirmado!</h1>
      <p className="mt-3 text-neutral-600">
        Recebemos seu pagamento. Em breve você receberá um e-mail com os
        detalhes do pedido e o código de rastreio.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex justify-center items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}
