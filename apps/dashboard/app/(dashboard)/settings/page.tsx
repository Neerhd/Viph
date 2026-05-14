"use client";

import { useEffect, useState } from "react";

type Settings = {
  accentColor: string;
  widgetPosition: string;
  buttonText: string;
  storeUrl: string | null;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    accentColor: "#c8956c",
    widgetPosition: "bottom-right",
    buttonText: "Not sure if this scent is for you?",
    storeUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setSettings(data);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-stone-500 text-sm mt-1">Customise how the widget appears on your store.</p>
      </div>

      <form onSubmit={save} className="card max-w-lg space-y-6">
        <div>
          <label className="label">Button text</label>
          <input
            type="text"
            className="input"
            value={settings.buttonText}
            onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer"
            />
            <input
              type="text"
              className="input"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              pattern="^#[0-9a-fA-F]{6}$"
            />
          </div>
          <p className="text-xs text-stone-400 mt-1">Used for the quiz button and CTA.</p>
        </div>

        <div>
          <label className="label">Widget position</label>
          <div className="flex gap-2">
            {[
              { value: "bottom-right", label: "Bottom right" },
              { value: "bottom-left", label: "Bottom left" },
              { value: "inline", label: "Inline" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSettings({ ...settings, widgetPosition: opt.value })}
                className={`flex-1 py-2 text-sm rounded-lg border transition ${
                  settings.widgetPosition === opt.value
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Store URL</label>
          <input
            type="text"
            className="input"
            value={settings.storeUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, storeUrl: e.target.value })}
            placeholder="yourstore.com"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </button>
          {saved && <span className="text-green-600 text-sm">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
