"use client";

import { useState } from "react";
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
  url: string;
}

export function ProductsClient({ products: initial }: { products: RawProduct[] }) {
  const [products, setProducts] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFamilies, setEditFamilies] = useState<ScentFamily[]>([]);
  const [editIntensity, setEditIntensity] = useState<Intensity>("Medium");
  const [editMoods, setEditMoods] = useState<Mood[]>([]);
  const [saving, setSaving] = useState(false);

  function startEdit(p: RawProduct) {
    setEditId(p.id);
    setEditFamilies(JSON.parse(p.scentFamilies));
    setEditIntensity(p.intensity as Intensity);
    setEditMoods(JSON.parse(p.moods));
  }

  async function saveEdit(id: string) {
    setSaving(true);
    await fetch("/api/products/tag", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: [id],
        scentFamilies: editFamilies,
        intensity: editIntensity,
        moods: editMoods,
      }),
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              scentFamilies: JSON.stringify(editFamilies),
              intensity: editIntensity,
              moods: JSON.stringify(editMoods),
            }
          : p
      )
    );
    setSaving(false);
    setEditId(null);
  }

  if (products.length === 0) {
    return (
      <div className="card text-center py-16 text-stone-400">
        No products yet.{" "}
        <a href="/onboarding" className="underline text-stone-600">
          Import some to get started.
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((p) => {
        const families = JSON.parse(p.scentFamilies) as ScentFamily[];
        const moods = JSON.parse(p.moods) as Mood[];
        const isEditing = editId === p.id;

        return (
          <div key={p.id} className="card">
            <div className="flex gap-4 items-start">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {p.intensity} · {families.join(", ") || "untagged"} · {moods.join(", ") || "no moods"}
                    </div>
                  </div>
                  <button
                    onClick={() => (isEditing ? setEditId(null) : startEdit(p))}
                    className="text-xs text-stone-500 hover:text-stone-900 underline shrink-0"
                  >
                    {isEditing ? "Cancel" : "Edit tags"}
                  </button>
                </div>

                {isEditing && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-stone-100">
                    <div>
                      <label className="label">Scent families</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SCENT_FAMILIES.map((f) => (
                          <button
                            key={f}
                            onClick={() =>
                              setEditFamilies((prev) =>
                                prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
                              )
                            }
                            className={`text-xs px-2.5 py-1 rounded-full border transition ${
                              editFamilies.includes(f)
                                ? "border-stone-900 bg-stone-900 text-white"
                                : "border-stone-200 text-stone-600"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Intensity</label>
                      <div className="flex gap-1.5">
                        {INTENSITIES.map((int) => (
                          <button
                            key={int}
                            onClick={() => setEditIntensity(int)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                              editIntensity === int
                                ? "border-stone-900 bg-stone-900 text-white"
                                : "border-stone-200 text-stone-600"
                            }`}
                          >
                            {int}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Mood</label>
                      <div className="flex flex-wrap gap-1.5">
                        {MOODS.map((m) => (
                          <button
                            key={m}
                            onClick={() =>
                              setEditMoods((prev) =>
                                prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
                              )
                            }
                            className={`text-xs px-2.5 py-1 rounded-full border transition ${
                              editMoods.includes(m)
                                ? "border-stone-900 bg-stone-900 text-white"
                                : "border-stone-200 text-stone-600"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => saveEdit(p.id)} className="btn-primary text-xs" disabled={saving}>
                      {saving ? "Saving..." : "Save tags"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
