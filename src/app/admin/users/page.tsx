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
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
          Usuarios
        </h1>
        <p className="text-base text-zinc-500 mt-2">
          Gestiona los perfiles y roles de la plataforma
        </p>
        {!loading && (
          <p className="text-sm text-zinc-600 mt-1">
            {total} usuario{total !== 1 ? "s" : ""} registrado
            {total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-12 pr-5 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <Funnel
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="appearance-none rounded-xl border border-zinc-800 bg-zinc-900 pl-11 pr-10 py-3 text-sm text-zinc-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors cursor-pointer"
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
        <div className="rounded-xl border border-red-900 bg-red-950 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-red-300">{error}</span>
          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900 transition-colors"
            style={{ minHeight: "44px" }}
          >
            <ArrowCounterClockwise size={16} />
            Reintentar
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-28">
          <CircleNotch size={36} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && profiles.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-24 text-center">
          <UsersIcon
            size={52}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-4 text-zinc-500 text-base">
            No se encontraron usuarios
          </p>
          {(debouncedSearch || roleFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              style={{ minHeight: "44px" }}
            >
              <ArrowCounterClockwise size={16} />
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && profiles.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Puntuación
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Sagas
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                              <User size={20} className="text-zinc-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-base font-medium text-zinc-200 truncate">
                              {profile.display_name || "Sin nombre"}
                            </p>
                            {profile.username && (
                              <p className="text-sm text-zinc-500 truncate">
                                @{profile.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeStyles(profile.role)}`}
                        >
                          <Icon size={14} weight="bold" />
                          {ROLE_LABELS[profile.role] || profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums">
                        <span className="text-base font-semibold text-zinc-200">
                          {(profile.total_score ?? 0).toLocaleString("es-ES")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-base text-zinc-300 tabular-nums">
                        {profile.sagas_completed ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-600/10 text-red-400">
                            <Prohibit size={14} weight="bold" />
                            Baneado
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-600">Activo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-zinc-500 whitespace-nowrap">
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
              <span className="text-sm text-zinc-500">
                {total} usuario{total !== 1 ? "s" : ""} en total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretLeft size={20} />
                </button>
                <span className="text-sm font-medium text-zinc-400 px-3 tabular-nums">
                  {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="h-11 w-11 inline-flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
