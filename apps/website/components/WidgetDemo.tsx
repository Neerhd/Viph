"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function WidgetDemo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const w = window as { plausible?: (e: string) => void };
          w.plausible?.("demo_viewed");
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream-warm py-24 md:py-32 overflow-hidden">
      <div className="container-content">

        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">See it in action</div>
          <h2 className="font-serif text-[clamp(30px,4vw,42px)] leading-[1.15] text-ink">
            What your customers experience.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center reveal">

          {/* Left — fake product page */}
          <div className="relative">
            <div className="bg-cream-warm border border-border rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(26,22,20,0.06)]">
              {/* Fake browser bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-cream/60">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="flex-1 mx-3 h-5 rounded-full bg-border/60 flex items-center px-3">
                  <span className="text-[10px] text-ink-secondary/40 font-sans">bloomandember.com/amber-smoke-3</span>
                </div>
              </div>

              {/* Product page content */}
              <div className="p-6">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-border/40">
                  <Image
                    src="https://images.unsplash.com/photo-1608181831718-c9fbb4e2a1f0?w=600&q=80"
                    alt="Amber & Smoke candle"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="text-[10px] text-ink-secondary/50 mb-1 font-sans uppercase tracking-wider">Hand-poured</div>
                <h3 className="font-serif text-lg text-ink mb-1">Amber &amp; Smoke No. 3</h3>
                <div className="text-ink-secondary font-sans font-medium text-sm mb-2">£28.00</div>
                <p className="text-ink-secondary/70 text-xs leading-relaxed mb-4">
                  Deep, smoky amber with warm cedar and a breath of black pepper.
                  Burns for 45 hours.
                </p>
                <button className="w-full py-2.5 rounded-lg bg-ink text-cream-warm text-xs font-sans font-medium mb-2">
                  Add to cart
                </button>

                {/* Viph widget button */}
                <div className="flex items-center gap-2 py-2.5 px-4 rounded-lg border border-amber/30 bg-amber/5 cursor-pointer">
                  <span className="text-amber text-sm">✦</span>
                  <span className="text-amber text-xs font-medium font-sans">
                    Not sure if this scent is for you? →
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting arrow */}
            <div className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 items-center">
              <div className="w-6 h-px bg-amber/40" />
              <div className="text-amber/60 text-sm">›</div>
            </div>
          </div>

          {/* Right — animated quiz panel */}
          <div>
            <div className="bg-cream-warm border border-border rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(26,22,20,0.06)] relative" style={{ minHeight: 340 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <span className="font-sans text-sm font-semibold text-ink">Find your scent</span>
                <span className="text-ink-secondary/30 text-base">✕</span>
              </div>

              {/* Animated progress bar */}
              <div className="h-[3px] bg-border overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full"
                  style={{
                    animation: "progressBar 9s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Quiz steps — CSS animated cycling */}
              <div className="relative px-5 py-5" style={{ minHeight: 220 }}>

                {/* Step 1: Scent tiles */}
                <div className="quiz-slide-1 absolute inset-0 px-5 py-5">
                  <p className="font-sans text-[13px] font-semibold text-ink mb-4 leading-snug">
                    What scents do you already love?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Vanilla", "Cedar", "Citrus", "Floral", "Ocean", "Spice"].map((s) => (
                      <div
                        key={s}
                        className={`px-3 py-2.5 rounded-xl border text-center text-xs font-medium font-sans ${
                          s === "Vanilla"
                            ? "border-amber bg-amber/10 text-ink tile-animate"
                            : "border-border bg-white text-ink-secondary"
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Vibe */}
                <div className="quiz-slide-2 absolute inset-0 px-5 py-5">
                  <p className="font-sans text-[13px] font-semibold text-ink mb-4 leading-snug">
                    What vibe are you going for?
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "Cosy night in", selected: true },
                      { label: "Fresh morning", selected: false },
                      { label: "Romantic", selected: false },
                    ].map(({ label, selected }) => (
                      <div
                        key={label}
                        className={`px-4 py-3 rounded-xl border text-left text-xs font-medium font-sans ${
                          selected
                            ? "border-amber bg-amber/10 text-ink"
                            : "border-border bg-white text-ink-secondary"
                        }`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Result */}
                <div className="quiz-slide-3 absolute inset-0 px-5 py-5">
                  <div className="section-label mb-3">Your match</div>
                  <div className="flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-border shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1608181831718-c9fbb4e2a1f0?w=200&q=80"
                        alt="Match product"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <div className="font-serif text-sm text-ink font-semibold mb-1">
                        Amber &amp; Smoke No. 3
                      </div>
                      <p className="text-[11px] text-ink-secondary leading-relaxed">
                        This one&apos;s a strong match. Warm, enveloping — exactly the
                        cosy evening scent you described.
                      </p>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold text-cream-warm font-sans"
                    style={{ background: "#B5622A" }}
                  >
                    View product →
                  </button>
                </div>

              </div>

              {/* Footer nav */}
              <div className="flex justify-end px-5 pb-4">
                <div
                  className="px-5 py-2 rounded-full text-xs font-semibold text-cream-warm font-sans"
                  style={{ background: "#1A1614" }}
                >
                  Next →
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes progressBar {
                0% { width: 25%; }
                30% { width: 25%; }
                33% { width: 50%; }
                62% { width: 50%; }
                65% { width: 75%; }
                92% { width: 75%; }
                95% { width: 100%; }
                100% { width: 25%; }
              }
            `}</style>
          </div>

        </div>
      </div>
    </section>
  );
}
