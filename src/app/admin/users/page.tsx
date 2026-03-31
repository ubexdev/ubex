"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  MagnifyingGlass,
  CircleNotch,
  Users as UsersIcon,
  CaretLeft,
  CaretRight,
  ShieldCheck,
  User,
  Funnel,
  Prohibit,
  ArrowCounterClockwise,
  PencilSimple,
} from "@phosphor-icons/react";

/* ─── Types ─── */

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "player" | "creator" | "admin";
  total_score: number;
  sagas_completed: number;
  banned_at: string | null;
  created_at: string;
};

type RoleFilter = "all" | "player" | "creator" | "admin";

/* ─── Constants ─── */

const PAGE_SIZE = 20;

const ROLE_LABELS: Record<string, string> = {
  player: "Jugador",
  creator: "Creador",
  admin: "Admin",
};

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Todos los roles" },
  { value: "player", label: "Jugadores" },
  { value: "creator", label: "Creadores" },
  { value: "admin", label: "Admins" },
];

/* ─── Helpers ─── */

function getRoleBadgeStyles(role: string) {
  switch (role) {
    case "admin":
      return "bg-amber-600/10 text-amber-300";
    case "creator":
      return "bg-emerald-600/10 text-emerald-300";
    default:
      return "bg-zinc-800 text-zinc-400";
  }
}

function getRoleIcon(role: string) {
  switch (role) {
    case "admin":
      return ShieldCheck;
    case "creator":
      return PencilSimple;
    default:
      return User;
  }
}

/* ─── Page ─── */

export default function UsersPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when role filter changes
  useEffect(() => {
    setPage(0);
  }, [roleFilter]);

  const loadUsers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim();
        query = query.or(
          `display_name.ilike.%${q}%,username.ilike.%${q}%`
        );
      }

      if (roleFilter !== "all") {
        query = query.eq("role", roleFilter);
      }

      const { data, count, error: err } = await query;

      if (err) {
        setError(err.message);
      } else {
        setProfiles((data as Profile[]) ?? []);
        setTotal(count ?? 0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando usuarios");
    }
    setLoading(false);
  }, [supabase, page, debouncedSearch, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Usuarios</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestiona los perfiles y roles de la plataforma
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <Funnel
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-8 py-2.5 text-sm text-zinc-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors cursor-pointer"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-red-300">{error}</span>
          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-300 hover:bg-red-900 transition-colors"
          >
            <ArrowCounterClockwise size={14} />
            Reintentar
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <CircleNotch size={32} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && profiles.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <UsersIcon
            size={40}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-3 text-zinc-500 text-sm">
            No se encontraron usuarios
          </p>
          {(debouncedSearch || roleFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <ArrowCounterClockwise size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && profiles.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-zinc-900">
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Puntuación
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Sagas
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Registro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {profiles.map((profile) => {
                  const Icon = getRoleIcon(profile.role);
                  const isBanned = !!profile.banned_at;

                  return (
                    <tr
                      key={profile.id}
                      onClick={() =>
                        router.push(`/admin/users/${profile.id}`)
                      }
                      className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                              <User size={16} className="text-zinc-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-zinc-200">
                              {profile.display_name || "Sin nombre"}
                            </p>
                            {profile.username && (
                              <p className="text-xs text-zinc-500">
                                @{profile.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyles(profile.role)}`}
                        >
                          <Icon size={12} weight="bold" />
                          {ROLE_LABELS[profile.role] || profile.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                        {(profile.total_score ?? 0).toLocaleString("es-ES")}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                        {profile.sagas_completed ?? 0}
                      </td>
                      <td className="px-5 py-3">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-600/10 text-red-400">
                            <Prohibit size={12} weight="bold" />
                            Baneado
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-600">Activo</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-500 whitespace-nowrap">
                        {new Date(profile.created_at).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                {total} usuario{total !== 1 ? "s" : ""} en total
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-11 w-11 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretLeft size={18} />
                </button>
                <span className="text-xs text-zinc-400 px-2 tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="h-11 w-11 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
