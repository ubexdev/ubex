"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { UserPlus, Compass, CircleNotch, CheckCircle } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (displayName.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres.";
    }
    if (password.length < 8) {
      return "La contrasena debe tener al menos 8 caracteres.";
    }
    if (password !== confirmPassword) {
      return "Las contrasenas no coinciden.";
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("El servicio de autenticacion no esta disponible.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: displayName.trim() },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este email ya esta registrado. Intenta iniciar sesion.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Error de conexion. Verifica tu internet e intenta de nuevo.");
      console.error("signUp error:", err);
      setLoading(false);
      return;
    }

    setLoading(false);

    setSuccess(true);
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          padding: 24,
        }}
      >
        <div
          className="fade-in"
          style={{
            maxWidth: 440,
            width: "100%",
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={28} weight="fill" color="#22c55e" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fafafa", marginBottom: 10 }}>
            Cuenta creada
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 28 }}>
            Revisa tu email para confirmar tu cuenta. Puede tardar unos minutos en llegar.
          </p>
          <Link
            href="/login"
            className="btn-press"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 10,
              background: "#d97706",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Ir a Iniciar Sesion
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fafafa",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: 13,
    fontWeight: 500,
    color: "#a1a1aa",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        background: "#09090b",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 24px",
          gap: 64,
        }}
      >
        {/* Left: Branding */}
        <div
          className="fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 40 }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg, #fbbf24, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Compass size={20} weight="bold" color="#18181b" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#e4e4e7" }}>
              UBEX
            </span>
          </Link>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#fafafa",
              marginBottom: 16,
            }}
          >
            Unete a la
            <br />
            expedicion
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Crea tu cuenta y comienza a explorar calles reales, resolver acertijos y reclamar tesoros.
          </p>
        </div>

        {/* Right: Form */}
        <div
          className="fade-in-d1"
          style={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 36,
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fafafa", marginBottom: 6 }}>
              Crear Cuenta
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              Completa los datos para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label htmlFor="displayName" style={labelStyle}>
                Nombre
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre de explorador"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimo 8 caracteres"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Confirmar Contrasena
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contrasena"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: 13,
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: 10,
                background: loading ? "#92400e" : "#d97706",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s ease, background 0.2s ease",
              }}
            >
              {loading ? (
                <CircleNotch size={20} weight="bold" className="compass-rotate" />
              ) : (
                <UserPlus size={20} weight="bold" />
              )}
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              Ya tienes cuenta?{" "}
            </span>
            <Link
              href="/login"
              style={{ fontSize: 14, color: "#d97706", fontWeight: 600, textDecoration: "none" }}
            >
              Iniciar Sesion
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
