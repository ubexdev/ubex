"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Trophy,
  SignOut,
  Compass,
  PencilSimple,
  CircleNotch,
  CheckCircle,
  MapTrifold,
} from "@phosphor-icons/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    setSaving(true);
    await supabase
      .from("profiles")
      .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);

    await refreshProfile();
    setSaving(false);
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <CircleNotch size={32} weight="bold" color="#d97706" className="compass-rotate" />
      </div>
    );
  }

  const name =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Usuario";

  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statCards = [
    {
      icon: <Trophy size={22} weight="fill" color="#fbbf24" />,
      label: "Puntuacion Total",
      value: profile?.total_score?.toLocaleString() ?? "0",
    },
    {
      icon: <MapTrifold size={22} weight="fill" color="#fbbf24" />,
      label: "Sagas Completadas",
      value: profile?.sagas_completed?.toString() ?? "0",
    },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#09090b" }}>
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Compass size={16} weight="bold" color="#18181b" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#e4e4e7" }}>UBEX</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="btn-press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#a1a1aa",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <SignOut size={18} weight="regular" />
          Cerrar Sesion
        </button>
      </header>

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Profile header */}
        <div
          className="fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#18181b",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>
              {name}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
            {profile?.role === "admin" && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#d97706",
                  background: "rgba(217,119,6,0.1)",
                  border: "1px solid rgba(217,119,6,0.2)",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Save success toast */}
        {saveSuccess && (
          <div
            className="fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              marginBottom: 20,
              fontSize: 14,
              color: "#4ade80",
            }}
          >
            <CheckCircle size={18} weight="fill" />
            Perfil actualizado correctamente.
          </div>
        )}

        {/* Edit name section */}
        <div
          className="fade-in-d1"
          style={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <User size={20} weight="regular" color="#a1a1aa" />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#e4e4e7" }}>
                Informacion Personal
              </span>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#a1a1aa",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <PencilSimple size={14} weight="regular" />
                Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label
                  htmlFor="editName"
                  style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 6 }}
                >
                  Nombre
                </label>
                <input
                  id="editName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fafafa",
                    fontSize: 15,
                    outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-press"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 8,
                    background: "#d97706",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving && <CircleNotch size={16} weight="bold" className="compass-rotate" />}
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(profile?.display_name ?? "");
                  }}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#a1a1aa",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Nombre</span>
                <span style={{ fontSize: 14, color: "#e4e4e7" }}>{name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Email</span>
                <span style={{ fontSize: 14, color: "#e4e4e7" }}>{user.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Rol</span>
                <span style={{ fontSize: 14, color: "#e4e4e7", textTransform: "capitalize" }}>
                  {profile?.role ?? "player"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          className="fade-in-d2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#18181b",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 22,
              }}
            >
              <div style={{ marginBottom: 12 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#fafafa",
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "var(--font-mono), monospace",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div
          className="fade-in-d3"
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Link
            href="/play"
            className="btn-press"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "13px 20px",
              borderRadius: 10,
              background: "#d97706",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Compass size={20} weight="bold" />
            Explorar
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="btn-press"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 20px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e4e4e7",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Panel Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
