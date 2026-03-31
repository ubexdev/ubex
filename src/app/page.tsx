"use client";

import { useMemo } from "react";
import CountdownTimer from "@/components/game/CountdownTimer";
import ParticipantTracker from "@/components/game/ParticipantTracker";

export default function Home() {
  // Countdown calculated at runtime (client-side)
  const sagaStart = useMemo(
    () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    []
  );
  return (
    <div className="relative flex flex-col flex-1 min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-amber-400">
            UBEX
          </span>
          <span className="text-xs text-white/40 hidden sm:inline">
            ARQUEOLOGÍA DIGITAL
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Ingresar
          </a>
          <a
            href="/register"
            className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-lg transition-colors"
          >
            Registrarse
          </a>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Globe placeholder — will be replaced by Three.js globe */}
        <div className="w-48 h-48 mb-8 rounded-full border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center justify-center">
          <span className="text-6xl">🌍</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-white">EL MUNDO ES</span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            EL TABLERO
          </span>
        </h1>

        <p className="max-w-xl text-lg text-white/50 mb-10 leading-relaxed">
          Explora calles reales en Google Street View. Resuelve acertijos de la
          historia. El primero en encontrar el tesoro gana{" "}
          <span className="text-amber-400 font-bold">$1,000 USD</span>.
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <CountdownTimer
            targetDate={sagaStart}
            label="SAGA DE COLÓN — ZONA COLONIAL, SANTO DOMINGO"
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a
            href="/register"
            className="px-8 py-4 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-black rounded-xl transition-all hover:scale-105"
          >
            UNIRSE A LA SAGA — $9.99
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 text-lg font-semibold border border-white/20 hover:border-amber-500/50 text-white rounded-xl transition-colors"
          >
            ¿Cómo funciona?
          </a>
        </div>

        {/* Live tracker demo */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <ParticipantTracker
            totalParticipants={5000}
            activeParticipants={5000}
            currentLevel={0}
            totalLevels={12}
          />
        </div>
      </main>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 py-20 px-6 border-t border-white/5"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-amber-400">12 NIVELES</span> DE HISTORIA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: "🔐",
              title: "Suscríbete",
              desc: "Elige tu plan y recibe tu membresía con usuario y contraseña.",
            },
            {
              icon: "⏱️",
              title: "Espera la señal",
              desc: "El temporizador global marca cuándo se revelan las pistas.",
            },
            {
              icon: "🗺️",
              title: "Explora",
              desc: "Recorre calles reales en Street View para encontrar el dato exacto.",
            },
            {
              icon: "🏆",
              title: "Gana el tesoro",
              desc: "El primer explorador en completar los 12 niveles gana $1,000 USD.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors"
            >
              <span className="text-4xl mb-4 block">{step.icon}</span>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-white/50">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5 text-center">
        <p className="text-sm text-white/30">
          UBEX © {new Date().getFullYear()} — Arqueología Digital de Próxima
          Generación. Impulsada por Google Gemini & Maps.
        </p>
      </footer>
    </div>
  );
}
