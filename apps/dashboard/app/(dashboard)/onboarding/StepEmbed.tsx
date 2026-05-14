"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export function StepEmbed() {
  const { data: session } = useSession();
  const user = session?.user as { storeId?: string } | undefined;
  const [copied, setCopied] = useState(false);

  const storeId = user?.storeId ?? "your-store-id";
  const snippet = `<script src="https://viph.co/widget.js" data-store-id="${storeId}"></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card max-w-xl">
      <div className="text-green-600 text-3xl mb-3">✓</div>
      <h2 className="font-semibold text-lg mb-1">You&apos;re all set</h2>
      <p className="text-stone-500 text-sm mb-6">
        Paste this single line into your store&apos;s HTML — before the closing{" "}
        <code className="bg-stone-100 px-1 rounded text-xs">&lt;/body&gt;</code> tag. That&apos;s it.
      </p>

      <div className="bg-stone-900 rounded-xl p-4 mb-4">
        <code className="text-green-400 text-sm break-all font-mono">{snippet}</code>
      </div>

      <button onClick={copy} className="btn-primary">
        {copied ? "Copied!" : "Copy embed code"}
      </button>

      <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
        <div className="text-xs text-stone-400 flex items-start gap-2">
          <span>◉</span>
          <span>Works on Shopify, WooCommerce, Squarespace, Wix, or any custom site.</span>
        </div>
        <div className="text-xs text-stone-400 flex items-start gap-2">
          <span>◉</span>
          <span>The quiz appears as a floating button — non-intrusive, no layout interference.</span>
        </div>
        <div className="text-xs text-stone-400 flex items-start gap-2">
          <span>◉</span>
          <span>Customise the button text, color, and position in Settings.</span>
        </div>
      </div>
    </div>
  );
}
