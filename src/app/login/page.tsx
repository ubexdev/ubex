"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { SignIn, Compass, CircleNotch } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useLocale } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError(t("auth.serviceUnavailable"));
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setLoading(false);
        if (authError.message === "Invalid login credentials") {
          setError(t("auth.invalidCredentials"));
        } else if (authError.message === "Email not confirmed") {
          setError(t("auth.emailNotConfirmed"));
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        // Hard navigation so the server/middleware picks up the new cookie
        if (profile?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/play";
        }
        return;
      }
    } catch (err) {
      console.error("signIn error:", err);
      setError(t("auth.connectionError"));
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        background: "#09090b",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <LanguageSwitcher />
      </div>
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
            {t("auth.welcomeBack")}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            {t("auth.welcomeBackDesc")}
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
              {t("auth.loginTitle")}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#a1a1aa", marginBottom: 6 }}
              >
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fafafa",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#d97706")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label
                  htmlFor="password"
                  style={{ fontSize: 13, fontWeight: 500, color: "#a1a1aa" }}
                >
                  {t("auth.password")}
                </label>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: 12, color: "#d97706", textDecoration: "none" }}
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fafafa",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
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
                <SignIn size={20} weight="bold" />
              )}
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              {t("auth.noAccount")}{" "}
            </span>
            <Link
              href="/register"
              style={{ fontSize: 14, color: "#d97706", fontWeight: 600, textDecoration: "none" }}
            >
              {t("auth.registerButton")}
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive: collapse grid on small screens */}
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
