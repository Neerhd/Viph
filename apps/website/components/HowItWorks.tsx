export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Import your products",
      desc: "Connect your Shopify store or upload a simple CSV. Your products appear in your dashboard in under a minute.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Tag your scents",
      desc: "Tell Viph what each product smells like — family, intensity, mood. We suggest tags automatically from your descriptions.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Paste one line of code",
      desc: "Copy your embed script and paste it into your store theme. The quiz appears on every product page instantly.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ];

  const platforms = ["Shopify", "WooCommerce", "Squarespace", "Wix", "Custom"];

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-content">

        <div className="mb-16 reveal">
          <div className="section-label mb-4">How Viph works</div>
          <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.15] text-ink max-w-xl">
            Ten minutes to set up.{" "}
            <span className="text-ink-secondary">Works on any store.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16">
          {steps.map((step, i) => (
            <div key={step.num} className="relative reveal" style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Faded step number */}
              <div
                className="absolute -top-4 left-0 font-serif text-[120px] leading-none text-ink/[0.04] select-none pointer-events-none"
                aria-hidden="true"
              >
                {step.num}
              </div>

              <div className="relative pt-12">
                <div className="text-amber mb-4">{step.icon}</div>
                <h3 className="font-serif text-xl text-ink mb-2">{step.title}</h3>
                <p className="text-ink-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector arrow on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[58px] -right-3 text-border text-lg">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider + platform pills */}
        <div className="reveal">
          <div className="h-px bg-amber/20 mb-8" />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-ink-secondary whitespace-nowrap">
              Works on
            </span>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 rounded-full border border-border text-xs text-ink-secondary font-sans"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
