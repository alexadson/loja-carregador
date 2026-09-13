import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SucessoPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-6 text-2xl font-extrabold text-neutral-900">
          Pedido confirmado!
        </h1>
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
    </main>
  );
}
