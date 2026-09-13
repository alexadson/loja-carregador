"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "O carregador funciona com qualquer celular?",
    a: "O carregamento sem fio do disco principal funciona com qualquer celular compatível com carregamento wireless Qi. O encaixe magnético (como o MagSafe) funciona perfeitamente em iPhones com MagSafe; em outros modelos, ele carrega normalmente por indução, sem o encaixe magnético.",
  },
  {
    q: "Carrega o Apple Watch e os AirPods ao mesmo tempo que o celular?",
    a: "Sim. A estação tem três pontos de carregamento independentes — celular, relógio e fone — e os três podem carregar ao mesmo tempo.",
  },
  {
    q: "O carregador de parede (fonte) está incluso?",
    a: "O produto acompanha o cabo USB-C. Verifique a descrição do produto no checkout para confirmar se a fonte de parede está incluída nesta oferta.",
  },
  {
    q: "Quanto tempo leva para chegar?",
    a: "O prazo é calculado automaticamente no checkout de acordo com o seu CEP, assim que você adiciona o produto ao carrinho.",
  },
  {
    q: "Posso trocar ou devolver se não gostar?",
    a: "Sim. Você tem 7 dias corridos após o recebimento para desistir da compra, conforme o Código de Defesa do Consumidor, além de garantia de 30 dias contra defeitos de fabricação.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 text-center">
          Perguntas frequentes
        </h2>

        <div className="mt-10 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5"
                >
                  <span className="font-semibold text-neutral-900">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1 text-neutral-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
