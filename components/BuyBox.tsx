"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Loader2, Truck, CheckCircle2, Mail } from "lucide-react";
import { product } from "@/lib/product";
import { formatBRL, sumBRL } from "@/lib/currency";
import { trackInitiateCheckout } from "@/lib/analytics";
import { isValidEmail } from "@/lib/order";
import PixPayment from "@/components/PixPayment";

type FreteOption = { name: string; price: number; days: number };

export default function BuyBox() {
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [email, setEmail] = useState("");
  const [frete, setFrete] = useState<FreteOption[] | null>(null);
  const [selectedFrete, setSelectedFrete] = useState<FreteOption | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteError, setFreteError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showPix, setShowPix] = useState(false);

  const subtotal = sumBRL(product.price * quantity);
  const total = selectedFrete ? sumBRL(subtotal, selectedFrete.price) : null;

  // Sempre que a quantidade ou o CEP mudam depois de um frete já calculado,
  // o valor anterior fica desatualizado (o peso total muda com a
  // quantidade). Zera a seleção para forçar um novo cálculo antes de
  // liberar a compra novamente.
  function invalidateFrete() {
    setFrete(null);
    setSelectedFrete(null);
    setFreteError(null);
    setCheckoutError(null);
    setShowPix(false);
  }

  function handleQuantityChange(next: number) {
    setQuantity(next);
    invalidateFrete();
  }

  function handleCepChange(value: string) {
    setCep(value);
    invalidateFrete();
  }

  async function calcularFrete() {
    setFreteError(null);
    setCheckoutError(null);
    setFrete(null);
    setSelectedFrete(null);
    setShowPix(false);
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
      setSelectedFrete(data.options[0] ?? null);
    } catch (e) {
      setFreteError(e instanceof Error ? e.message : "Erro ao calcular o frete.");
    } finally {
      setFreteLoading(false);
    }
  }

  function handlePagarComPix() {
    setCheckoutError(null);

    if (!selectedFrete) {
      setCheckoutError(
        "Calcule o frete e escolha uma opção de entrega antes de finalizar a compra."
      );
      return;
    }
    if (!isValidEmail(email)) {
      setCheckoutError("Informe um e-mail válido para gerar o Pix.");
      return;
    }
    setShowPix(true);
  }

  async function finalizarCompraCartao() {
    setCheckoutError(null);

    if (!selectedFrete) {
      setCheckoutError(
        "Calcule o frete e escolha uma opção de entrega antes de finalizar a compra."
      );
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          cep,
          freightName: selectedFrete.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error?.message || data.error || "Não foi possível iniciar o pagamento."
        );
      }
      trackInitiateCheckout({ value: data.total, quantity: data.quantity });
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
              {formatBRL(product.price)}
            </span>
            <span className="text-base text-neutral-400 line-through">
              {formatBRL(product.compareAtPrice)}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            ou 3x de {formatBRL(product.installments.value)} sem juros
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Quantidade</span>
            <div className="flex items-center rounded-full border border-neutral-300">
              <button
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                className="p-2.5 text-neutral-600 hover:text-neutral-900"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(Math.min(10, quantity + 1))}
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
                onChange={(e) => handleCepChange(e.target.value)}
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
              <div className="mt-3 space-y-2">
                {frete.map((opt) => {
                  const isSelected = selectedFrete?.name === opt.name;
                  return (
                    <button
                      key={opt.name}
                      onClick={() => setSelectedFrete(opt)}
                      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                        isSelected
                          ? "border-brand bg-green-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-neutral-300 shrink-0" />
                        )}
                        {opt.name} · até {opt.days} dias úteis
                      </span>
                      <span className="font-semibold">{formatBRL(opt.price)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {!frete && !freteError && (
              <p className="mt-2 text-xs text-neutral-400">
                Informe o CEP e calcule o frete para ver o valor total do pedido.
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> Seu e-mail
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="voce@email.com"
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Usado para confirmar seu pedido e gerar o Pix.
            </p>
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6 space-y-1.5">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Subtotal ({quantity}x)</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Frete</span>
              <span>{selectedFrete ? formatBRL(selectedFrete.price) : "a calcular"}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-neutral-600 font-medium">Total</span>
              <span className="text-2xl font-extrabold text-neutral-900">
                {total ? formatBRL(total) : "—"}
              </span>
            </div>
          </div>

          {showPix && selectedFrete ? (
            <PixPayment
              email={email}
              quantity={quantity}
              cep={cep}
              freightName={selectedFrete.name}
              onBack={() => setShowPix(false)}
            />
          ) : (
            <>
              <button
                onClick={handlePagarComPix}
                className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
              >
                Pagar com Pix
              </button>
              <button
                onClick={finalizarCompraCartao}
                disabled={checkoutLoading}
                className="mt-3 w-full inline-flex justify-center items-center gap-2 rounded-full border border-neutral-300 px-8 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60"
              >
                {checkoutLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Pagar com cartão ou boleto
              </button>
              {checkoutError && <p className="mt-3 text-sm text-red-600">{checkoutError}</p>}
            </>
          )}

          <p className="mt-3 text-center text-xs text-neutral-400">
            Pagamento processado com segurança pelo Mercado Pago
          </p>
        </div>
      </div>
    </section>
  );
}
