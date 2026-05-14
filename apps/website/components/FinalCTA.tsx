import { WaitlistForm } from "./WaitlistForm";

export function FinalCTA() {
  return (
    <section id="waitlist-cta" className="bg-ink py-24 md:py-32">
      <div className="container-content">
        <div className="max-w-xl mx-auto text-center">

          <h2 className="font-serif text-[clamp(36px,5vw,56px)] leading-[1.1] text-cream-warm mb-5 reveal">
            Ready to stop losing sales to uncertainty?
          </h2>

          <p className="text-cream-warm/50 text-[15px] leading-relaxed mb-10 reveal">
            Join 47 store owners on the waitlist. Free for your first 60 days.
            No credit card.
          </p>

          <div className="max-w-[480px] mx-auto mb-8 reveal">
            <WaitlistForm inputBg="bg-cream-warm/10" dark />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 reveal">
            {["Free for 60 days", "Works on any platform", "10 min setup"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-cream-warm/40 text-xs font-sans">
                <span className="text-amber">✓</span>
                {t}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
