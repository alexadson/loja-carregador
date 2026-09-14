"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Copy, Check, ArrowLeft, RefreshCw } from "lucide-react";
import { formatBRL } from "@/lib/currency";
import { trackPurchase } from "@/lib/analytics";

type Props = {
  email: string;
  quantity: number;
  cep: string;
  freightName: string;
  onBack: () => void;
};

type PixData = {
  paymentId: number;
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: string | null;
  total: number;
  quantity: number;
};

function secondsUntil(iso: string | null): number {
  if (!iso) return Infinity;
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000));
}

function formatCountdown(seconds: number): string {
  if (!Number.isFinite(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PixPayment({ email, quantity, cep, freightName, onBack }: Props) {
  const [pix, setPix] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(Infinity);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createPix = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExpired(false);
    setPix(null);
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, quantity, cep, freightName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Não foi possível gerar o Pix.");
      }
      setPix(data);
      setSecondsLeft(secondsUntil(data.expiresAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar o Pix.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createPix();
  }, [createPix]);

  // Contagem regressiva até a expiração do QR Code.
  useEffect(() => {
    if (!pix || expired) return;

    countdownRef.current = setInterval(() => {
      const remaining = secondsUntil(pix.expiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setExpired(true);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [pix, expired]);

  // Verifica periodicamente se o pagamento já foi aprovado.
  useEffect(() => {
    if (!pix || expired) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pix/status?id=${pix.paymentId}`);
        const data = await res.json();
        if (data.status === "approved") {
          if (pollRef.current) clearInterval(pollRef.current);
          trackPurchase({ value: pix.total, quantity: pix.quantity });
          window.location.href = `/sucesso?value=${pix.total.toFixed(2)}&quantity=${pix.quantity}&payment_id=${pix.paymentId}`;
        }
      } catch {
        // Instabilidade de rede pontual: tenta de novo no próximo intervalo.
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pix, expired]);

  async function copyCode() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 p-6 text-center">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {loading && (
        <div className="py-10 flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          Gerando o Pix...
        </div>
      )}

      {error && (
        <div className="py-6">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={createPix}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" /> Tentar de novo
          </button>
        </div>
      )}

      {pix && !error && !expired && (
        <>
          <p className="text-sm text-neutral-600">
            Escaneie o QR Code com o app do seu banco ou copie o código abaixo
          </p>
          <img
            src={`data:image/png;base64,${pix.qrCodeBase64}`}
            alt="QR Code Pix"
            className="mx-auto mt-4 h-56 w-56 rounded-xl border border-neutral-200"
          />
          <p className="mt-4 text-2xl font-extrabold text-neutral-900">
            {formatBRL(pix.total)}
          </p>

          <button
            onClick={copyCode}
            className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
            {copied ? "Código copiado!" : "Copiar código Pix"}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aguardando confirmação do pagamento...
          </p>
          {Number.isFinite(secondsLeft) && (
            <p className="mt-1 text-xs text-neutral-400">
              Expira em {formatCountdown(secondsLeft)}
            </p>
          )}
        </>
      )}

      {expired && (
        <div className="py-6">
          <p className="text-sm text-neutral-600">
            O código Pix expirou. Gere um novo pra continuar.
          </p>
          <button
            onClick={createPix}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" /> Gerar novo código
          </button>
        </div>
      )}
    </div>
  );
}
