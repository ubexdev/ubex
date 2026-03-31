"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { ArrowLeft, CircleNotch, FloppyDisk } from "@phosphor-icons/react";
import Link from "next/link";

export default function NewSagaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    city: "",
    country: "",
    prize_amount_usd: 0,
    max_participants: 100,
    starts_at: "",
    ends_at: "",
  });

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!form.city.trim()) {
      setError("La ciudad es obligatoria");
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase no configurado");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No autenticado");
      setSaving(false);
      return;
    }

    const { data, error: err } = await supabase
      .from("sagas")
      .insert({
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim() || null,
        city: form.city.trim(),
        country: form.country.trim() || "México",
        prize_amount_usd: form.prize_amount_usd,
        max_participants: form.max_participants,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/sagas/${data.id}`);
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href="/admin/sagas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Sagas
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Crear Saga</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configura una nueva aventura para los jugadores
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>
            Título <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="El Tesoro de la Ciudad Perdida"
            className={inputClass}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelClass}>Subtítulo</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Una aventura por las calles coloniales"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Describe la historia y temática de esta saga..."
            className={inputClass}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* City + Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Ciudad <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Ciudad de México"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>País</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="México"
              className={inputClass}
            />
          </div>
        </div>

        {/* Prize + Max participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Premio (USD)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={form.prize_amount_usd}
              onChange={(e) =>
                update("prize_amount_usd", Number(e.target.value))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Máx. participantes</label>
            <input
              type="number"
              min={1}
              value={form.max_participants}
              onChange={(e) =>
                update("max_participants", Number(e.target.value))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => update("starts_at", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha de fin</label>
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => update("ends_at", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <FloppyDisk size={18} weight="bold" />
            )}
            {saving ? "Guardando..." : "Crear Saga"}
          </button>
        </div>
      </form>
    </div>
  );
}
