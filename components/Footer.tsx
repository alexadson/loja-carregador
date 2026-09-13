import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Zap className="h-4 w-4" fill="currentColor" />
            </span>
            TrioCharge
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Estação de carregamento wireless 3 em 1 para iPhone, Apple Watch e AirPods.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Atendimento</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>contato@triocharge.com.br</li>
            <li>Seg. a sex., 9h às 18h</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Políticas</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Trocas e devoluções (7 dias)</li>
            <li>Garantia de 30 dias</li>
            <li>Política de privacidade</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs">
        © {new Date().getFullYear()} TrioCharge. Todos os direitos reservados.
      </div>
    </footer>
  );
}
