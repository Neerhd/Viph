export function Footer() {
  return (
    <footer className="bg-cream border-t-2 border-amber/20 py-8">
      <div className="container-content">

        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <span className="font-serif text-lg text-ink tracking-tight">Viph</span>

          <p className="text-ink-secondary text-xs text-center font-sans">
            Built for candle makers, soap makers, and fragrance brands.
          </p>

          <a
            href="#"
            aria-label="Instagram"
            className="text-ink-secondary hover:text-ink transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-6 border-t border-border">
          <span className="text-xs text-ink-secondary/50 font-sans">© 2025 Viph</span>
          <div className="flex gap-5">
            {["Privacy", "Terms"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-ink-secondary/50 hover:text-ink-secondary font-sans transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
