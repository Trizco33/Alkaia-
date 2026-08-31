import { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { useSeo } from "../components/Layout";
import { Reveal, SectionHeader, ProductCard, IconFlame, IconArrow } from "../components/ui";
import { ritualMatches } from "../data/seed";

const moods = [
  { key: "Relaxar", emoji: "🌙", desc: "Desacelerar e encontrar calma" },
  { key: "Ter energia", emoji: "🌿", desc: "Despertar o corpo e a mente" },
  { key: "Criar uma atmosfera acolhedora", emoji: "🏡", desc: "Aconchegar o seu espaço" },
  { key: "Concentrar", emoji: "🕯️", desc: "Foco e presença" },
  { key: "Presentear alguém", emoji: "🎁", desc: "Um gesto de carinho" },
];

export default function Ritual() {
  const { products, track } = useStore();
  useSeo("Descubra seu Ritual", "Descubra o ritual Alkaia ideal para você com base em como você quer se sentir hoje.");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (selected) track("click_find_ritual", { slug: selected });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const match = ritualMatches.find((m) => m.mood === selected);
  const recs = match ? products.filter((p) => match.productSlugs.includes(p.slug)) : [];

  return (
    <div className="shell py-16 sm:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Descubra seu ritual"
          title="Como você quer se sentir hoje?"
          text="Responda uma pergunta e deixe a Alkaia sugerir o ritual perfeito para o seu momento."
        />
      </Reveal>

      {!selected ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moods.map((m, i) => (
            <Reveal key={m.key} delay={i * 70}>
              <button
                onClick={() => setSelected(m.key)}
                className="group flex h-full w-full items-center gap-4 rounded-[2px] border border-ink/10 bg-ghost p-6 text-left transition-all hover:border-ink/30 hover:shadow-[0_20px_45px_-28px_rgba(42,34,27,0.6)]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linen text-2xl">{m.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-ink">{m.key}</h3>
                  <p className="text-[12px] text-ink-soft">{m.desc}</p>
                </div>
                <IconArrow className="h-4 w-4 text-terra transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        match && (
          <div className="mt-10 animate-fade-up">
            <div className="rounded-[2px] border border-terra/30 bg-cream-2 p-8 text-center sm:p-12">
              <IconFlame className="mx-auto h-9 w-9 text-terra animate-flicker" />
              <p className="eyebrow mt-4 text-terra">Seu ritual Alkaia</p>
              <h2 className="mt-2 font-serif text-4xl text-ink sm:text-5xl text-balance">{match.title}</h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft text-pretty">{match.description}</p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-ink-soft/70">Para o momento: {match.mood}</p>
              <button onClick={() => setSelected(null)} className="btn-outline mt-7">Recomeçar</button>
            </div>

            {recs.length > 0 && (
              <div className="mt-14">
                <h3 className="text-center font-serif text-3xl text-ink">Produtos para este ritual</h3>
                <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
                  {recs.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
