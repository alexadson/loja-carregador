"use client";

import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#garantia", label: "Garantia" },
  { href: "#faq", label: "Dúvidas" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          TrioCharge
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-neutral-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#comprar"
          className="hidden md:inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors"
        >
          Comprar agora
        </a>

        <button
          className="md:hidden p-2 text-neutral-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-neutral-700">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#comprar"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            Comprar agora
          </a>
        </div>
      )}
    </header>
  );
}
