"use client";

import { useMemo } from "react";
import CountdownTimer from "@/components/game/CountdownTimer";

export default function Home() {
  const sagaStart = useMemo(
    () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    []
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* ── Background layers ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-amber-500/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-600/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[-10%] w-[400px] h-[400px] bg-amber-400/[0.03] rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-extrabold text-sm">U</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              UBEX
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase hidden sm:inline border-l border-white/10 pl-3 ml-1">
            Arqueología Digital
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <a
            href="#how-it-works"
            className="text-sm text-white/50 hover:text-white transition-colors hidden sm:inline"
          >
            ¿Cómo funciona?
          </a>
          <a
            href="#"
            className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            Ingresar
          </a>
          <a
            href="#"
            className="btn-glow px-5 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors"
          >
            Registrarse
          </a>
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <main className="relative z-10">
        <section className="flex flex-col items-center justify-center px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center">
          {/* Globe */}
          <div className="animate-fade-in-up">
            <div className="globe-pulse animate-float w-36 h-36 lg:w-44 lg:h-44 mb-10 rounded-full border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 flex items-center justify-center backdrop-blur-sm">
              <span className="text-6xl lg:text-7xl select-none">🌍</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6">
            <span className="block text-white">EL MUNDO ES</span>
            <span className="block text-shimmer mt-1">EL TABLERO</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up-delay-2 max-w-lg text-base lg:text-lg text-white/40 mb-12 leading-relaxed">
            Explora calles reales en Google Street View. Resuelve acertijos
            de la historia. El primero en encontrar el tesoro gana{" "}
            <span className="text-amber-400 font-semibold">$1,000 USD</span>.
          </p>

          {/* Countdown */}
          <div className="animate-fade-in-up-delay-3 mb-12">
            <CountdownTimer
              targetDate={sagaStart}
              label="SAGA DE COLÓN — ZONA COLONIAL, SANTO DOMINGO"
            />
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="btn-glow group relative px-8 py-4 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                UNIRSE A LA SAGA
                <span className="text-amber-800/60 font-medium">$9.99</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#how-it-works"
              className="group px-8 py-4 text-base font-semibold border border-white/10 hover:border-white/30 text-white/70 hover:text-white rounded-xl transition-all"
            >
              ¿Cómo funciona?
            </a>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="relative border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/[0.06]">
            {[
              { value: "5,000+", label: "Exploradores por saga" },
              { value: "12", label: "Niveles por saga" },
              { value: "$1,000", label: "Premio USD" },
              { value: "∞", label: "Ciudades del mundo" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:px-8">
                <div className="text-2xl lg:text-3xl font-bold text-white font-tabular">
                  {stat.value}
                </div>
                <div className="text-xs text-white/30 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase font-medium mb-3">
                Mecánica del juego
              </p>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
                <span className="text-white">12 Niveles</span>{" "}
                <span className="text-white/30">de Historia</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  step: "01",
                  icon: "🔐",
                  title: "Suscríbete",
                  desc: "Elige tu plan, paga con PayPal y recibe tu membresía con usuario y contraseña por email.",
                },
                {
                  step: "02",
                  icon: "⏱️",
                  title: "Espera la señal",
                  desc: "El temporizador global sincronizado marca cuándo se revelan las pistas. Todos arrancan al mismo tiempo.",
                },
                {
                  step: "03",
                  icon: "🗺️",
                  title: "Explora",
                  desc: "Recorre calles reales en Google Street View. Encuentra el dato exacto que pide cada pista.",
                },
                {
                  step: "04",
                  icon: "🏆",
                  title: "Gana el tesoro",
                  desc: "El primer explorador en completar los 12 niveles se lleva $1,000 USD. Solo uno gana.",
                },
              ].map((step) => (
                <div
                  key={step.step}
                  className="card-hover group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 relative overflow-hidden"
                >
                  {/* Step number */}
                  <span className="absolute top-4 right-5 text-[64px] font-extrabold leading-none text-white/[0.03] select-none">
                    {step.step}
                  </span>
                  <span className="text-3xl mb-5 block">{step.icon}</span>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/35 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── First mission teaser ── */}
        <section className="py-24 px-6 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-amber-400/60 text-xs tracking-[0.25em] uppercase font-medium mb-3">
              Primera misión
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-6">
              <span className="text-white">Zona Colonial,</span>{" "}
              <span className="text-shimmer">Santo Domingo</span>
            </h2>
            <p className="text-white/35 text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Elegida por su densidad histórica y detalles visuales únicos
              capturados por Street View. Una narrativa inmersiva que te desafía
              a encontrar datos exactos en edificios coloniales reales.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                "🧠 IA Gemini valida respuestas",
                "🌎 Google Maps + Street View",
                "⚡ 5,000 exploradores simultáneos",
                "💰 $1,000 USD de premio",
                "🔥 Eliminación progresiva",
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-4 py-2 text-xs font-medium text-white/50 border border-white/[0.08] rounded-full bg-white/[0.02]"
                >
                  {pill}
                </span>
              ))}
            </div>

            <a
              href="#"
              className="btn-glow inline-flex items-center gap-2 px-10 py-4 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all active:scale-95"
            >
              RESERVAR MI LUGAR
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-extrabold text-[10px]">U</span>
            </div>
            <span className="text-sm font-semibold text-white/50">UBEX</span>
          </div>
          <p className="text-xs text-white/20 text-center">
            © {new Date().getFullYear()} UBEX — Arqueología Digital de Próxima
            Generación. Impulsada por Google Gemini &amp; Maps Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}

