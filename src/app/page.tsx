"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  MapTrifold,
  Trophy,
  Users,
  Timer,
  ArrowRight,
  Lock,
  Lightning,
  Eye,
  Crosshair,
} from "@phosphor-icons/react";
import UserMenu from "@/components/auth/UserMenu";
import CountdownTimer from "@/components/game/CountdownTimer";
import LeaderboardWidget from "@/components/game/LeaderboardWidget";

export default function Home() {
  const sagaStart = useMemo(
    () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    []
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#09090b",
        color: "#e4e4e7",
      }}
    >
      {/* ── Ambient glow (subtle, desaturated) ── */}
      <div
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: 700,
            height: 700,
            background: "rgba(217,119,6,0.035)",
            borderRadius: "50%",
            filter: "blur(160px)",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          background: "rgba(9,9,11,0.85)",
        }}
      >
        <div
          className="section-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Compass size={24} weight="bold" color="#d97706" />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#fafafa",
              }}
            >
              UBEX
            </span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a
              href="#how-it-works"
              className="btn-press"
              style={{
                fontSize: 13,
                color: "#a1a1aa",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              Cómo funciona
            </a>
            <Link
              href="/leaderboard"
              className="btn-press"
              style={{
                fontSize: 13,
                color: "#a1a1aa",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Trophy size={14} weight="bold" color="#d97706" />
              Clasificación
            </Link>
            <Link
              href="/play"
              className="btn-press"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#09090b",
                background: "#d97706",
                padding: "7px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Jugar demo
            </Link>
            <div style={{ marginLeft: 6 }}>
              <UserMenu />
            </div>
          </nav>
        </div>
      </header>

      {/* ── Hero (Asymmetric, left-aligned) ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "80px 0 64px",
        }}
      >
        <div
          className="section-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left: Copy */}
          <div>
            <div
              className="fade-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(217,119,6,0.2)",
                background: "rgba(217,119,6,0.06)",
                marginBottom: 28,
              }}
            >
              <Crosshair size={14} weight="bold" color="#d97706" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#d97706",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Arqueología digital
              </span>
            </div>

            <h1
              className="fade-in-d1"
              style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: "#fafafa",
                marginBottom: 20,
              }}
            >
              Explora calles reales.
              <br />
              <span style={{ color: "#d97706" }}>Encuentra el tesoro.</span>
            </h1>

            <p
              className="fade-in-d2"
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "#71717a",
                maxWidth: "52ch",
                marginBottom: 36,
              }}
            >
              Navega Google Street View, resuelve acertijos históricos y compite
              contra miles de exploradores. El primero en completar los 12 niveles
              gana <span style={{ color: "#e4e4e7", fontWeight: 600 }}>$1,000 USD</span>.
            </p>

            <div
              className="fade-in-d3"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link
                href="/play"
                className="btn-press"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  fontSize: 14,
                  fontWeight: 700,
                  background: "#d97706",
                  color: "#09090b",
                  borderRadius: 10,
                  textDecoration: "none",
                }}
              >
                Jugar demo gratis
                <ArrowRight size={16} weight="bold" />
              </Link>
              <a
                href="#how-it-works"
                className="btn-press"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#a1a1aa",
                  borderRadius: 10,
                  textDecoration: "none",
                }}
              >
                Cómo funciona
              </a>
            </div>
          </div>

          {/* Right: Visual — Compass + decorative rings */}
          <div
            className="fade-in-d2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: 360,
            }}
          >
            {/* Outer ring */}
            <div
              className="compass-rotate"
              style={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                border: "1px solid rgba(217,119,6,0.1)",
              }}
            />
            {/* Middle ring */}
            <div
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
            {/* Inner glow */}
            <div
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "rgba(217,119,6,0.04)",
                filter: "blur(40px)",
              }}
            />
            {/* Compass icon */}
            <div className="float">
              <Compass size={80} weight="thin" color="#d97706" />
            </div>
            {/* Cardinal dots */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                style={{
                  position: "absolute",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: deg === 0 ? "#d97706" : "rgba(255,255,255,0.1)",
                  transform: `rotate(${deg}deg) translateY(-140px)`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="section-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            padding: "28px 24px",
          }}
        >
          {[
            { icon: Users, value: "5,000+", label: "Exploradores" },
            { icon: MapTrifold, value: "12", label: "Niveles" },
            { icon: Trophy, value: "$1,000", label: "Premio USD" },
            { icon: Compass, value: "∞", label: "Ciudades" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "0 16px",
                borderRight:
                  i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <stat.icon
                size={18}
                weight="regular"
                color="#52525b"
                style={{ margin: "0 auto 8px" }}
              />
              <div
                className="tabular-nums"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fafafa",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#52525b",
                  marginTop: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Countdown ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "56px 0",
          textAlign: "center",
        }}
      >
        <div className="section-narrow">
          <CountdownTimer
            targetDate={sagaStart}
            label="SAGA DE COLÓN — ZONA COLONIAL, SANTO DOMINGO"
          />
        </div>
      </section>

      {/* ── Leaderboard Widget ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 0 56px",
        }}
      >
        <div className="section-narrow">
          <LeaderboardWidget />
        </div>
      </section>

      {/* ── How it works (vertical steps, no card grid) ── */}
      <section
        id="how-it-works"
        style={{
          position: "relative",
          zIndex: 10,
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="section-inner">
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#d97706",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Mecánica del juego
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              marginBottom: 56,
            }}
          >
            Cuatro pasos al tesoro
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px 56px",
            }}
          >
            {[
              {
                Icon: Lock,
                num: "01",
                title: "Suscríbete",
                desc: "Elige tu plan, paga con PayPal y recibe tu membresía con credenciales por email.",
              },
              {
                Icon: Timer,
                num: "02",
                title: "Espera la señal",
                desc: "El temporizador global sincronizado marca cuándo se revelan las pistas. Todos arrancan al mismo tiempo.",
              },
              {
                Icon: Eye,
                num: "03",
                title: "Explora",
                desc: "Recorre calles reales en Google Street View. Encuentra el dato exacto que pide cada pista.",
              },
              {
                Icon: Trophy,
                num: "04",
                title: "Gana el tesoro",
                desc: "El primer explorador en completar los 12 niveles se lleva $1,000 USD. Solo uno gana.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="card-hover"
                style={{
                  display: "flex",
                  gap: 16,
                  padding: 24,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(217,119,6,0.08)",
                    border: "1px solid rgba(217,119,6,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <step.Icon size={20} weight="regular" color="#d97706" />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      className="tabular-nums"
                      style={{
                        fontSize: 11,
                        color: "#52525b",
                        fontWeight: 600,
                      }}
                    >
                      {step.num}
                    </span>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#fafafa",
                      }}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#71717a",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── First Mission (left-aligned) ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "80px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="section-inner">
          <div style={{ maxWidth: 600 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#d97706",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Primera misión
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fafafa",
                marginBottom: 16,
              }}
            >
              Zona Colonial, Santo Domingo
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#71717a",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              Elegida por su densidad histórica y detalles visuales únicos
              capturados por Street View. Una narrativa inmersiva que te desafía a
              encontrar datos exactos en edificios coloniales reales.
            </p>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 36,
              }}
            >
              {[
                { Icon: Lightning, text: "IA Gemini valida respuestas" },
                { Icon: MapTrifold, text: "Google Maps + Street View" },
                { Icon: Users, text: "5,000 exploradores simultáneos" },
                { Icon: Trophy, text: "$1,000 USD de premio" },
                { Icon: Crosshair, text: "Eliminación progresiva" },
              ].map((tag) => (
                <span
                  key={tag.text}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#71717a",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <tag.Icon size={14} weight="regular" color="#52525b" />
                  {tag.text}
                </span>
              ))}
            </div>

            <Link
              href="/play"
              className="btn-press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 700,
                background: "#d97706",
                color: "#09090b",
                borderRadius: 10,
                textDecoration: "none",
              }}
            >
              Jugar demo gratis
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 0",
        }}
      >
        <div
          className="section-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Compass size={18} weight="bold" color="#52525b" />
            <span
              style={{ fontSize: 13, fontWeight: 600, color: "#3f3f46" }}
            >
              UBEX
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#3f3f46" }}>
            © {new Date().getFullYear()} UBEX · Impulsada por Google Gemini
            &amp; Maps Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

