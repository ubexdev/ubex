"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  MagnifyingGlass,
  CircleNotch,
  Users as UsersIcon,
  CaretLeft,
  CaretRight,
  X,
  ShieldCheck,
  User,
} from "@phosphor-icons/react";

type Profile = {
  id: string;
  display_name: string | null;
  role: "player" | "admin";
  total_score: number;
  sagas_completed: number;
  created_at: string;
};

const PAGE_SIZE = 20;

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [selected, setSelected] = useState<Profile | null>(null);
  const [togglingRole, setTogglingRole] = useState(false);

  const supabase = getSupabaseBrowser();

  const loadUsers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("profiles")
      .select("id, display_name, role, total_score, sagas_completed, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search.trim()) {
      query = query.ilike("display_name", `%${search.trim()}%`);
    }

    const { data, count, error: err } = await query;

    if (err) {
      setError(err.message);
    } else {
      setProfiles(data ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [supabase, page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page on search
  useEffect(() => {
    setPage(0);
  }, [search]);

  async function toggleRole(profile: Profile) {
    if (!supabase) return;
    setTogglingRole(true);
    const newRole = profile.role === "admin" ? "player" : "admin";

    const { error: err } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (!err) {
      setSelected({ ...profile, role: newRole });
      setProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? { ...p, role: newRole } : p))
      );
    }
    setTogglingRole(false);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Usuarios</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestiona los perfiles de la plataforma
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
        />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
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
          <UsersIcon size={40} weight="duotone" className="mx-auto text-zinc-700" />
          <p className="mt-3 text-zinc-500 text-sm">No se encontraron usuarios</p>
        </div>
      )}

      {/* Table */}
      {!loading && profiles.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Nombre
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
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Registro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    onClick={() => setSelected(profile)}
                    className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-zinc-200">
                      {profile.display_name || "Sin nombre"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile.role === "admin"
                            ? "bg-amber-600/10 text-amber-300"
                            : "bg-zinc-400/10 text-zinc-400"
                        }`}
                      >
                        {profile.role === "admin" ? (
                          <ShieldCheck size={12} weight="bold" />
                        ) : (
                          <User size={12} />
                        )}
                        {profile.role === "admin" ? "Admin" : "Jugador"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                      {profile.total_score.toLocaleString("es-ES")}
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                      {profile.sagas_completed}
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-500">
                      {new Date(profile.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
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
                  className="p-1.5 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                >
                  <CaretLeft size={16} />
                </button>
                <span className="text-xs text-zinc-400 px-2 tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                >
                  <CaretRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/70"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">
                {selected.display_name || "Sin nombre"}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-sm text-zinc-500">Rol</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    selected.role === "admin"
                      ? "bg-amber-600/10 text-amber-300"
                      : "bg-zinc-400/10 text-zinc-400"
                  }`}
                >
                  {selected.role === "admin" ? "Admin" : "Jugador"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-sm text-zinc-500">Puntuación total</span>
                <span className="text-sm text-zinc-200 tabular-nums">
                  {selected.total_score.toLocaleString("es-ES")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-sm text-zinc-500">Sagas completadas</span>
                <span className="text-sm text-zinc-200 tabular-nums">
                  {selected.sagas_completed}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-500">Registrado</span>
                <span className="text-sm text-zinc-200">
                  {new Date(selected.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleRole(selected)}
              disabled={togglingRole}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {togglingRole ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : selected.role === "admin" ? (
                <User size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              {togglingRole
                ? "Cambiando..."
                : selected.role === "admin"
                  ? "Cambiar a Jugador"
                  : "Cambiar a Admin"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
