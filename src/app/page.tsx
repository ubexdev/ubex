"use client";

import { useMemo } from "react";
import Link from "next/link";
import CountdownTimer from "@/components/game/CountdownTimer";

export default function Home() {
  const sagaStart = useMemo(
    () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    []
  );

  return (
    <div style={{ background: "#000", color: "#ededed", minHeight: "100vh" }}>
      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} aria-hidden="true">
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, background: "rgba(245,158,11,0.06)", borderRadius: "50%", filter: "blur(150px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 600, height: 600, background: "rgba(217,119,6,0.04)", borderRadius: "50%", filter: "blur(120px)" }} />
      </div>

      {/* ── Header ── */}
      <header style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #fbbf24, #d97706)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontWeight: 800, fontSize: 14 }}>U</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>UBEX</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 12, marginLeft: 4 }}>
            Arqueología Digital
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="#how-it-works" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>¿Cómo funciona?</a>
          <a href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "8px 16px" }}>Ingresar</a>
          <a href="#" className="btn-glow" style={{ fontSize: 14, fontWeight: 600, background: "#f59e0b", color: "#000", padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>Registrarse</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Globe */}
        <div className="fade-in">
          <div className="globe-pulse" style={{ width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.2)", background: "linear-gradient(135deg, rgba(245,158,11,0.08), transparent, rgba(217,119,6,0.04))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 72, userSelect: "none" }}>🌍</span>
          </div>
        </div>

        <h1 className="fade-in-d1" style={{ fontSize: "clamp(48px, 10vw, 96px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.9, marginBottom: 24 }}>
          <span style={{ display: "block", color: "#fff" }}>EL MUNDO ES</span>
          <span className="text-shimmer" style={{ display: "block", marginTop: 4 }}>EL TABLERO</span>
        </h1>

        <p className="fade-in-d2" style={{ maxWidth: 520, fontSize: 17, color: "rgba(255,255,255,0.4)", marginBottom: 48, lineHeight: 1.7 }}>
          Explora calles reales en Google Street View. Resuelve acertijos de la historia. El primero en encontrar el tesoro gana{" "}
          <span style={{ color: "#fbbf24", fontWeight: 600 }}>$1,000 USD</span>.
        </p>

        {/* Countdown */}
        <div className="fade-in-d3" style={{ marginBottom: 48 }}>
          <CountdownTimer
            targetDate={sagaStart}
            label="SAGA DE COLÓN — ZONA COLONIAL, SANTO DOMINGO"
          />
        </div>

        {/* CTAs */}
        <div className="fade-in-d3" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/play" className="btn-glow" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", fontSize: 16, fontWeight: 700, background: "#f59e0b", color: "#000", borderRadius: 12, textDecoration: "none" }}>
            JUGAR DEMO GRATIS
            <span style={{ fontSize: 14 }}>→</span>
          </Link>
          <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", padding: "16px 32px", fontSize: 16, fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 12, textDecoration: "none" }}>
            ¿Cómo funciona?
          </a>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="section-inner" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, padding: "32px 24px" }}>
          {[
            { value: "5,000+", label: "Exploradores por saga" },
            { value: "12", label: "Niveles por saga" },
            { value: "$1,000", label: "Premio USD" },
            { value: "∞", label: "Ciudades del mundo" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center", padding: "0 16px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ position: "relative", zIndex: 10, padding: "96px 0" }}>
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "rgba(251,191,36,0.5)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500, marginBottom: 12 }}>
              Mecánica del juego
            </p>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              <span style={{ color: "#fff" }}>12 Niveles </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>de Historia</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { step: "01", icon: "🔐", title: "Suscríbete", desc: "Elige tu plan, paga con PayPal y recibe tu membresía con usuario y contraseña por email." },
              { step: "02", icon: "⏱️", title: "Espera la señal", desc: "El temporizador global sincronizado marca cuándo se revelan las pistas. Todos arrancan al mismo tiempo." },
              { step: "03", icon: "🗺️", title: "Explora", desc: "Recorre calles reales en Google Street View. Encuentra el dato exacto que pide cada pista." },
              { step: "04", icon: "🏆", title: "Gana el tesoro", desc: "El primer explorador en completar los 12 niveles se lleva $1,000 USD. Solo uno gana." },
            ].map((step) => (
              <div key={step.step} className="card-hover" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28, position: "relative", overflow: "hidden" }}>
                <span style={{ position: "absolute", top: 12, right: 16, fontSize: 64, fontWeight: 800, lineHeight: 1, color: "rgba(255,255,255,0.025)", userSelect: "none" }}>{step.step}</span>
                <span style={{ fontSize: 32, display: "block", marginBottom: 20 }}>{step.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── First Mission ── */}
      <section style={{ position: "relative", zIndex: 10, padding: "96px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="section-narrow" style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(251,191,36,0.5)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500, marginBottom: 12 }}>
            Primera misión
          </p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24 }}>
            <span style={{ color: "#fff" }}>Zona Colonial, </span>
            <span className="text-shimmer">Santo Domingo</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 17, maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Elegida por su densidad histórica y detalles visuales únicos capturados por Street View. Una narrativa inmersiva que te desafía a encontrar datos exactos en edificios coloniales reales.
          </p>

          {/* Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 48 }}>
            {[
              "🧠 IA Gemini valida respuestas",
              "🌎 Google Maps + Street View",
              "⚡ 5,000 exploradores simultáneos",
              "💰 $1,000 USD de premio",
              "🔥 Eliminación progresiva",
            ].map((pill) => (
              <span key={pill} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, background: "rgba(255,255,255,0.02)" }}>
                {pill}
              </span>
            ))}
          </div>

          <Link href="/play" className="btn-glow" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", fontSize: 16, fontWeight: 700, background: "#f59e0b", color: "#000", borderRadius: 12, textDecoration: "none" }}>
            JUGAR DEMO GRATIS <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 0" }}>
        <div className="section-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #fbbf24, #d97706)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontWeight: 800, fontSize: 10 }}>U</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>UBEX</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
            © {new Date().getFullYear()} UBEX — Arqueología Digital de Próxima Generación. Impulsada por Google Gemini &amp; Maps Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}

