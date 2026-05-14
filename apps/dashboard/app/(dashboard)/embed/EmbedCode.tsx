"use client";

import { useState } from "react";

export function EmbedCode({ storeId }: { storeId: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="https://viph.co/widget.js" data-store-id="${storeId}"></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Embed code</h1>
        <p className="text-stone-500 text-sm mt-1">One script tag. Works on any platform.</p>
      </div>

      <div className="card max-w-2xl">
        <h2 className="font-medium mb-4">Your embed snippet</h2>
        <div className="bg-stone-900 rounded-xl p-4 mb-4">
          <code className="text-green-400 text-sm break-all font-mono">{snippet}</code>
        </div>
        <button onClick={copy} className="btn-primary mb-6">
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>

        <div className="border-t border-stone-100 pt-6 space-y-4">
          <h3 className="text-sm font-medium">Installation instructions</h3>
          {[
            { platform: "Shopify", instruction: "Go to Online Store → Themes → Edit code → Open theme.liquid → Paste before </body>" },
            { platform: "WooCommerce", instruction: "Appearance → Theme editor → footer.php → Paste before </body>" },
            { platform: "Squarespace", instruction: "Settings → Advanced → Code Injection → Footer → Paste there" },
            { platform: "Wix", instruction: "Settings → Custom Code → Add code → Body — end → Paste there" },
            { platform: "Any custom site", instruction: "Paste the script tag before the closing </body> tag in your HTML" },
          ].map((item) => (
            <div key={item.platform} className="flex gap-3 text-sm">
              <span className="font-medium text-stone-700 w-28 shrink-0">{item.platform}</span>
              <span className="text-stone-500">{item.instruction}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
