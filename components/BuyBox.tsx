"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Loader2, Truck } from "lucide-react";
import { product } from "@/lib/product";

type FreteOption = { name: string; price: number; days: number };

export default function BuyBox() {
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<FreteOption[] | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteError, setFreteError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const total = product.price * quantity;

  async function calcularFrete() {
    setFreteError(null);
    setFrete(null);
    setFreteLoading(true);
    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível calcular o frete.");
      setFrete(data.options);
    } catch (e) {
      setFreteError(e instanceof Error ? e.message : "Erro ao calcular o frete.");
    } finally {
      setFreteLoading(false);
    }
  }

  async function finalizarCompra() {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.error || "Não foi possível iniciar o pagamento.");
      window.location.href = data.init_point;
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Erro ao iniciar o checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <section id="comprar" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden grid md:grid-cols-2">
        <div className="bg-neutral-50 p-8 sm:p-12 flex items-center justify-center">
          <Image
            src={product.images.hero}
            alt={product.fullName}
            width={700}
            height={700}
            className="w-full max-w-xs h-auto"
          />
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-extrabold text-neutral-900">{product.fullName}</h2>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-900">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-base text-neutral-400 line-through">
              R$ {product.compareAtPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            ou 3x de R$ {product.installments.value.toFixed(2).replace(".", ",")} sem juros
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Quantidade</span>
            <div className="flex items-center rounded-full border border-neutral-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-neutral-600 hover:text-neutral-900"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-2.5 text-neutral-600 hover:text-neutral-900"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
              <Truck className="h-4 w-4" /> Calcular frete
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Seu CEP"
                inputMode="numeric"
                maxLength={9}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                onClick={calcularFrete}
                disabled={freteLoading || cep.replace(/\D/g, "").length !== 8}
                className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                {freteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
              </button>
            </div>
            {freteError && <p className="mt-2 text-sm text-red-600">{freteError}</p>}
            {frete && (
              <ul className="mt-3 space-y-1.5 text-sm">
                {frete.map((opt) => (
                  <li key={opt.name} className="flex justify-between rounded-lg bg-neutral-50 px-3 py-2">
                    <span>
                      {opt.name} · até {opt.days} dias úteis
                    </span>
                    <span className="font-semibold">R$ {opt.price.toFixed(2).replace(".", ",")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Total</span>
            <span className="text-2xl font-extrabold text-neutral-900">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <button
            onClick={finalizarCompra}
            disabled={checkoutLoading}
            className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {checkoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Finalizar compra
          </button>
          {checkoutError && <p className="mt-3 text-sm text-red-600">{checkoutError}</p>}
          <p className="mt-3 text-center text-xs text-neutral-400">
            Pagamento processado com segurança pelo Mercado Pago
          </p>
        </div>
      </div>
    </section>
  );
}
