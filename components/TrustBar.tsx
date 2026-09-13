import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const items = [
  { icon: Truck, label: "Envio para todo o Brasil" },
  { icon: CreditCard, label: "Pix, cartão e boleto" },
  { icon: ShieldCheck, label: "Site seguro" },
  { icon: RotateCcw, label: "7 dias para trocar" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 justify-center text-center sm:justify-start sm:text-left">
            <Icon className="h-5 w-5 shrink-0 text-brand" />
            <span className="text-sm font-medium text-neutral-700">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
