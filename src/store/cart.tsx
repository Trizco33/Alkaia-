import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../data/seed";

/* ============================================================
   ALKAIA — Carrinho de compras
   Persistido em localStorage. Preços são revalidados no servidor
   (edge function create-order) antes do pagamento.
   ============================================================ */

const CART_KEY = "alkaia_cart_v1";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  /** preço unitário vigente no momento (sale ou cheio) — meramente exibicional */
  unitPrice: number;
  qty: number;
  /** peso em gramas (para cálculo de frete) */
  grams: number;
  stock: number;
}

interface CartValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function parseGrams(weight: string): number {
  const m = String(weight || "").replace(",", ".").match(/([\d.]+)\s*(kg|g)?/i);
  if (!m) return 350;
  const n = parseFloat(m[1]);
  if (!isFinite(n) || n <= 0) return 350;
  return /kg/i.test(m[2] || "") ? Math.round(n * 1000) : Math.round(n);
}

export function effectivePrice(p: { price: number; salePrice?: number | null }): number {
  return p.salePrice && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.productId && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* quota cheia — ignora */
    }
  }, [items]);

  const value = useMemo<CartValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      add: (p, qty = 1) =>
        setItems((prev) => {
          const ex = prev.find((i) => i.productId === p.id);
          const max = Math.max(0, p.stock);
          if (ex) {
            return prev.map((i) =>
              i.productId === p.id ? { ...i, qty: Math.min(i.qty + qty, max || i.qty + qty), unitPrice: effectivePrice(p), stock: p.stock } : i
            );
          }
          return [
            ...prev,
            {
              productId: p.id,
              slug: p.slug,
              name: p.name,
              image: p.images[0] || "",
              unitPrice: effectivePrice(p),
              qty: Math.min(qty, max || qty),
              grams: parseGrams(p.weight),
              stock: p.stock,
            },
          ];
        }),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, i.stock > 0 ? i.stock : qty) } : i))
        ),
      remove: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
