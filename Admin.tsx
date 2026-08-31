import { useState } from "react";
import { useStore } from "../../store/store";
import { useSeo } from "../../components/Layout";
import { IconFlame, IconClose, IconPlus, IconCheck } from "../../components/ui";
import type { Product, Collection, DeliveryRegion } from "../../data/seed";

const emptyRegion = (): Omit<DeliveryRegion, "id"> => ({ name: "", type: "entrega", note: "" });

const uid = () => Math.random().toString(36).slice(2, 8);

function fieldCls() {
  return "w-full rounded-[2px] border border-ink/15 bg-ghost px-3 py-2 text-[13px] text-ink outline-none focus:border-terra";
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-ink-soft">{children}</label>;
}

/* ---------------- Login ---------------- */
function Login() {
  const { login, online } = useStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await login(email, pass);
      if (!res.ok) setErr(res.message || "Não foi possível entrar.");
    } catch (e: any) {
      setErr(e?.message || "Erro ao conectar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2px] border border-ink/10 bg-ghost p-8">
        <div className="text-center">
          <IconFlame className="mx-auto h-8 w-8 text-terra" />
          <h1 className="mt-4 font-serif text-2xl tracking-[0.2em] text-ink">ALKAIA</h1>
          <p className="mt-1 text-[12px] text-ink-soft">Painel administrativo</p>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <Label>E-mail</Label>
            <input className={fieldCls()} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@alkaia.com.br" autoComplete="email" />
          </div>
          <div>
            <Label>Senha</Label>
            <input className={fieldCls()} value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          {err && <p className="rounded-[2px] bg-terra/10 px-3 py-2 text-[12px] text-terra-dark">{err}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </button>
          {online ? (
            <p className="text-center text-[11px] text-ink-soft">
              Conectado ao Supabase · use o usuário criado no painel
            </p>
          ) : (
            <p className="text-center text-[11px] text-ink-soft">
              Modo demonstração: admin@alkaia.com.br · alkaia2026
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[2px] border border-ink/10 bg-ghost p-5">
      <p className="text-[11px] uppercase tracking-widest text-ink-soft">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}
function Rank({ title, rows, fmt }: { title: string; rows: [string, number][]; fmt?: (s: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="rounded-[2px] border border-ink/10 bg-ghost p-5">
      <p className="text-[11px] uppercase tracking-widest text-ink-soft">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-[13px] text-ink-soft">Sem dados ainda.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map(([k, v]) => (
            <li key={k}>
              <div className="flex justify-between text-[12px]">
                <span className="truncate text-ink">{fmt ? fmt(k) : k}</span>
                <span className="text-ink-soft">{v}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-linen">
                <div className="h-full rounded-full bg-terra" style={{ width: `${(v / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Dashboard() {
  const { analytics, products, productBySlug, orders } = useStore();
  const totalEvents = Object.values(analytics.events).reduce((a, b) => a + b, 0);
  const views = Object.entries(analytics.productViews).sort((a, b) => b[1] - a[1]).slice(0, 6) as [string, number][];
  const clicks = Object.entries(analytics.productClicks).sort((a, b) => b[1] - a[1]).slice(0, 6) as [string, number][];
  const channels = Object.entries(analytics.channels).sort((a, b) => b[1] - a[1]);
  const sources = Object.entries(analytics.sources).sort((a, b) => b[1] - a[1]);
  const nameOf = (slug: string) => (productBySlug(slug) ? productBySlug(slug)!.name : slug);

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-ink">Visão geral</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Sessões" value={analytics.sessions} />
        <Stat label="Eventos registrados" value={totalEvents} />
        <Stat label="Produtos ativos" value={products.filter((p) => p.status === "active").length} />
        <Stat label="Encomendas" value={orders.length} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Rank title="Produtos mais visualizados" rows={views} fmt={nameOf} />
        <Rank title="Produtos mais clicados" rows={clicks} fmt={nameOf} />
        <Rank title="Cliques por canal" rows={channels} />
        <Rank title="Origem dos visitantes" rows={sources} />
      </div>
    </div>
  );
}

/* ---------------- Product editor ---------------- */
const blankProduct = (): Product => ({
  id: uid(),
  name: "",
  slug: "",
  collectionId: "col-floralis",
  categoryId: "cat-aromaticas",
  shortDescription: "",
  description: "",
  images: [],
  olfactoryProfile: "",
  aromaticNotes: [],
  weight: "100g",
  burnTime: "",
  ingredients: "",
  instructions: "",
  care: "",
  price: 0,
  salePrice: null,
  stock: 0,
  status: "active",
  featured: false,
  availableForDelivery: true,
  availableForPickup: true,
  channels: { site: true, shopee: true, mercadolivre: true, whatsapp: true },
  links: { site: "", shopee: "", mercadolivre: "", whatsapp: "" },
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

function ProductEditor({ initial, onDone }: { initial: Product; onDone: () => void }) {
  const { saveProduct, collections, categories, track } = useStore();
  const [f, setF] = useState<Product>(initial);
  const [images, setImages] = useState(initial.images.join("\n"));
  const [notes, setNotes] = useState(initial.aromaticNotes.join("\n"));

  const set = (patch: Partial<Product>) => setF((p) => ({ ...p, ...patch }));
  const setChan = (k: keyof Product["channels"], v: boolean) => set({ channels: { ...f.channels, [k]: v } });
  const setLink = (k: keyof Product["links"], v: string) => set({ links: { ...f.links, [k]: v } });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await saveProduct({
        ...f,
        slug: f.slug.trim() ? slugify(f.slug) : slugify(f.name),
        images: images.split("\n").map((s) => s.trim()).filter(Boolean),
        aromaticNotes: notes.split("\n").map((s) => s.trim()).filter(Boolean),
        salePrice: f.salePrice && f.salePrice > 0 ? f.salePrice : null,
        updatedAt: Date.now(),
      });
      track("admin_save_product", {});
      onDone();
    } catch (e: any) {
      setErr(e?.message || "Erro ao salvar o produto.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">{initial.id ? "Editar" : "Novo"} produto</h2>
        <button type="button" onClick={onDone} className="btn-outline !px-4 !py-2 !text-[12px]">Voltar</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Nome *</Label><input className={fieldCls()} value={f.name} onChange={(e) => set({ name: e.target.value })} required /></div>
        <div><Label>Slug</Label><input className={fieldCls()} value={f.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="gerado do nome" /></div>
        <div>
          <Label>Coleção</Label>
          <select className={fieldCls()} value={f.collectionId} onChange={(e) => set({ collectionId: e.target.value })}>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Categoria</Label>
          <select className={fieldCls()} value={f.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2"><Label>Descrição curta</Label><textarea className={fieldCls()} rows={2} value={f.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Descrição completa</Label><textarea className={fieldCls()} rows={3} value={f.description} onChange={(e) => set({ description: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Imagens (um URL por linha)</Label><textarea className={fieldCls()} rows={3} value={images} onChange={(e) => setImages(e.target.value)} /></div>
        <div><Label>Perfil olfativo</Label><input className={fieldCls()} value={f.olfactoryProfile} onChange={(e) => set({ olfactoryProfile: e.target.value })} /></div>
        <div><Label>Notas aromáticas (uma por linha)</Label><textarea className={fieldCls()} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <div><Label>Peso</Label><input className={fieldCls()} value={f.weight} onChange={(e) => set({ weight: e.target.value })} /></div>
        <div><Label>Queima</Label><input className={fieldCls()} value={f.burnTime || ""} onChange={(e) => set({ burnTime: e.target.value })} /></div>
        <div><Label>Preço (R$)</Label><input type="number" className={fieldCls()} value={f.price} onChange={(e) => set({ price: +e.target.value })} /></div>
        <div><Label>Preço promocional (R$)</Label><input type="number" className={fieldCls()} value={f.salePrice ?? ""} onChange={(e) => set({ salePrice: e.target.value ? +e.target.value : null })} /></div>
        <div><Label>Estoque</Label><input type="number" className={fieldCls()} value={f.stock} onChange={(e) => set({ stock: +e.target.value })} /></div>
        <div>
          <Label>Status</Label>
          <select className={fieldCls()} value={f.status} onChange={(e) => set({ status: e.target.value as Product["status"] })}>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
        <div className="sm:col-span-2"><Label>Ingredientes</Label><textarea className={fieldCls()} rows={2} value={f.ingredients} onChange={(e) => set({ ingredients: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Modo de uso</Label><textarea className={fieldCls()} rows={2} value={f.instructions} onChange={(e) => set({ instructions: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Cuidados</Label><textarea className={fieldCls()} rows={2} value={f.care} onChange={(e) => set({ care: e.target.value })} /></div>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-soft">Opções</p>
        <div className="flex flex-wrap gap-3">
          {([
            ["featured", "Em destaque"],
            ["availableForPickup", "Retirada"],
            ["availableForDelivery", "Entrega"],
          ] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[12px] text-ink">
              <input type="checkbox" checked={f[k] as boolean} onChange={(e) => set({ [k]: e.target.checked } as any)} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-soft">Canais de compra</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            ["site", "Loja / site", "site"],
            ["shopee", "Shopee", "shopee"],
            ["mercadolivre", "Mercado Livre", "mercadolivre"],
            ["whatsapp", "WhatsApp", "whatsapp"],
          ] as const).map(([k, label, linkKey]) => (
            <div key={k} className="rounded-[2px] border border-ink/10 bg-ghost p-3">
              <label className="flex items-center gap-2 text-[13px] text-ink">
                <input type="checkbox" checked={f.channels[k]} onChange={(e) => setChan(k, e.target.checked)} />
                <span className="font-medium">{label} (ativo)</span>
              </label>
              <input className={`${fieldCls()} mt-2`} placeholder={`Link ${label}`} value={f.links[linkKey] || ""} onChange={(e) => setLink(k as any, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {err && <p className="rounded-[2px] bg-terra/10 px-4 py-3 text-[13px] text-terra-dark">{err}</p>}
      <button className="btn-primary" disabled={busy}>
        {busy ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}

function ProductManager() {
  const { products, collectionById, deleteProduct, track } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  if (editing) return <ProductEditor initial={editing} onDone={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">Produtos</h2>
        <button onClick={() => setEditing({ ...blankProduct(), id: "" })} className="btn-primary !px-4 !py-2 !text-[12px]"><IconPlus className="h-4 w-4" /> Novo</button>
      </div>
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-[2px] border border-ink/10 bg-ghost p-3">
            <img src={p.images[0]} alt="" className="h-14 w-14 rounded-[2px] object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-ink">{p.name}</p>
              <p className="text-[12px] text-ink-soft">{collectionById(p.collectionId)?.name} · {p.weight} · R$ {p.price}</p>
            </div>
            <span className={`hidden rounded-full px-2.5 py-1 text-[10px] sm:block ${p.stock > 0 ? "bg-linen text-olive" : "bg-ink/8 text-ink-soft"}`}>{p.stock > 0 ? `${p.stock} no estoque` : "Esgotado"}</span>
            <span className={`hidden rounded-full px-2.5 py-1 text-[10px] sm:block ${p.featured ? "bg-terra/15 text-terra" : "bg-linen text-ink-soft"}`}>{p.featured ? "Destaque" : "Normal"}</span>
            <button onClick={() => setEditing(p)} className="btn-outline !px-3 !py-1.5 !text-[12px]">Editar</button>
            <button
              onClick={async () => {
                if (!confirm(`Excluir "${p.name}"? Esta ação não pode ser desfeita.`)) return;
                try {
                  await deleteProduct(p.id);
                  track("admin_delete_product", {});
                } catch (e: any) {
                  alert(e?.message || "Erro ao excluir.");
                }
              }}
              className="btn-outline !px-3 !py-1.5 !text-[12px] !text-terra"
            >Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Collections manager ---------------- */
function CollectionManager() {
  const { collections, saveCollection, deleteCollection } = useStore();
  const [editing, setEditing] = useState<Collection | null>(null);
  const blank = (): Collection => ({ id: "", name: "", slug: "", tagline: "", description: "", image: "", editorial: "" });
  if (editing) {
    const f = editing;
    const set = (patch: Partial<Collection>) => setEditing((c) => (c ? { ...c, ...patch } : c));
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await saveCollection(f);
            setEditing(null);
          } catch (err: any) {
            alert(err?.message || "Erro ao salvar a coleção.");
          }
        }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ink">{f.id ? "Editar" : "Nova"} coleção</h2>
          <button type="button" onClick={() => setEditing(null)} className="btn-outline !px-4 !py-2 !text-[12px]">Voltar</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nome</Label><input className={fieldCls()} value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
          <div><Label>Slug</Label><input className={fieldCls()} value={f.slug} onChange={(e) => set({ slug: e.target.value })} /></div>
          <div><Label>Tagline</Label><input className={fieldCls()} value={f.tagline} onChange={(e) => set({ tagline: e.target.value })} /></div>
          <div><Label>Imagem (URL)</Label><input className={fieldCls()} value={f.image} onChange={(e) => set({ image: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><textarea className={fieldCls()} rows={2} value={f.description} onChange={(e) => set({ description: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Editorial</Label><textarea className={fieldCls()} rows={3} value={f.editorial} onChange={(e) => set({ editorial: e.target.value })} /></div>
        </div>
        <button className="btn-primary">Salvar coleção</button>
      </form>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">Coleções</h2>
        <button onClick={() => setEditing(blank())} className="btn-primary !px-4 !py-2 !text-[12px]"><IconPlus className="h-4 w-4" /> Nova</button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {collections.map((c) => (
          <div key={c.id} className="rounded-[2px] border border-ink/10 bg-ghost p-4">
            <p className="font-serif text-lg text-ink">{c.name}</p>
            <p className="text-[12px] text-ink-soft">{c.tagline}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(c)} className="btn-outline !px-3 !py-1.5 !text-[12px]">Editar</button>
              <button
                onClick={async () => {
                  if (!confirm(`Excluir a coleção "${c.name}"?`)) return;
                  try { await deleteCollection(c.id); } catch (e: any) { alert(e?.message || "Erro ao excluir."); }
                }}
                className="btn-outline !px-3 !py-1.5 !text-[12px] !text-terra"
              >Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Categories manager ---------------- */
function CategoryManager() {
  const { categories, saveCategory, deleteCategory } = useStore();
  const [name, setName] = useState("");
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      await saveCategory({ id: "", name: name.trim(), slug, description: name.trim() });
      setName("");
    } catch (e: any) {
      alert(e?.message || "Erro ao criar a categoria.");
    }
  };
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Categorias</h2>
      <form onSubmit={add} className="mt-5 flex gap-2">
        <input className={fieldCls()} placeholder="Nova categoria" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary !px-4 !py-2 !text-[12px]"><IconPlus className="h-4 w-4" /></button>
      </form>
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span key={c.id} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[13px] text-ink">
            {c.name}
            <button
              onClick={async () => {
                if (!confirm(`Excluir a categoria "${c.name}"?`)) return;
                try { await deleteCategory(c.id); } catch (e: any) { alert(e?.message || "Erro ao excluir."); }
              }}
              className="text-terra"
            ><IconClose className="h-3.5 w-3.5" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
function OrderStatus({ s }: { s: string }) {
  const map: Record<string, string> = { nova: "Nova", em_andamento: "Em andamento", concluida: "Concluída" };
  const color: Record<string, string> = { nova: "bg-terra/15 text-terra", em_andamento: "bg-gold/15 text-gold", concluida: "bg-olive/15 text-olive" };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] ${color[s] || ""}`}>{map[s] || s}</span>;
}
function OrdersManager() {
  const { orders, setOrderStatus, deleteOrder } = useStore();
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Solicitações de encomendas</h2>
      {orders.length === 0 ? (
        <p className="mt-6 text-[14px] text-ink-soft">Nenhuma encomenda registrada ainda.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-[2px] border border-ink/10 bg-ghost p-4">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <p className="font-medium text-ink">{o.name} · {o.type}</p>
                  <p className="text-[12px] text-ink-soft">{o.whatsapp} · {o.email}</p>
                  <p className="text-[12px] text-ink-soft">Qtd: {o.quantity || "—"} · Produto: {o.interest || "—"} · Data: {o.date || "—"}</p>
                  {o.message && <p className="mt-2 text-[13px] text-ink-soft">“{o.message}”</p>}
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatus s={o.status} />
                  <select
                    className={fieldCls()}
                    value={o.status}
                    onChange={async (e) => {
                      try { await setOrderStatus(o.id, e.target.value as any); } catch (err: any) { alert(err?.message || "Erro."); }
                    }}
                  >
                    <option value="nova">Nova</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (!confirm("Excluir esta encomenda?")) return;
                      try { await deleteOrder(o.id); } catch (err: any) { alert(err?.message || "Erro."); }
                    }}
                    className="btn-outline !px-3 !py-1.5 !text-[12px] !text-terra"
                  >Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Messages ---------------- */
function MessagesManager() {
  const { messages, deleteMessage } = useStore();
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Mensagens de contato</h2>
      {messages.length === 0 ? (
        <p className="mt-6 text-[14px] text-ink-soft">Nenhuma mensagem recebida ainda.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-[2px] border border-ink/10 bg-ghost p-4">
              <p className="font-medium text-ink">{m.name} · {m.subject}</p>
              <p className="text-[12px] text-ink-soft">{m.email}</p>
              <p className="mt-2 text-[13px] text-ink-soft">{m.message}</p>
              <button
                onClick={async () => {
                  if (!confirm("Excluir esta mensagem?")) return;
                  try { await deleteMessage(m.id); } catch (e: any) { alert(e?.message || "Erro."); }
                }}
                className="btn-outline mt-3 !px-3 !py-1.5 !text-[12px] !text-terra"
              >Excluir</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsManager() {
  const { settings, updateSettings, deliveryRegions, saveDeliveryRegion, deleteDeliveryRegion } = useStore();
  const [s, setS] = useState(settings);
  const [region, setRegion] = useState<Omit<DeliveryRegion, "id">>(emptyRegion);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (patch: Partial<typeof s>) => setS((p) => ({ ...p, ...patch }));

  const inputs: { label: string; key: keyof typeof s }[] = [
    { label: "E-mail", key: "email" },
    { label: "WhatsApp (com DDI)", key: "whatsapp" },
    { label: "WhatsApp (exibição)", key: "whatsappDisplay" },
    { label: "Instagram", key: "instagram" },
    { label: "TikTok", key: "tiktok" },
    { label: "Shopee", key: "shopee" },
    { label: "Mercado Livre", key: "mercadolivre" },
    { label: "Cidade", key: "city" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-ink">Configurações</h2>
        <button
          onClick={async () => {
            setSaving(true);
            try {
              await updateSettings(s);
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            } catch (e: any) {
              alert(e?.message || "Erro ao salvar.");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="btn-primary !px-4 !py-2 !text-[12px]"
        >
          <IconCheck className="h-4 w-4" /> {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
        </button>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-soft">Marca</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nome</Label><input className={fieldCls()} value={s.brandName} onChange={(e) => set({ brandName: e.target.value })} /></div>
          <div><Label>Mensagem central</Label><input className={fieldCls()} value={s.message} onChange={(e) => set({ message: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Subtexto</Label><textarea className={fieldCls()} rows={2} value={s.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[12px] font-medium uppercase tracking-wide text-ink-soft">Contato e redes</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {inputs.map((i) => (
            <div key={i.key}><Label>{i.label}</Label><input className={fieldCls()} value={s[i.key]} onChange={(e) => set({ [i.key]: e.target.value } as any)} /></div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium uppercase tracking-wide text-ink-soft">Regiões de entrega / retirada</p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!region.name.trim()) return;
            try {
              await saveDeliveryRegion({ id: "", ...region });
              setRegion(emptyRegion());
            } catch (err: any) { alert(err?.message || "Erro ao salvar a região."); }
          }}
          className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_1fr_auto]"
        >
          <input className={fieldCls()} placeholder="Região (ex: Artur Nogueira)" value={region.name} onChange={(e) => setRegion({ ...region, name: e.target.value })} />
          <select className={fieldCls()} value={region.type} onChange={(e) => setRegion({ ...region, type: e.target.value as any })}>
            <option value="retirada">Retirada</option>
            <option value="entrega">Entrega</option>
            <option value="envio">Envio</option>
          </select>
          <input className={fieldCls()} placeholder="Nota" value={region.note} onChange={(e) => setRegion({ ...region, note: e.target.value })} />
          <button className="btn-primary !px-4 !py-2 !text-[12px]"><IconPlus className="h-4 w-4" /></button>
        </form>
        <div className="mt-4 space-y-2">
          {deliveryRegions.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-[2px] border border-ink/10 bg-ghost px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-ink">{r.name}</p>
                <p className="text-[12px] text-ink-soft">{r.type} · {r.note}</p>
              </div>
              <button
                onClick={async () => {
                  try { await deleteDeliveryRegion(r.id); } catch (e: any) { alert(e?.message || "Erro ao excluir."); }
                }}
                className="btn-outline !px-3 !py-1.5 !text-[12px] !text-terra"
              >Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */
const tabs = ["Dashboard", "Produtos", "Coleções", "Categorias", "Encomendas", "Mensagens", "Configurações"] as const;
type Tab = (typeof tabs)[number];

export default function Admin() {
  const { isAuthed, logout, online, authEmail, refreshAdminData, loading } = useStore();
  useSeo("Administração");
  const [tab, setTab] = useState<Tab>("Dashboard");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <IconFlame className="mx-auto h-8 w-8 text-terra animate-flicker" />
          <p className="mt-3 text-[13px] text-ink-soft">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return <Login />;

  return (
    <div className="min-h-screen bg-cream-2">
      <div className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="shell flex h-16 items-center justify-between">
          <span className="font-serif text-xl tracking-[0.2em] text-ink">ALKAIA · <span className="text-terra">Admin</span></span>
          <div className="flex items-center gap-3">
            <span
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] sm:inline-flex ${
                online ? "bg-olive/15 text-olive" : "bg-gold/15 text-gold"
              }`}
              title={online ? "Dados salvos no Supabase" : "Dados apenas neste navegador"}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-olive" : "bg-gold"}`} />
              {online ? "Conectado ao banco" : "Modo demonstração"}
            </span>
            {authEmail && <span className="hidden text-[12px] text-ink-soft lg:block">{authEmail}</span>}
            <button onClick={() => refreshAdminData()} className="btn-outline !px-4 !py-2 !text-[12px]">Atualizar</button>
            <button onClick={() => logout()} className="btn-outline !px-4 !py-2 !text-[12px]">Sair</button>
          </div>
        </div>
      </div>

      {!online && (
        <div className="border-b border-gold/30 bg-gold/10">
          <div className="shell py-3 text-[12px] text-ink-soft">
            <strong className="text-ink">Modo demonstração:</strong> as alterações ficam salvas apenas neste navegador.
            Configure as variáveis <code className="rounded bg-ink/5 px-1">VITE_SUPABASE_URL</code> e{" "}
            <code className="rounded bg-ink/5 px-1">VITE_SUPABASE_ANON_KEY</code> para salvar no banco de dados.
          </div>
        </div>
      )}
      <div className="shell py-8">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors ${tab === t ? "bg-ink text-cream" : "bg-ghost text-ink-soft hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {tab === "Dashboard" && <Dashboard />}
          {tab === "Produtos" && <ProductManager />}
          {tab === "Coleções" && <CollectionManager />}
          {tab === "Categorias" && <CategoryManager />}
          {tab === "Encomendas" && <OrdersManager />}
          {tab === "Mensagens" && <MessagesManager />}
          {tab === "Configurações" && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}
