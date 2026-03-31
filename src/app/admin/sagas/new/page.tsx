"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  ArrowLeft,
  CircleNotch,
  FloppyDisk,
  Warning,
} from "@phosphor-icons/react";
import Link from "next/link";

const difficultyOptions = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Media" },
  { value: "hard", label: "Difícil" },
  { value: "expert", label: "Experto" },
];

export default function NewSagaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    country: "DO",
    difficulty: "medium" as "easy" | "medium" | "hard" | "expert",
    estimated_duration: 60,
    cover_image_url: "",
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
        description: form.description.trim() || null,
        city: form.city.trim(),
        country: form.country.trim() || "DO",
        difficulty: form.difficulty,
        estimated_duration: form.estimated_duration || null,
        cover_image_url: form.cover_image_url.trim() || null,
        created_by: user.id,
      } as any)
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
          Configura una nueva aventura para los exploradores
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <Warning size={18} />
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
              placeholder="Santo Domingo"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>País</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="DO"
              className={inputClass}
            />
          </div>
        </div>

        {/* Difficulty + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Dificultad</label>
            <select
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className={inputClass}
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Duración estimada (minutos)</label>
            <input
              type="number"
              min={0}
              step={5}
              value={form.estimated_duration}
              onChange={(e) =>
                update("estimated_duration", Number(e.target.value))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Cover image URL */}
        <div>
          <label className={labelClass}>URL imagen de portada</label>
          <input
            type="url"
            value={form.cover_image_url}
            onChange={(e) => update("cover_image_url", e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className={inputClass}
          />
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
