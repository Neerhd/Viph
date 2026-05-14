import Image from "next/image";

export function Problem() {
  return (
    <section className="bg-ink text-cream-warm py-24 md:py-32 overflow-hidden">
      <div className="container-content">

        {/* Headline */}
        <div className="text-center mb-16 reveal">
          <h2 className="font-serif text-[clamp(32px,4.5vw,48px)] leading-[1.15] text-cream-warm">
            In store, scent sells itself.
            <br />
            <span className="text-cream-warm/50">Online, it&apos;s just words.</span>
          </h2>
        </div>

        {/* Two column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 relative reveal">
          {/* Vertical amber divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-amber/30 -translate-x-1/2" />

          {/* Left — The old way */}
          <div className="pr-0 md:pr-16 pb-12 md:pb-0">
            <div className="section-label text-amber/80 mb-5">The old way</div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-ink-secondary/20">
              <Image
                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"
                alt="Hands holding a lit candle"
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="text-cream-warm/70 text-[15px] leading-[1.75]">
              A customer walks past. They catch a whiff. In seconds they know —
              this is the one. That moment is effortless.{" "}
              <span className="text-cream-warm">You never have to explain it.</span>
            </p>
          </div>

          {/* Horizontal divider on mobile */}
          <div className="md:hidden w-full h-px bg-amber/20 my-10" />

          {/* Right — The problem */}
          <div className="pl-0 md:pl-16">
            <div
              className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5"
              style={{ color: "#E05252" }}
            >
              The problem
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-ink-secondary/20">
              <Image
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
                alt="Person looking at phone"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
            <p className="text-cream-warm/70 text-[15px] leading-[1.75]">
              Online they read &ldquo;warm amber with hints of vanilla and musk.&rdquo;
              They think — <em>maybe?</em> They&apos;re not sure. So they leave.{" "}
              <span className="text-cream-warm">
                That sale was already yours. You just lost it to uncertainty.
              </span>
            </p>
          </div>
        </div>

        {/* Centered stat */}
        <div className="text-center mt-20 reveal">
          <div className="font-serif text-[clamp(72px,12vw,96px)] text-amber leading-none mb-3">
            67%
          </div>
          <p className="text-cream-warm/60 text-[15px] max-w-sm mx-auto leading-relaxed">
            of candle store visitors leave without buying — most because they
            can&apos;t imagine the scent.
          </p>
        </div>

      </div>
    </section>
  );
}
