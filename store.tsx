import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  seedProducts,
  seedCollections,
  seedCategories,
  seedSettings,
  seedDeliveryRegions,
} from "../data/seed";
import type {
  Product,
  Collection,
  Category,
  SpecialOrder,
  ContactMessage,
  DeliveryRegion,
  Settings,
} from "../data/seed";
import {
  supabase,
  isSupabaseConfigured,
  rowToProduct,
  productToRow,
  rowToCollection,
  collectionToRow,
  rowToCategory,
  categoryToRow,
  rowToSettings,
  settingsToRow,
  rowToRegion,
  regionToRow,
  rowToOrder,
  rowToMessage,
} from "../lib/supabase";

const DB_KEY = "alkaia_db_v1";
const LOCAL_SESSION_KEY = "alkaia_session_v1";

export interface AnalyticsState {
  events: Record<string, number>;
  productViews: Record<string, number>;
  productClicks: Record<string, number>;
  channels: Record<string, number>;
  sources: Record<string, number>;
  sessions: number;
}

interface DB {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  settings: Settings;
  deliveryRegions: DeliveryRegion[];
  orders: SpecialOrder[];
  messages: ContactMessage[];
  analytics: AnalyticsState;
}

function emptyAnalytics(): AnalyticsState {
  return { events: {}, productViews: {}, productClicks: {}, channels: {}, sources: {}, sessions: 0 };
}

function seedDB(): DB {
  return {
    products: seedProducts,
    collections: seedCollections,
    categories: seedCategories,
    settings: seedSettings,
    deliveryRegions: seedDeliveryRegions,
    orders: [],
    messages: [],
    analytics: emptyAnalytics(),
  };
}

function loadLocalDB(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return seedDB();
    const parsed = JSON.parse(raw);
    return {
      ...seedDB(),
      ...parsed,
      analytics: { ...emptyAnalytics(), ...(parsed.analytics || {}) },
      settings: { ...seedSettings, ...(parsed.settings || {}) },
    };
  } catch {
    return seedDB();
  }
}

function saveLocalDB(db: DB) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Não foi possível persistir localmente:", e);
  }
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export interface StoreValue {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  settings: Settings;
  deliveryRegions: DeliveryRegion[];
  orders: SpecialOrder[];
  messages: ContactMessage[];
  analytics: AnalyticsState;

  loading: boolean;
  online: boolean; // true = conectado ao Supabase
  error: string | null;

  saveProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCollection: (c: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  saveCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (s: Partial<Settings>) => Promise<void>;
  saveDeliveryRegion: (r: DeliveryRegion) => Promise<void>;
  deleteDeliveryRegion: (id: string) => Promise<void>;

  addOrder: (o: Omit<SpecialOrder, "id" | "status" | "createdAt">) => Promise<void>;
  setOrderStatus: (id: string, status: SpecialOrder["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addMessage: (m: Omit<ContactMessage, "id" | "createdAt">) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  track: (event: string, meta?: { slug?: string; channel?: string; source?: string }) => void;
  refreshAdminData: () => Promise<void>;

  isAuthed: boolean;
  authEmail: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;

  collectionBySlug: (slug: string) => Collection | undefined;
  collectionById: (id: string) => Collection | undefined;
  categoryById: (id: string) => Category | undefined;
  productBySlug: (slug: string) => Product | undefined;
  productsOfCollection: (collectionId: string) => Product[];
  formatPrice: (v: number) => string;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const online = isSupabaseConfigured && !!supabase;

  const [db, setDb] = useState<DB>(() => (online ? seedDB() : loadLocalDB()));
  const [loading, setLoading] = useState(online);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const trackedSession = useRef(false);

  /* ---------- Persistência local (modo offline) ---------- */
  useEffect(() => {
    if (!online) saveLocalDB(db);
  }, [db, online]);

  /* ---------- Carregar catálogo público do Supabase ---------- */
  const loadPublicData = useCallback(async () => {
    if (!supabase) return;
    try {
      const [cols, cats, prods, regions, sets] = await Promise.all([
        supabase.from("collections").select("*").order("sort_order", { ascending: true }),
        supabase.from("categories").select("*"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("delivery_regions").select("*"),
        supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
      ]);

      const firstError = cols.error || cats.error || prods.error || regions.error;
      if (firstError) throw firstError;

      setDb((prev) => ({
        ...prev,
        collections: (cols.data || []).map(rowToCollection),
        categories: (cats.data || []).map(rowToCategory),
        products: (prods.data || []).map(rowToProduct),
        deliveryRegions: (regions.data || []).map(rowToRegion),
        settings: sets.data ? rowToSettings(sets.data, seedSettings) : prev.settings,
      }));
      setError(null);
    } catch (e: any) {
      console.error("Erro ao carregar dados do Supabase:", e);
      setError(e?.message || "Não foi possível carregar os dados.");
      setDb(loadLocalDB()); // fallback para o conteúdo local
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (online) loadPublicData();
  }, [online, loadPublicData]);

  /* ---------- Sessão de autenticação ---------- */
  useEffect(() => {
    if (!supabase) {
      try {
        setIsAuthed(localStorage.getItem(LOCAL_SESSION_KEY) === "1");
      } catch {}
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
      setAuthEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session);
      setAuthEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* ---------- Dados restritos (admin) ---------- */
  const refreshAdminData = useCallback(async () => {
    if (!supabase || !isAuthed) return;
    try {
      const [orders, messages, events] = await Promise.all([
        supabase.from("special_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(5000),
      ]);

      const a = emptyAnalytics();
      for (const ev of events.data || []) {
        a.events[ev.event] = (a.events[ev.event] || 0) + 1;
        if (ev.event === "session_start") a.sessions += 1;
        if (ev.slug) {
          if (String(ev.event).startsWith("click")) a.productClicks[ev.slug] = (a.productClicks[ev.slug] || 0) + 1;
          else if (ev.event === "view_product") a.productViews[ev.slug] = (a.productViews[ev.slug] || 0) + 1;
        }
        if (ev.channel) a.channels[ev.channel] = (a.channels[ev.channel] || 0) + 1;
        if (ev.source) a.sources[ev.source] = (a.sources[ev.source] || 0) + 1;
      }

      setDb((prev) => ({
        ...prev,
        orders: (orders.data || []).map(rowToOrder),
        messages: (messages.data || []).map(rowToMessage),
        analytics: a,
      }));
    } catch (e) {
      console.error("Erro ao carregar dados administrativos:", e);
    }
  }, [isAuthed]);

  useEffect(() => {
    if (isAuthed && online) refreshAdminData();
  }, [isAuthed, online, refreshAdminData]);

  /* ---------- Analytics ---------- */
  const track = useCallback(
    (event: string, meta?: { slug?: string; channel?: string; source?: string }) => {
      if (supabase) {
        supabase
          .from("analytics_events")
          .insert({
            event,
            slug: meta?.slug ?? null,
            channel: meta?.channel ?? null,
            source: meta?.source ?? null,
          })
          .then(({ error }) => {
            if (error) console.debug("analytics:", error.message);
          });
        return;
      }
      // modo local
      setDb((prev) => {
        const a = { ...prev.analytics };
        a.events = { ...a.events, [event]: (a.events[event] || 0) + 1 };
        if (meta?.slug) {
          if (event.startsWith("click")) a.productClicks = { ...a.productClicks, [meta.slug]: (a.productClicks[meta.slug] || 0) + 1 };
          else a.productViews = { ...a.productViews, [meta.slug]: (a.productViews[meta.slug] || 0) + 1 };
        }
        if (meta?.channel) a.channels = { ...a.channels, [meta.channel]: (a.channels[meta.channel] || 0) + 1 };
        if (meta?.source) a.sources = { ...a.sources, [meta.source]: (a.sources[meta.source] || 0) + 1 };
        return { ...prev, analytics: a };
      });
    },
    []
  );

  /* ---------- Registrar início de sessão (uma vez) ---------- */
  useEffect(() => {
    if (trackedSession.current) return;
    try {
      if (sessionStorage.getItem("alkaia_session_tracked")) return;
      sessionStorage.setItem("alkaia_session_tracked", "1");
    } catch {}
    trackedSession.current = true;

    const params = new URLSearchParams(window.location.search);
    const ref = document.referrer;
    let source = params.get("utm_source") || "";
    if (!source && ref) {
      if (/instagram/i.test(ref)) source = "instagram";
      else if (/tiktok/i.test(ref)) source = "tiktok";
      else if (/whatsapp|wa\.me/i.test(ref)) source = "whatsapp";
      else if (/shopee/i.test(ref)) source = "shopee";
      else if (/mercadoliv/i.test(ref)) source = "mercadolivre";
      else if (/google|bing/i.test(ref)) source = "busca";
      else source = "outros";
    }
    if (!source) source = "direto";

    if (supabase) {
      supabase.from("analytics_events").insert({ event: "session_start", source }).then(() => {});
    } else {
      setDb((prev) => {
        const a = { ...prev.analytics };
        if (a.sessions > 0) return prev;
        a.sessions = 1;
        a.sources = { ...a.sources, [source]: (a.sources[source] || 0) + 1 };
        return { ...prev, analytics: a };
      });
    }
  }, []);

  /* ---------- CRUD ---------- */
  const value = useMemo<StoreValue>(() => {
    /* ---- Produtos ---- */
    const saveProduct = async (p: Product) => {
      if (supabase) {
        const row = productToRow(p);
        const { data, error } = p.id
          ? await supabase.from("products").upsert(row).select().single()
          : await supabase.from("products").insert(row).select().single();
        if (error) throw new Error(error.message);
        const saved = rowToProduct(data);
        setDb((prev) => ({
          ...prev,
          products: prev.products.some((x) => x.id === saved.id)
            ? prev.products.map((x) => (x.id === saved.id ? saved : x))
            : [saved, ...prev.products],
        }));
        return;
      }
      const withId = p.id ? p : { ...p, id: uid() };
      setDb((prev) => ({
        ...prev,
        products: prev.products.some((x) => x.id === withId.id)
          ? prev.products.map((x) => (x.id === withId.id ? withId : x))
          : [withId, ...prev.products],
      }));
    };

    const deleteProduct = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
    };

    /* ---- Coleções ---- */
    const saveCollection = async (c: Collection) => {
      if (supabase) {
        const row = collectionToRow(c);
        const { data, error } = c.id
          ? await supabase.from("collections").upsert(row).select().single()
          : await supabase.from("collections").insert(row).select().single();
        if (error) throw new Error(error.message);
        const saved = rowToCollection(data);
        setDb((prev) => ({
          ...prev,
          collections: prev.collections.some((x) => x.id === saved.id)
            ? prev.collections.map((x) => (x.id === saved.id ? saved : x))
            : [...prev.collections, saved],
        }));
        return;
      }
      const withId = c.id ? c : { ...c, id: uid() };
      setDb((prev) => ({
        ...prev,
        collections: prev.collections.some((x) => x.id === withId.id)
          ? prev.collections.map((x) => (x.id === withId.id ? withId : x))
          : [...prev.collections, withId],
      }));
    };

    const deleteCollection = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("collections").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, collections: prev.collections.filter((c) => c.id !== id) }));
    };

    /* ---- Categorias ---- */
    const saveCategory = async (c: Category) => {
      if (supabase) {
        const row = categoryToRow(c);
        const { data, error } = c.id
          ? await supabase.from("categories").upsert(row).select().single()
          : await supabase.from("categories").insert(row).select().single();
        if (error) throw new Error(error.message);
        const saved = rowToCategory(data);
        setDb((prev) => ({
          ...prev,
          categories: prev.categories.some((x) => x.id === saved.id)
            ? prev.categories.map((x) => (x.id === saved.id ? saved : x))
            : [...prev.categories, saved],
        }));
        return;
      }
      const withId = c.id ? c : { ...c, id: uid() };
      setDb((prev) => ({
        ...prev,
        categories: prev.categories.some((x) => x.id === withId.id)
          ? prev.categories.map((x) => (x.id === withId.id ? withId : x))
          : [...prev.categories, withId],
      }));
    };

    const deleteCategory = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }));
    };

    /* ---- Configurações ---- */
    const updateSettings = async (patch: Partial<Settings>) => {
      const next = { ...db.settings, ...patch };
      if (supabase) {
        const { error } = await supabase.from("settings").upsert(settingsToRow(next));
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, settings: next }));
    };

    /* ---- Regiões ---- */
    const saveDeliveryRegion = async (r: DeliveryRegion) => {
      if (supabase) {
        const row = regionToRow(r);
        const { data, error } = r.id
          ? await supabase.from("delivery_regions").upsert(row).select().single()
          : await supabase.from("delivery_regions").insert(row).select().single();
        if (error) throw new Error(error.message);
        const saved = rowToRegion(data);
        setDb((prev) => ({
          ...prev,
          deliveryRegions: prev.deliveryRegions.some((x) => x.id === saved.id)
            ? prev.deliveryRegions.map((x) => (x.id === saved.id ? saved : x))
            : [...prev.deliveryRegions, saved],
        }));
        return;
      }
      const withId = r.id ? r : { ...r, id: uid() };
      setDb((prev) => ({ ...prev, deliveryRegions: [...prev.deliveryRegions, withId] }));
    };

    const deleteDeliveryRegion = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("delivery_regions").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, deliveryRegions: prev.deliveryRegions.filter((r) => r.id !== id) }));
    };

    /* ---- Encomendas ---- */
    const addOrder = async (o: Omit<SpecialOrder, "id" | "status" | "createdAt">) => {
      if (supabase) {
        const { error } = await supabase.from("special_orders").insert({ ...o, status: "nova" });
        if (error) throw new Error(error.message);
        return;
      }
      setDb((prev) => ({
        ...prev,
        orders: [{ ...o, id: uid(), status: "nova", createdAt: Date.now() }, ...prev.orders],
      }));
    };

    const setOrderStatus = async (id: string, status: SpecialOrder["status"]) => {
      if (supabase) {
        const { error } = await supabase.from("special_orders").update({ status }).eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
    };

    const deleteOrder = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("special_orders").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, orders: prev.orders.filter((o) => o.id !== id) }));
    };

    /* ---- Mensagens ---- */
    const addMessage = async (m: Omit<ContactMessage, "id" | "createdAt">) => {
      if (supabase) {
        const { error } = await supabase.from("contact_messages").insert(m);
        if (error) throw new Error(error.message);
        return;
      }
      setDb((prev) => ({
        ...prev,
        messages: [{ ...m, id: uid(), createdAt: Date.now() }, ...prev.messages],
      }));
    };

    const deleteMessage = async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from("contact_messages").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
      setDb((prev) => ({ ...prev, messages: prev.messages.filter((m) => m.id !== id) }));
    };

    /* ---- Autenticação ---- */
    const login = async (email: string, password: string) => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          const msg = /invalid login/i.test(error.message)
            ? "E-mail ou senha incorretos."
            : error.message;
          return { ok: false, message: msg };
        }
        return { ok: true };
      }
      // modo local (demonstração)
      const ok =
        email.trim().toLowerCase() === db.settings.adminEmail.toLowerCase() &&
        password === db.settings.adminPassword;
      if (ok) {
        setIsAuthed(true);
        try {
          localStorage.setItem(LOCAL_SESSION_KEY, "1");
        } catch {}
        return { ok: true };
      }
      return { ok: false, message: "E-mail ou senha incorretos." };
    };

    const logout = async () => {
      if (supabase) {
        await supabase.auth.signOut();
        return;
      }
      setIsAuthed(false);
      try {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      } catch {}
    };

    return {
      products: db.products,
      collections: db.collections,
      categories: db.categories,
      settings: db.settings,
      deliveryRegions: db.deliveryRegions,
      orders: db.orders,
      messages: db.messages,
      analytics: db.analytics,
      loading,
      online,
      error,
      saveProduct,
      deleteProduct,
      saveCollection,
      deleteCollection,
      saveCategory,
      deleteCategory,
      updateSettings,
      saveDeliveryRegion,
      deleteDeliveryRegion,
      addOrder,
      setOrderStatus,
      deleteOrder,
      addMessage,
      deleteMessage,
      track,
      refreshAdminData,
      isAuthed,
      authEmail,
      login,
      logout,
      collectionBySlug: (slug) => db.collections.find((c) => c.slug === slug),
      collectionById: (id) => db.collections.find((c) => c.id === id),
      categoryById: (id) => db.categories.find((c) => c.id === id),
      productBySlug: (slug) => db.products.find((p) => p.slug === slug),
      productsOfCollection: (collectionId) => db.products.filter((p) => p.collectionId === collectionId),
      formatPrice: (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    };
  }, [db, loading, online, error, isAuthed, authEmail, track, refreshAdminData]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}
