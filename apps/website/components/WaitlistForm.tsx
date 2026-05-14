"use client";

import { useState } from "react";

interface Props {
  inputBg?: string;
  dark?: boolean;
}

export function WaitlistForm({ inputBg = "bg-cream-warm", dark = false }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState("success");
        // Plausible event
        const w = window as { plausible?: (e: string, opts?: object) => void };
        w.plausible?.("waitlist_signup", { props: { location: dark ? "footer" : "hero" } });
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className={`flex items-center gap-3 py-3 ${dark ? "text-cream-warm" : "text-ink"}`}>
        <span className="text-amber text-xl">✦</span>
        <div>
          <div className="font-medium text-sm">You&apos;re on the list.</div>
          <div className={`text-sm ${dark ? "text-cream-warm/60" : "text-ink-secondary"}`}>
            We&apos;ll be in touch soon.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@store.com"
          required
          className={`flex-1 ${inputBg} border border-border rounded-full px-5 py-3 text-sm text-ink placeholder:text-ink-secondary/50 outline-none focus:border-amber transition-colors`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-amber whitespace-nowrap"
        >
          {state === "loading" ? "Joining..." : "Join waitlist"}
        </button>
      </div>
      {state === "error" && (
        <p className={`text-xs mt-2 ${dark ? "text-red-300" : "text-red-500"}`}>
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
