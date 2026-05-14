"use client";

import { useEffect, useState } from "react";
import type { ScentFamily, Intensity, Mood } from "@/lib/core";

const SCENT_FAMILIES: ScentFamily[] = [
  "Citrus", "Woody", "Floral", "Fresh", "Sweet", "Earthy", "Spicy", "Vanilla", "Lavender", "Cedar", "Ocean", "Spice",
];
const INTENSITIES: Intensity[] = ["Light", "Medium", "Strong"];
const MOODS: Mood[] = ["Relaxing", "Energising", "Romantic", "Focus", "Gifting"];

interface RawProduct {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  scentFamilies: string;
  intensity: string;
  moods: string;
}

interface Props {
  onComplete: () => void;
}

export function StepTag({ onComplete }: Props) {
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scentFamilies, setScentFamilies] = useState<ScentFamily[]>([]);
  const [intensity, setIntensity] = useState<Intensity>("Medium");
  const [moods, setMoods] = useState<Mood[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFamily(f: ScentFamily) {
    setScentFamilies((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function toggleMood(m: Mood) {
    setMoods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function applyTags() {
    if (!selected.size) return;
    setSaving(true);
    const res = await fetch("/api/products/tag", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: Array.from(selected),
        scentFamilies,
        intensity,
        moods,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setSaved(data.updated);
      // Refresh product list
      const updated = await fetch("/api/products").then((r) => r.json());
      setProducts(updated);
      setSelected(new Set());
    }
  }

  const suggestedFamilies = (() => {
    if (!selected.size) return [];
    const descs = products
      .filter((p) => selected.has(p.id))
      .map((p) => JSON.parse(p.scentFamilies) as ScentFamily[])
      .flat();
    return Array.from(new Set(descs));
  })();

  return (
    <div className="max-w-4xl">
      <div className="card mb-4">
        <h2 className="font-semibold mb-1">Tag your products</h2>
        <p className="text-stone-500 text-sm">
          Select products and apply scent tags so the quiz can match shoppers accurately.
          {saved > 0 && <span className="ml-2 text-green-600 font-medium">{saved} products saved.</span>}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Product grid */}
        <div className="card">
          <div className="text-xs text-stone-400 mb-3">
            {selected.size > 0 ? `${selected.size} selected` : "Select products to tag"}
          </div>
          {products.length === 0 ? (
            <div className="text-stone-400 text-sm py-8 text-center">No products yet. Go back and import some.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
              {products.map((p) => {
                const families = JSON.parse(p.scentFamilies) as ScentFamily[];
                const active = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`text-left p-3 rounded-xl border transition ${
                      active ? "border-stone-900 bg-stone-50" : "border-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2 bg-stone-100" />
                    )}
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {families.length > 0 ? families.join(", ") : "untagged"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tag panel */}
        <div className="card self-start sticky top-8">
          <div className="text-sm font-medium mb-4">Apply tags</div>

          {suggestedFamilies.length > 0 && (
            <div className="mb-3 p-2 bg-amber-50 rounded-lg">
              <div className="text-xs text-amber-600 mb-1">Auto-detected from descriptions:</div>
              <div className="flex flex-wrap gap-1">
                {suggestedFamilies.map((f) => (
                  <span key={f} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="label">Scent families</label>
            <div className="flex flex-wrap gap-1.5">
              {SCENT_FAMILIES.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFamily(f)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition ${
                    scentFamilies.includes(f)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Intensity</label>
            <div className="flex gap-1.5">
              {INTENSITIES.map((int) => (
                <button
                  key={int}
                  onClick={() => setIntensity(int)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition ${
                    intensity === int
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {int}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="label">Mood</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMood(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition ${
                    moods.includes(m)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={applyTags}
            className="btn-primary w-full mb-2"
            disabled={!selected.size || saving}
          >
            {saving ? "Saving..." : `Apply to ${selected.size || 0} product${selected.size !== 1 ? "s" : ""}`}
          </button>
          <button onClick={onComplete} className="btn-secondary w-full text-sm">
            Continue to embed code
          </button>
        </div>
      </div>
    </div>
  );
}
