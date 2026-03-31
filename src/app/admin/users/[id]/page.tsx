"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  ArrowLeft,
  CircleNotch,
  ShieldCheck,
  User,
  PencilSimple,
  Prohibit,
  Trophy,
  GameController,
  MapTrifold,
  X,
  ArrowCounterClockwise,
  CheckCircle,
  Clock,
  XCircle,
  CalendarBlank,
  Warning,
} from "@phosphor-icons/react";

/* ─── Types ─── */

type ProfileDetail = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "player" | "creator" | "admin";
  total_score: number;
  sagas_completed: number;
  banned_at: string | null;
  created_at: string;
  updated_at: string;
};

type GameSession = {
  id: string;
  saga_id: string;
  current_level: number;
  score: number;
  difficulty: "libre" | "explorador";
  status: "active" | "completed" | "abandoned";
  started_at: string;
  completed_at: string | null;
  sagas: { title: string; city: string } | null;
};

type ConfirmDialog = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive: boolean;
  onConfirm: () => void;
} | null;

/* ─── Constants ─── */

const ROLE_LABELS: Record<string, string> = {
  player: "Jugador",
  creator: "Creador",
  admin: "Admin",
};

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "player", label: "Jugador" },
  { value: "creator", label: "Creador" },
  { value: "admin", label: "Admin" },
];

const SESSION_STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; styles: string }
> = {
  active: {
    label: "Activa",
    icon: Clock,
    styles: "bg-amber-600/10 text-amber-300",
  },
  completed: {
    label: "Completada",
    icon: CheckCircle,
    styles: "bg-emerald-600/10 text-emerald-300",
  },
  abandoned: {
    label: "Abandonada",
    icon: XCircle,
    styles: "bg-red-600/10 text-red-400",
  },
};

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── Page ─── */

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = getSupabaseBrowser();
  const userId = params.id;

  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role editing
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [savingRole, setSavingRole] = useState(false);

  // Ban
  const [togglingBan, setTogglingBan] = useState(false);

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(null);

  const loadUser = useCallback(async () => {
    if (!supabase || !userId) return;
    setLoading(true);
    setError(null);

    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileErr) {
      setError(profileErr.message);
      setLoading(false);
      return;
    }

    const p = profileData as ProfileDetail;
    setProfile(p);
    setSelectedRole(p.role);

    const { data: sessionsData } = await supabase
      .from("game_sessions")
      .select("*, sagas(title, city)")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    setSessions((sessionsData as GameSession[]) ?? []);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /* ─── Actions ─── */

  async function handleRoleChange() {
    if (!supabase || !profile || selectedRole === profile.role) return;

    // Require confirmation for admin role changes
    if (selectedRole === "admin" || profile.role === "admin") {
      setConfirmDialog({
        title:
          selectedRole === "admin"
            ? "Promover a administrador"
            : "Revocar administrador",
        message:
          selectedRole === "admin"
            ? `¿Estás seguro de que deseas promover a "${profile.display_name || "este usuario"}" a administrador? Tendrá acceso completo al panel de control.`
            : `¿Estás seguro de que deseas cambiar el rol de "${profile.display_name || "este usuario"}" de Admin a ${ROLE_LABELS[selectedRole]}?`,
        confirmLabel: "Confirmar cambio",
        destructive: selectedRole !== "admin",
        onConfirm: () => executeRoleChange(selectedRole),
      });
      return;
    }

    await executeRoleChange(selectedRole);
  }

  async function executeRoleChange(newRole: string) {
    if (!supabase || !profile) return;
    setSavingRole(true);

    const { error: err } = await supabase
      .from("profiles")
      .update({
        role: newRole as ProfileDetail["role"],
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (err) {
      setError(err.message);
    } else {
      setProfile({ ...profile, role: newRole as ProfileDetail["role"] });
    }
    setSavingRole(false);
  }

  function handleBanClick() {
    if (!profile) return;
    const isBanned = !!profile.banned_at;

    setConfirmDialog({
      title: isBanned ? "Desbanear usuario" : "Banear usuario",
      message: isBanned
        ? `¿Deseas desbanear a "${profile.display_name || "este usuario"}"? Podrá volver a acceder a la plataforma.`
        : `¿Estás seguro de que deseas banear a "${profile.display_name || "este usuario"}"? No podrá acceder a la plataforma.`,
      confirmLabel: isBanned ? "Desbanear" : "Banear",
      destructive: !isBanned,
      onConfirm: () => executeBanToggle(),
    });
  }

  async function executeBanToggle() {
    if (!supabase || !profile) return;
    setTogglingBan(true);
    const isBanned = !!profile.banned_at;
    const newBannedAt = isBanned ? null : new Date().toISOString();

    const { error: err } = await supabase
      .from("profiles")
      .update({
        banned_at: newBannedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (err) {
      setError(err.message);
    } else {
      setProfile({ ...profile, banned_at: newBannedAt });
    }
    setTogglingBan(false);
  }

  /* ─── Render ─── */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <CircleNotch size={32} className="text-zinc-600 animate-spin" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </Link>
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-red-300">{error}</span>
          <button
            onClick={loadUser}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-300 hover:bg-red-900 transition-colors"
          >
            <ArrowCounterClockwise size={14} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </Link>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <Warning size={40} weight="duotone" className="mx-auto text-zinc-700" />
          <p className="mt-3 text-zinc-500 text-sm">Usuario no encontrado</p>
        </div>
      </div>
    );
  }

  const isBanned = !!profile.banned_at;
  const RoleIcon = getRoleIcon(profile.role);
  const roleChanged = selectedRole !== profile.role;
  const sessionCount = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const totalSessionScore = sessions.reduce((sum, s) => sum + s.score, 0);

  return (
    <div className="space-y-6">
      {/* Back + inline error */}
      <div className="space-y-3">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </Link>

        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-red-300">{error}</span>
            <button
              onClick={() => setError(null)}
              className="p-1 text-red-400 hover:text-red-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Profile header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <User size={28} className="text-zinc-600" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-100">
                {profile.display_name || "Sin nombre"}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyles(profile.role)}`}
              >
                <RoleIcon size={12} weight="bold" />
                {ROLE_LABELS[profile.role]}
              </span>
              {isBanned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-600/10 text-red-400">
                  <Prohibit size={12} weight="bold" />
                  Baneado
                </span>
              )}
            </div>
            {profile.username && (
              <p className="text-sm text-zinc-500 mt-0.5">
                @{profile.username}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <CalendarBlank size={12} />
                Registrado {formatDate(profile.created_at)}
              </span>
              {isBanned && profile.banned_at && (
                <span className="inline-flex items-center gap-1 text-red-400">
                  <Prohibit size={12} />
                  Baneado {formatDate(profile.banned_at)}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 mt-1 font-mono">
              {profile.id}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Trophy size={16} weight="duotone" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Puntuación total
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {profile.total_score.toLocaleString("es-ES")}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <MapTrifold size={16} weight="duotone" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Sagas completadas
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {profile.sagas_completed}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <GameController size={16} weight="duotone" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Sesiones jugadas
            </span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {sessionCount}
          </p>
          {sessionCount > 0 && (
            <p className="text-xs text-zinc-500 mt-1">
              {completedSessions} completada{completedSessions !== 1 ? "s" : ""}{" "}
              · {totalSessionScore.toLocaleString("es-ES")} pts acumulados
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">
          Acciones
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Role change */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="role-select"
              className="text-sm text-zinc-400 whitespace-nowrap"
            >
              Cambiar rol:
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors cursor-pointer"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleRoleChange}
              disabled={!roleChanged || savingRole}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-sm font-medium text-zinc-950 hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {savingRole && (
                <CircleNotch size={14} className="animate-spin" />
              )}
              Guardar
            </button>
          </div>

          {/* Spacer */}
          <div className="hidden sm:block flex-1" />

          {/* Ban / Unban */}
          <button
            onClick={handleBanClick}
            disabled={togglingBan}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isBanned
                ? "border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                : "border border-red-900 text-red-400 hover:bg-red-950"
            } disabled:opacity-50`}
          >
            {togglingBan ? (
              <CircleNotch size={16} className="animate-spin" />
            ) : (
              <Prohibit size={16} />
            )}
            {togglingBan
              ? "Procesando..."
              : isBanned
                ? "Desbanear usuario"
                : "Banear usuario"}
          </button>
        </div>
      </div>

      {/* Game sessions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
          Historial de sesiones
        </h2>

        {sessions.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
            <GameController
              size={36}
              weight="duotone"
              className="mx-auto text-zinc-700"
            />
            <p className="mt-3 text-zinc-500 text-sm">
              Este usuario no tiene sesiones de juego
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-900">
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Saga
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Puntuación
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Dificultad
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Inicio
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Fin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {sessions.map((session) => {
                    const statusCfg =
                      SESSION_STATUS_CONFIG[session.status] ??
                      SESSION_STATUS_CONFIG.active;
                    const StatusIcon = statusCfg.icon;

                    return (
                      <tr
                        key={session.id}
                        className="hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div>
                            <p className="font-medium text-zinc-200">
                              {session.sagas?.title ?? "Saga desconocida"}
                            </p>
                            {session.sagas?.city && (
                              <p className="text-xs text-zinc-500">
                                {session.sagas.city}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                          {session.current_level}
                        </td>
                        <td className="px-5 py-3 text-right text-zinc-300 tabular-nums">
                          {session.score.toLocaleString("es-ES")}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-zinc-400 capitalize">
                            {session.difficulty}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.styles}`}
                          >
                            <StatusIcon size={12} weight="bold" />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-zinc-500 whitespace-nowrap">
                          {formatShortDate(session.started_at)}
                        </td>
                        <td className="px-5 py-3 text-right text-zinc-500 whitespace-nowrap">
                          {session.completed_at
                            ? formatShortDate(session.completed_at)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/70"
            onClick={() => setConfirmDialog(null)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">
                {confirmDialog.title}
              </h3>
              <button
                onClick={() => setConfirmDialog(null)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-zinc-400">{confirmDialog.message}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  confirmDialog.destructive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-amber-600 text-zinc-950 hover:bg-amber-500"
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
