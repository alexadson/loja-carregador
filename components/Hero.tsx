import { ShieldCheck, Truck, BadgePercent, Star } from "lucide-react";
import { product } from "@/lib/product";
import { formatBRL } from "@/lib/currency";

const STREAMABLE_VIDEO_ID = "3gch73";

export default function Hero() {
  return (
    <section id="top" className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            Compatível com MagSafe
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
            Carregue seu iPhone, Apple Watch e AirPods{" "}
            <span className="text-brand">ao mesmo tempo</span>
          </h1>

          <p className="mt-5 text-lg text-neutral-600 max-w-md">
            Uma única estação, três dispositivos carregando sem cabo bagunçado na
            sua mesa. Design compacto, entrada USB-C e indicador de LED.
          </p>

          <div className="mt-7 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-900">
              {formatBRL(product.price)}
            </span>
            <span className="text-base text-neutral-400 line-through">
              {formatBRL(product.compareAtPrice)}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            ou 3x de {formatBRL(product.installments.value)} sem juros
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href="#comprar"
              className="inline-flex justify-center items-center rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
            >
              Quero o meu agora
            </a>
            <a
              href="#beneficios"
              className="inline-flex justify-center items-center rounded-full border border-neutral-300 px-8 py-3.5 text-base font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Ver benefícios
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand" />
              Frete calculado no checkout
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Compra 100% segura
            </div>
            <div className="flex items-center gap-1.5">
              <BadgePercent className="h-4 w-4 text-brand" />
              Garantia de 30 dias
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-green-100 via-white to-white rounded-[2.5rem]" />
          <div className="relative w-full overflow-hidden rounded-3xl shadow-xl aspect-[4/5] bg-black">
            <iframe
              src={`https://streamable.com/e/${STREAMABLE_VIDEO_ID}?autoplay=1&muted=1&loop=1`}
              title="TrioCharge — carregador wireless 3 em 1 em ação"
              className="absolute inset-0 h-full w-full"
              allow="fullscreen; autoplay"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
