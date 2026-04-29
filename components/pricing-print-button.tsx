"use client";

import { Printer } from "lucide-react";

export function PricingPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
    >
      <Printer className="h-4 w-4" />
      Print or save as PDF
    </button>
  );
}
