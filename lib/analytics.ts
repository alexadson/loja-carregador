export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type PurchasePayload = {
  value: number;
  quantity: number;
  currency?: string;
};

// Disparado quando o cliente clica em "Finalizar compra" e o pagamento
// é criado com sucesso (antes do redirecionamento para o Mercado Pago).
export function trackInitiateCheckout(payload: PurchasePayload) {
  const { value, quantity, currency = "BRL" } = payload;

  if (typeof window === "undefined") return;

  window.gtag?.("event", "begin_checkout", {
    currency,
    value,
    items: [{ item_name: "TrioCharge", quantity }],
  });

  window.fbq?.("track", "InitiateCheckout", {
    value,
    currency,
    num_items: quantity,
  });
}

// Disparado na página de sucesso, após o cliente voltar do pagamento aprovado.
export function trackPurchase(payload: PurchasePayload) {
  const { value, quantity, currency = "BRL" } = payload;

  if (typeof window === "undefined") return;

  window.gtag?.("event", "purchase", {
    currency,
    value,
    items: [{ item_name: "TrioCharge", quantity }],
  });

  window.fbq?.("track", "Purchase", {
    value,
    currency,
    num_items: quantity,
  });
}
