"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSignup() {
    document.getElementById("waitlist-cta")?.scrollIntoView({ behavior: "smooth" });
    // Plausible event
    if (typeof window !== "undefined" && (window as { plausible?: (e: string) => void }).plausible) {
      (window as { plausible?: (e: string) => void }).plausible?.("hero_cta_click");
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container-content flex items-center justify-between h-16">
        <span className="font-serif text-xl text-ink tracking-tight">Viph</span>
        <button onClick={scrollToSignup} className="btn-amber py-2 px-5 text-xs">
          Join waitlist
        </button>
      </div>
    </nav>
  );
}
