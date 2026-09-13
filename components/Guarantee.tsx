import { ShieldCheck, MessageCircle, PackageCheck } from "lucide-react";

const points = [
  {
    icon: PackageCheck,
    title: "30 dias de garantia",
    text: "Se o produto vier com defeito de fabricação, trocamos sem custo dentro de 30 dias.",
  },
  {
    icon: ShieldCheck,
    title: "7 dias de arrependimento",
    text: "Direito garantido por lei: não gostou, devolve e recebe o valor de volta.",
  },
  {
    icon: MessageCircle,
    title: "Suporte direto com a gente",
    text: "Dúvidas antes ou depois da compra? Fale com nosso atendimento pelo chat do site ou WhatsApp.",
  },
];

export default function Guarantee() {
  return (
    <section id="garantia" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Compra sem risco
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Queremos que você compre com total confiança.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {points.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-neutral-200 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <h3 className="mt-4 font-bold text-lg text-neutral-900">{title}</h3>
            <p className="mt-2 text-neutral-600 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
