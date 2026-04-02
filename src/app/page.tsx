"use client";

import { useEffect, useMemo, useState } from "react";
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
  List,
  X,
} from "@phosphor-icons/react";
import { useLocale } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserMenu from "@/components/auth/UserMenu";
import CountdownTimer from "@/components/game/CountdownTimer";
import LeaderboardWidget from "@/components/game/LeaderboardWidget";
import { DEMO_SAGA } from "@/data/demo-saga";

interface LandingSaga {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  city: string;
  country: string;
  saga_type?: string;
  total_levels?: number;
  difficulty?: string;
  prize_amount_usd?: number;
  is_featured?: boolean;
}

export default function Home() {
  const sagaStart = useMemo(
    () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    []
  );

  const { t } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [sagas, setSagas] = useState<LandingSaga[]>([]);
  const [loadingSagas, setLoadingSagas] = useState(true);

  useEffect(() => {
    fetch("/api/game/sagas")
      .then((res) => res.json())
      .then((data) => {
        setSagas(Array.isArray(data) ? data : []);
        setLoadingSagas(false);
      })
      .catch(() => setLoadingSagas(false));
  }, []);

  const demoSagaCard: LandingSaga = {
    id: "demo",
    title: DEMO_SAGA.title,
    subtitle: DEMO_SAGA.subtitle,
    description: DEMO_SAGA.description,
    city: DEMO_SAGA.city,
    country: DEMO_SAGA.country,
    saga_type: "demo",
    total_levels: 12,
    difficulty: "medium",
    prize_amount_usd: DEMO_SAGA.prizeAmountUSD,
  };

  const allSagas = [demoSagaCard, ...sagas.filter((s) => s.id !== "saga-colon-2026")];

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
          <nav className="nav-desktop">
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
              {t("landing.nav.howItWorks")}
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
              {t("landing.nav.leaderboard")}
            </Link>
            <a
              href="#misiones"
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
              {t("landing.startExploring")}
            </a>
            <LanguageSwitcher />
            <div style={{ marginLeft: 6 }}>
              <UserMenu />
            </div>
          </nav>
          <div className="mobile-header-actions">
            <UserMenu />
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t("landing.nav.closeMenu") : t("landing.nav.openMenu")}
            >
              {mobileMenuOpen ? (
                <X size={24} weight="bold" />
              ) : (
                <List size={24} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <a
            href="#how-it-works"
            className="mobile-menu-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Compass size={20} weight="regular" color="#d97706" />
            {t("landing.nav.howItWorks")}
          </a>
          <Link
            href="/leaderboard"
            className="mobile-menu-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Trophy size={20} weight="regular" color="#d97706" />
            {t("landing.nav.leaderboard")}
          </Link>
          <LanguageSwitcher />
          <div style={{ height: 8 }} />
          <a
            href="#misiones"
            className="mobile-menu-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("landing.startExploring")}
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      )}

      {/* ── Hero (Asymmetric, left-aligned) ── */}
      <section
        className="section-hero"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="section-inner hero-grid">
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
                {t("landing.digitalArchaeology")}
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
              {t("landing.heroTitleLine1")}
              <br />
              <span style={{ color: "#d97706" }}>{t("landing.heroTitleLine2")}</span>
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
              {t("landing.heroDescPrefix")}{" "}
              <span style={{ color: "#e4e4e7", fontWeight: 600 }}>$1,000 USD</span>.
            </p>

            <div
              className="fade-in-d3"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link
                href="/play?saga=demo"
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
                {t("landing.exploreNow")}
                <ArrowRight size={16} weight="bold" />
              </Link>
              <a
                href="#misiones"
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
                {t("landing.viewMissions")}
              </a>
            </div>
          </div>

          {/* Right: Visual — Compass + decorative rings */}
          <div className="hero-visual fade-in-d2">
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
        <div className="section-inner stats-grid">
          {[
            { icon: Users, value: "5,000+", label: t("landing.explorers") },
            { icon: MapTrifold, value: "12+", label: t("landing.missions") },
            { icon: Trophy, value: "$1,000", label: t("landing.prize") },
            { icon: Compass, value: "∞", label: t("landing.cities") },
          ].map((stat) => (
            <div key={stat.label}>
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
        className="section-countdown"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <div className="section-narrow">
          <CountdownTimer
            targetDate={sagaStart}
            label={t("landing.countdownLabel")}
          />
        </div>
      </section>

      {/* ── Leaderboard Widget ── */}
      <section
        className="section-leaderboard"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="section-narrow">
          <LeaderboardWidget />
        </div>
      </section>

      {/* ── Misiones Disponibles ── */}
      <section
        id="misiones"
        className="section-padded"
        style={{
          position: "relative",
          zIndex: 10,
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
            {t("landing.chooseAdventure")}
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              marginBottom: 8,
            }}
          >
            {t("landing.availableMissions")}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#71717a",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: "52ch",
            }}
          >
            {t("landing.selectSagaDesc")}
          </p>

          {loadingSagas ? (
            <div className="saga-grid">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="saga-skeleton"
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 16,
                    padding: 24,
                    minHeight: 240,
                  }}
                >
                  <div
                    className="saga-skeleton-pulse"
                    style={{
                      width: 80,
                      height: 22,
                      borderRadius: 6,
                      background: "#27272a",
                      marginBottom: 16,
                    }}
                  />
                  <div
                    className="saga-skeleton-pulse"
                    style={{
                      width: "70%",
                      height: 24,
                      borderRadius: 6,
                      background: "#27272a",
                      marginBottom: 12,
                    }}
                  />
                  <div
                    className="saga-skeleton-pulse"
                    style={{
                      width: "100%",
                      height: 16,
                      borderRadius: 6,
                      background: "#27272a",
                      marginBottom: 8,
                    }}
                  />
                  <div
                    className="saga-skeleton-pulse"
                    style={{
                      width: "85%",
                      height: 16,
                      borderRadius: 6,
                      background: "#27272a",
                      marginBottom: 32,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div
                      className="saga-skeleton-pulse"
                      style={{
                        width: 60,
                        height: 20,
                        borderRadius: 6,
                        background: "#27272a",
                      }}
                    />
                    <div
                      className="saga-skeleton-pulse"
                      style={{
                        width: 60,
                        height: 20,
                        borderRadius: 6,
                        background: "#27272a",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="saga-grid">
                {allSagas.map((saga) => {
                  const typeLabel =
                    saga.saga_type === "demo"
                      ? "DEMO"
                      : saga.saga_type === "free"
                        ? "FREE"
                        : saga.saga_type === "paid"
                          ? "PAID"
                          : (saga.saga_type || "FREE").toUpperCase();

                  const typeColor =
                    saga.saga_type === "demo"
                      ? { bg: "rgba(217,119,6,0.12)", text: "#d97706", border: "rgba(217,119,6,0.25)" }
                      : saga.saga_type === "paid"
                        ? { bg: "rgba(147,51,234,0.12)", text: "#a855f7", border: "rgba(147,51,234,0.25)" }
                        : { bg: "rgba(34,197,94,0.12)", text: "#22c55e", border: "rgba(34,197,94,0.25)" };

                  const diffLabel = saga.difficulty
                    ? saga.difficulty.charAt(0).toUpperCase() + saga.difficulty.slice(1)
                    : null;

                  const diffColor =
                    saga.difficulty === "easy"
                      ? "#22c55e"
                      : saga.difficulty === "hard" || saga.difficulty === "extreme"
                        ? "#ef4444"
                        : "#d97706";

                  return (
                    <Link
                      key={saga.id}
                      href={`/play?saga=${saga.id}`}
                      className="saga-card"
                      style={{
                        display: "block",
                        background: "#18181b",
                        border: saga.is_featured
                          ? "1px solid rgba(217,119,6,0.4)"
                          : "1px solid #27272a",
                        borderRadius: 16,
                        padding: 24,
                        textDecoration: "none",
                        color: "inherit",
                        transition:
                          "border-color 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)",
                        boxShadow: saga.is_featured
                          ? "0 0 24px rgba(217,119,6,0.08)"
                          : "none",
                        minHeight: 44,
                      }}
                    >
                      {/* Top row: type badge + location */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: typeColor.bg,
                            color: typeColor.text,
                            border: `1px solid ${typeColor.border}`,
                          }}
                        >
                          {typeLabel}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#71717a",
                          }}
                        >
                          {saga.city}, {saga.country}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#fafafa",
                          marginBottom: 8,
                          lineHeight: 1.3,
                        }}
                      >
                        {saga.title}
                      </h3>

                      {/* Description */}
                      {saga.description && (
                        <p
                          style={{
                            fontSize: 13,
                            color: "#a1a1aa",
                            lineHeight: 1.6,
                            marginBottom: 20,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {saga.description}
                        </p>
                      )}

                      {/* Bottom row: missions + difficulty + prize */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                          marginTop: "auto",
                        }}
                      >
                        {saga.total_levels && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#71717a",
                              fontWeight: 500,
                            }}
                          >
                            {saga.total_levels} {t("landing.missionsLabel")}
                          </span>
                        )}
                        {diffLabel && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: "0.06em",
                              padding: "2px 8px",
                              borderRadius: 6,
                              border: `1px solid ${diffColor}33`,
                              color: diffColor,
                              background: `${diffColor}14`,
                            }}
                          >
                            {diffLabel}
                          </span>
                        )}
                        {saga.prize_amount_usd != null && saga.prize_amount_usd > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#d97706",
                              marginLeft: "auto",
                            }}
                          >
                            ${saga.prize_amount_usd.toLocaleString()} USD
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {allSagas.length <= 1 && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "#52525b",
                    marginTop: 32,
                    fontStyle: "italic",
                  }}
                >
                  {t("landing.moreMissionsSoon")}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── How it works (vertical steps, no card grid) ── */}
      <section
        id="how-it-works"
        className="section-padded"
        style={{
          position: "relative",
          zIndex: 10,
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
            {t("landing.howItWorks")}
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
            {t("landing.fourStepsTitle")}
          </h2>

          <div className="steps-grid">
            {[
              {
                Icon: Lock,
                num: "01",
                title: t("landing.step1Title"),
                desc: t("landing.step1Desc"),
              },
              {
                Icon: Timer,
                num: "02",
                title: t("landing.step2Title"),
                desc: t("landing.step2Desc"),
              },
              {
                Icon: Eye,
                num: "03",
                title: t("landing.step3Title"),
                desc: t("landing.step3Desc"),
              },
              {
                Icon: Trophy,
                num: "04",
                title: t("landing.step4Title"),
                desc: t("landing.step4Desc"),
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
        className="section-padded"
        style={{
          position: "relative",
          zIndex: 10,
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
              {t("landing.firstMission")}
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
              {t("landing.firstMissionLocation")}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#71717a",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              {t("landing.firstMissionDesc")}
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
                { Icon: Lightning, text: t("landing.tagGemini") },
                { Icon: MapTrifold, text: t("landing.tagMaps") },
                { Icon: Users, text: t("landing.tagExplorers") },
                { Icon: Trophy, text: t("landing.tagPrize") },
                { Icon: Crosshair, text: t("landing.tagElimination") },
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
              href="/play?saga=demo"
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
              {t("landing.startExploring")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="footer-section"
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
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
            © {new Date().getFullYear()} {t("landing.footerCopyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

