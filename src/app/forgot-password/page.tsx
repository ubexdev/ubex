"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Compass, Envelope, CircleNotch, CheckCircle, ArrowLeft } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useLocale } from "@/i18n";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }
    } catch {
      setError(t("auth.connectionError"));
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
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
            {t("auth.emailSent")}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 28 }}>
            {t("auth.resetEmailMessage", { email })}
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
            {t("auth.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

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
          padding: 36,
        }}
      >
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#a1a1aa",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} weight="bold" />
          {t("common.back")}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
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
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#fafafa", marginBottom: 2 }}>
              {t("auth.forgotPasswordTitle")}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              {t("auth.forgotPasswordSubtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              <Envelope size={20} weight="bold" />
            )}
            {loading ? t("auth.sending") : t("auth.sendLink")}
          </button>
        </form>
      </div>
    </div>
  );
}
