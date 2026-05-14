"use client";

import { useState } from "react";

interface Props {
  onComplete: () => void;
}

export function StepConnect({ onComplete }: Props) {
  const [method, setMethod] = useState<"shopify" | "csv">("shopify");
  const [storeUrl, setStoreUrl] = useState("");
  const [token, setToken] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ imported: number } | null>(null);

  async function handleShopify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/import/shopify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeUrl, storefrontToken: token }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Import failed"); return; }
    setResult(data);
    setTimeout(onComplete, 1200);
  }

  async function handleCSV(e: React.FormEvent) {
    e.preventDefault();
    if (!csvFile) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", csvFile);
    const res = await fetch("/api/import/csv", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Import failed"); return; }
    setResult(data);
    setTimeout(onComplete, 1200);
  }

  if (result) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-3">✓</div>
        <div className="font-medium">{result.imported} products imported</div>
        <div className="text-stone-500 text-sm mt-1">Moving to tagging...</div>
      </div>
    );
  }

  return (
    <div className="card max-w-xl">
      <h2 className="font-semibold mb-1">Connect your store</h2>
      <p className="text-stone-500 text-sm mb-6">Import your products so we can help match shoppers.</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMethod("shopify")}
          className={`px-4 py-2 rounded-lg text-sm border transition ${method === "shopify" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
        >
          Connect Shopify
        </button>
        <button
          onClick={() => setMethod("csv")}
          className={`px-4 py-2 rounded-lg text-sm border transition ${method === "csv" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
        >
          Upload CSV
        </button>
      </div>

      {method === "shopify" && (
        <form onSubmit={handleShopify} className="space-y-4">
          <div>
            <label className="label">Shopify store URL</label>
            <input
              type="text"
              className="input"
              placeholder="yourstore.myshopify.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Storefront API token</label>
            <input
              type="text"
              className="input"
              placeholder="shpat_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <p className="text-xs text-stone-400 mt-1">
              Create a Storefront API token in Shopify Admin → Apps → Develop apps.
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Importing..." : "Import products"}
          </button>
        </form>
      )}

      {method === "csv" && (
        <form onSubmit={handleCSV} className="space-y-4">
          <div>
            <label className="label">CSV file</label>
            <p className="text-xs text-stone-400 mb-2">
              Columns: <code className="bg-stone-100 px-1 rounded">name, url, description, imageUrl</code>
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              required
              className="text-sm text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-100 file:text-stone-700 file:text-sm hover:file:bg-stone-200"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading || !csvFile}>
            {loading ? "Importing..." : "Upload & import"}
          </button>
        </form>
      )}
    </div>
  );
}
