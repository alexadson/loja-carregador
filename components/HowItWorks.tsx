import { MousePointerClick, Package, Home } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "1. Faça seu pedido",
    text: "Escolha a quantidade, informe seu CEP para calcular o frete e finalize o pagamento com Pix, cartão ou boleto.",
  },
  {
    icon: Package,
    title: "2. Nós preparamos o envio",
    text: "Seu TrioCharge sai do nosso estoque já embalado e você recebe o código de rastreio por e-mail.",
  },
  {
    icon: Home,
    title: "3. Chega na sua casa",
    text: "Acompanhe a entrega em tempo real até o produto chegar na sua porta.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Como funciona a compra
          </h2>
          <p className="mt-4 text-lg text-neutral-300">
            Simples, rápido e seguro — do clique até a porta da sua casa.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white/5 p-6 border border-white/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/20">
                <Icon className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="mt-4 font-bold text-lg">{title}</h3>
              <p className="mt-2 text-neutral-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
