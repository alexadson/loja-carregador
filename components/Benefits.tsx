import Image from "next/image";
import { product } from "@/lib/product";

const features = [
  {
    image: product.images.devices,
    title: "3 dispositivos, 1 estação",
    text: "Carregue seu iPhone, Apple Watch e AirPods simultaneamente. Sua estação de trabalho completa, com tudo ao alcance em um só lugar.",
  },
  {
    image: product.images.magsafe,
    title: "Compatível com MagSafe",
    text: "Encaixe magnético perfeito com iPhones compatíveis com MagSafe. O celular fica preso com segurança enquanto carrega.",
  },
  {
    image: product.images.compact,
    title: "Design compacto e minimalista",
    text: "Acabamento premium que combina com qualquer ambiente — mesa de trabalho, criado-mudo ou escritório.",
  },
  {
    image: product.images.usbc,
    title: "Entrada USB-C",
    text: "Padrão moderno de carregamento, mais rápido e universal. Cabo incluso.",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Feito para simplificar sua rotina
        </h2>
        <p className="mt-4 text-lg text-neutral-600">
          Chega de procurar cabo, disputar tomada ou deixar o carregador do relógio
          jogado na gaveta.
        </p>
      </div>

      <div className="mt-14 space-y-16 sm:space-y-24">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`grid md:grid-cols-2 gap-8 sm:gap-12 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="rounded-3xl bg-neutral-50 overflow-hidden">
              <Image
                src={f.image}
                alt={f.title}
                width={900}
                height={900}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{f.title}</h3>
              <p className="mt-3 text-neutral-600 text-lg">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
