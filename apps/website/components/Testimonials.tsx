const testimonials = [
  {
    quote:
      "We had beautiful candles and a gorgeous store. But our conversion rate was stuck at 1.2%. The quiz helped customers actually commit.",
    name: "Sarah M.",
    brand: "Wax & Wick Studio",
    city: "London",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    quote:
      "I was spending hours rewriting product descriptions trying to describe scents better. Viph solved that problem in a completely different way.",
    name: "Jen K.",
    brand: "North Candle Co.",
    city: "Amsterdam",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    quote:
      "Set up in 8 minutes. Genuinely. My developer was surprised.",
    name: "Priya S.",
    brand: "Bloom & Burn",
    city: "New York",
    avatar: "https://i.pravatar.cc/80?img=25",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-content">

        <div className="mb-12 reveal">
          <div className="section-label mb-4">From the waitlist</div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] leading-[1.2] text-ink">
            Early makers, honest thoughts.
          </h2>
        </div>

        {/* Horizontal scroll on mobile, 3-col on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 reveal">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[280px] md:min-w-0 snap-start bg-cream-warm border border-border rounded-2xl p-6 flex flex-col gap-5 flex-shrink-0 md:flex-shrink"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Quote marks */}
              <div className="font-serif text-3xl text-amber/30 leading-none">&ldquo;</div>

              <p className="text-ink/80 text-sm leading-[1.75] flex-1">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-border flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink font-sans">{t.name}</div>
                  <div className="text-[11px] text-ink-secondary font-sans">
                    {t.brand}, {t.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 reveal">
          <span className="section-label text-ink-secondary/50">
            Early access testimonials — results may vary
          </span>
        </div>

      </div>
    </section>
  );
}
