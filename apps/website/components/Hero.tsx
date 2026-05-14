import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 pb-12 bg-cream overflow-hidden">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center min-h-[calc(100vh-7rem)]">

          {/* Left column */}
          <div className="flex flex-col justify-center">
            <div
              className="hero-word section-label mb-6"
              style={{ animationDelay: "0.1s" }}
            >
              Now in early access
            </div>

            <h1 className="font-serif text-[clamp(40px,6vw,72px)] leading-[1.08] text-ink mb-6 tracking-tight">
              <span className="hero-word block" style={{ animationDelay: "0.2s" }}>
                Your candle smells
              </span>
              <span className="hero-word block" style={{ animationDelay: "0.35s" }}>
                incredible.
              </span>
              <span
                className="hero-word block text-ink-secondary"
                style={{ animationDelay: "0.5s" }}
              >
                Your customers
              </span>
              <span
                className="hero-word block text-ink-secondary"
                style={{ animationDelay: "0.65s" }}
              >
                just can&apos;t tell.
              </span>
            </h1>

            <p
              className="hero-word text-[18px] text-ink-secondary leading-relaxed mb-8 max-w-[480px]"
              style={{ animationDelay: "0.8s" }}
            >
              Viph adds a scent discovery quiz to any product page. Shoppers
              find scents they&apos;ll love. You make more sales.
            </p>

            <div
              className="hero-word mb-5 max-w-[480px]"
              style={{ animationDelay: "0.95s" }}
            >
              <WaitlistForm />
              <p className="text-xs text-ink-secondary/70 mt-3 pl-1">
                47 store owners already waiting. Free for 60 days.
              </p>
            </div>

            {/* Social proof */}
            <div
              className="hero-word flex items-center gap-3 mt-2"
              style={{ animationDelay: "1.1s" }}
            >
              <div className="flex -space-x-2">
                {["44", "54", "64"].map((seed, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-cream bg-border overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.pravatar.cc/64?img=${seed}`}
                      alt="Store owner"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-secondary">
                Joined by makers from London, Amsterdam, New York
              </p>
            </div>
          </div>

          {/* Right column — widget mockup */}
          <div className="relative flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
            {/* Ambient blob */}
            <div
              className="absolute w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #B5622A 0%, #F5C089 60%, transparent 100%)" }}
            />

            {/* Widget card */}
            <div
              className="relative z-10 w-[300px] animate-float"
              style={{ filter: "drop-shadow(0 20px 40px rgba(26,22,20,0.12))" }}
            >
              <div className="bg-cream-warm rounded-2xl overflow-hidden border border-border">
                {/* Widget header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <span className="font-sans text-sm font-semibold text-ink">Find your scent</span>
                  <span className="text-ink-secondary/40 text-base leading-none">✕</span>
                </div>

                {/* Progress bar */}
                <div className="h-[3px] bg-border">
                  <div className="h-full w-1/4 bg-amber rounded-full" />
                </div>

                {/* Quiz body */}
                <div className="px-5 py-5">
                  <p className="font-sans text-[13px] font-semibold text-ink mb-4 leading-snug">
                    What scents do you already love?
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[
                      { label: "Vanilla", selected: true },
                      { label: "Cedar", selected: false },
                      { label: "Citrus", selected: false },
                      { label: "Floral", selected: false },
                    ].map(({ label, selected }) => (
                      <div
                        key={label}
                        className={`px-3 py-2.5 rounded-xl border text-center text-xs font-medium transition-colors ${
                          selected
                            ? "border-amber bg-amber/10 text-ink"
                            : "border-border bg-white text-ink-secondary"
                        }`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-ink-secondary/50">Pick as many as you like</p>
                </div>

                {/* Widget footer */}
                <div className="flex justify-end px-5 pb-5">
                  <div
                    className="px-5 py-2 rounded-full text-xs font-semibold text-cream-warm"
                    style={{ background: "#1A1614" }}
                  >
                    Next →
                  </div>
                </div>
              </div>

              {/* Source indicator — makes it feel like a screenshot */}
              <div className="mt-2 flex items-center justify-center gap-1.5 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-ink-secondary" />
                <span className="text-[10px] text-ink-secondary font-sans">bloomandember.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
