"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  MapTrifold,
  Users,
  GameController,
  List,
  X,
  SignOut,
  Compass,
  ArrowLeft,
} from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/sagas", label: "Sagas", icon: MapTrifold },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/sessions", label: "Sesiones", icon: GameController },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowser();
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-16 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <Compass size={26} weight="duotone" className="text-amber-600" />
          <span className="font-bold text-zinc-100 text-sm tracking-tight">
            UBEX Admin
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-zinc-950/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-zinc-900 border-r border-zinc-800
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 border-b border-zinc-800"
          style={{ height: 72, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        >
          <Compass size={30} weight="duotone" className="text-amber-600" />
          <span className="font-bold text-lg text-zinc-100 tracking-tight">
            UBEX Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "border-l-2 border-l-amber-600 bg-amber-600/10 text-amber-500"
                      : "border-l-2 border-l-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  }
                `}
                style={{ minHeight: 44 }}
              >
                <Icon
                  size={20}
                  weight={active ? "duotone" : "regular"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-zinc-800 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            style={{ minHeight: 44 }}
          >
            <ArrowLeft size={20} />
            Volver al sitio
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
            style={{ minHeight: 44 }}
          >
            <SignOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
