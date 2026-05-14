"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/home", label: "Home", icon: "◈" },
  { href: "/products", label: "Products", icon: "◉" },
  { href: "/onboarding", label: "Setup", icon: "◎" },
  { href: "/embed", label: "Embed code", icon: "◻" },
  { href: "/settings", label: "Settings", icon: "◌" },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-stone-100 bg-white flex flex-col px-4 py-6">
      <div className="text-xl font-semibold tracking-tight mb-8 px-2">viph</div>
      <nav className="flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition"
      >
        <span>→</span> Sign out
      </button>
    </aside>
  );
}
