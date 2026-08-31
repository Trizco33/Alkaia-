import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Product,
  Collection,
  Category,
  Settings,
  DeliveryRegion,
  SpecialOrder,
  ContactMessage,
} from "../data/seed";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true quando as variáveis de ambiente estão configuradas */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/* ============================================================
   Conversores: banco (snake_case) ↔ aplicação (camelCase)
   ============================================================ */

const asArray = (v: unknown): string[] =>
  Array.isArray(v) ? (v as string[]) : typeof v === "string" && v ? JSON.parse(v) : [];

export function rowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name ?? "",
    slug: r.slug ?? "",
    collectionId: r.collection_id ?? "",
    categoryId: r.category_id ?? "",
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    images: asArray(r.images),
    olfactoryProfile: r.olfactory_profile ?? "",
    aromaticNotes: asArray(r.aromatic_notes),
    weight: r.weight ?? "",
    burnTime: r.burn_time ?? "",
    ingredients: r.ingredients ?? "",
    instructions: r.instructions ?? "",
    care: r.care ?? "",
    price: Number(r.price ?? 0),
    salePrice: r.sale_price != null ? Number(r.sale_price) : null,
    stock: Number(r.stock ?? 0),
    status: (r.status as Product["status"]) ?? "active",
    featured: Boolean(r.featured),
    availableForDelivery: r.available_for_delivery ?? true,
    availableForPickup: r.available_for_pickup ?? true,
    channels: r.channels ?? { site: true, shopee: true, mercadolivre: true, whatsapp: true },
    links: r.links ?? {},
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
    updatedAt: r.updated_at ? Date.parse(r.updated_at) : Date.now(),
  };
}

export function productToRow(p: Product) {
  const row: Record<string, unknown> = {
    name: p.name,
    slug: p.slug,
    collection_id: p.collectionId || null,
    category_id: p.categoryId || null,
    short_description: p.shortDescription,
    description: p.description,
    images: p.images,
    olfactory_profile: p.olfactoryProfile,
    aromatic_notes: p.aromaticNotes,
    weight: p.weight,
    burn_time: p.burnTime ?? "",
    ingredients: p.ingredients,
    instructions: p.instructions,
    care: p.care,
    price: p.price,
    sale_price: p.salePrice ?? null,
    stock: p.stock,
    status: p.status,
    featured: p.featured,
    available_for_delivery: p.availableForDelivery,
    available_for_pickup: p.availableForPickup,
    channels: p.channels,
    links: p.links,
    seo_title: p.seoTitle ?? null,
    seo_description: p.seoDescription ?? null,
    updated_at: new Date().toISOString(),
  };
  if (p.id) row.id = p.id;
  return row;
}

export function rowToCollection(r: any): Collection {
  return {
    id: r.id,
    name: r.name ?? "",
    slug: r.slug ?? "",
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    image: r.image ?? "",
    editorial: r.editorial ?? "",
    ritual: r.ritual ?? undefined,
    subCollection: Array.isArray(r.sub_collection) ? r.sub_collection : [],
  };
}

export function collectionToRow(c: Collection) {
  const row: Record<string, unknown> = {
    name: c.name,
    slug: c.slug,
    tagline: c.tagline,
    description: c.description,
    image: c.image,
    editorial: c.editorial,
    ritual: c.ritual ?? null,
    sub_collection: c.subCollection ?? [],
  };
  if (c.id) row.id = c.id;
  return row;
}

export function rowToCategory(r: any): Category {
  return { id: r.id, name: r.name ?? "", slug: r.slug ?? "", description: r.description ?? "" };
}

export function categoryToRow(c: Category) {
  const row: Record<string, unknown> = { name: c.name, slug: c.slug, description: c.description };
  if (c.id) row.id = c.id;
  return row;
}

export function rowToSettings(r: any, fallback: Settings): Settings {
  return {
    ...fallback,
    brandName: r.brand_name ?? fallback.brandName,
    message: r.message ?? fallback.message,
    subtitle: r.subtitle ?? fallback.subtitle,
    email: r.email ?? fallback.email,
    whatsapp: r.whatsapp ?? fallback.whatsapp,
    whatsappDisplay: r.whatsapp_display ?? fallback.whatsappDisplay,
    instagram: r.instagram ?? fallback.instagram,
    tiktok: r.tiktok ?? fallback.tiktok,
    shopee: r.shopee ?? fallback.shopee,
    mercadolivre: r.mercadolivre ?? fallback.mercadolivre,
    city: r.city ?? fallback.city,
  };
}

export function settingsToRow(s: Settings) {
  return {
    id: 1,
    brand_name: s.brandName,
    message: s.message,
    subtitle: s.subtitle,
    email: s.email,
    whatsapp: s.whatsapp,
    whatsapp_display: s.whatsappDisplay,
    instagram: s.instagram,
    tiktok: s.tiktok,
    shopee: s.shopee,
    mercadolivre: s.mercadolivre,
    city: s.city,
    updated_at: new Date().toISOString(),
  };
}

export function rowToRegion(r: any): DeliveryRegion {
  return { id: r.id, name: r.name ?? "", type: r.type ?? "entrega", note: r.note ?? "" };
}

export function regionToRow(r: DeliveryRegion) {
  const row: Record<string, unknown> = { name: r.name, type: r.type, note: r.note };
  if (r.id) row.id = r.id;
  return row;
}

export function rowToOrder(r: any): SpecialOrder {
  return {
    id: r.id,
    name: r.name ?? "",
    whatsapp: r.whatsapp ?? "",
    email: r.email ?? "",
    type: r.type ?? "",
    quantity: r.quantity ?? "",
    interest: r.interest ?? "",
    date: r.date ?? "",
    message: r.message ?? "",
    status: (r.status as SpecialOrder["status"]) ?? "nova",
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
  };
}

export function rowToMessage(r: any): ContactMessage {
  return {
    id: r.id,
    name: r.name ?? "",
    email: r.email ?? "",
    subject: r.subject ?? "",
    message: r.message ?? "",
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
  };
}
