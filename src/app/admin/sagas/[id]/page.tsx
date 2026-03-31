"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { getCountryOptions, getCitiesForCountry } from "@/data/world-cities";
import MapPicker from "@/lib/maps/MapPicker";
import {
  ArrowLeft,
  CircleNotch,
  FloppyDisk,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  CaretDown,
  CaretRight,
  Copy,
  Export,
  UploadSimple,
  Warning,
  Lightbulb,
  X,
  MapPin,
  Crosshair,
} from "@phosphor-icons/react";

/* ────────────────────── Types ────────────────────── */

type Saga = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  country: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  is_active: boolean;
  is_featured: boolean;
  created_by: string | null;
  total_levels: number;
  estimated_duration: number | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

type Level = {
  id: string;
  saga_id: string;
  level_number: number;
  title: string;
  description: string | null;
  clue: string;
  answer: string;
  answer_type: "text" | "proximity" | "multiple_choice";
  spawn_lat: number;
  spawn_lng: number;
  target_lat: number | null;
  target_lng: number | null;
  proximity_radius: number;
  points: number;
  time_limit: number | null;
  hints: string[];
  created_at: string;
};

/* ────────────────────── Config ────────────────────── */

const difficultyConfig = {
  easy: { label: "Fácil", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  medium: { label: "Media", bg: "bg-amber-400/10", text: "text-amber-300" },
  hard: { label: "Difícil", bg: "bg-orange-400/10", text: "text-orange-300" },
  expert: { label: "Experto", bg: "bg-red-400/10", text: "text-red-300" },
};

const answerTypeLabels = {
  text: "Texto",
  proximity: "Proximidad",
  multiple_choice: "Opción múltiple",
};

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-zinc-400 mb-1";

/* ────────────────────── Hints Editor ────────────────────── */

function HintsEditor({
  hints,
  onChange,
}: {
  hints: string[];
  onChange: (h: string[]) => void;
}) {
  function addHint() {
    onChange([...hints, ""]);
  }
  function updateHint(idx: number, val: string) {
    const copy = [...hints];
    copy[idx] = val;
    onChange(copy);
  }
  function removeHint(idx: number) {
    onChange(hints.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className={labelClass + " flex items-center gap-1.5"}>
        <Lightbulb size={14} />
        Señales ({hints.length})
      </label>
      <div className="space-y-2">
        {hints.map((hint, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 shrink-0 w-5 text-right">
              {idx + 1}.
            </span>
            <input
              type="text"
              value={hint}
              onChange={(e) => updateHint(idx, e.target.value)}
              placeholder={`Señal ${idx + 1}...`}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeHint(idx)}
              className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-950 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addHint}
        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
      >
        <Plus size={12} />
        Agregar señal
      </button>
    </div>
  );
}

/* ────────────────────── Main Page ────────────────────── */

export default function SagaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const sagaId = params.id as string;

  const [saga, setSaga] = useState<Saga | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Saga editor
  const [editSaga, setEditSaga] = useState(false);
  const [sagaForm, setSagaForm] = useState<Partial<Saga>>({});

  // Level editor
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [levelForm, setLevelForm] = useState<Partial<Level>>({});
  const [savingLevel, setSavingLevel] = useState(false);
  const [addingLevel, setAddingLevel] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const supabase = getSupabaseBrowser();

  /* ── Data loading ── */

  const loadData = useCallback(async () => {
    if (!supabase) return;

    const [sagaRes, levelsRes] = await Promise.all([
      supabase.from("sagas").select("*").eq("id", sagaId).single(),
      supabase
        .from("levels")
        .select("*")
        .eq("saga_id", sagaId)
        .order("level_number", { ascending: true }),
    ]);

    if (sagaRes.error) {
      setError(sagaRes.error.message);
    } else {
      const s = sagaRes.data as unknown as Saga;
      setSaga(s);
      setSagaForm(s);
    }

    if (!levelsRes.error) {
      setLevels((levelsRes.data ?? []) as unknown as Level[]);
    }

    setLoading(false);
  }, [supabase, sagaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  /* ── Saga CRUD ── */

  async function saveSaga() {
    if (!supabase || !saga) return;
    setSaving(true);
    setError(null);

    const { error: err } = await supabase
      .from("sagas")
      .update({
        title: sagaForm.title,
        description: sagaForm.description,
        city: sagaForm.city,
        country: sagaForm.country,
        difficulty: sagaForm.difficulty,
        is_active: sagaForm.is_active,
        is_featured: sagaForm.is_featured,
        estimated_duration: sagaForm.estimated_duration,
        cover_image_url: sagaForm.cover_image_url,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", sagaId);

    if (err) {
      setError(err.message);
    } else {
      setSaga({ ...saga, ...sagaForm } as Saga);
      setEditSaga(false);
      showSuccess("Saga guardada");
    }
    setSaving(false);
  }

  async function deleteSaga() {
    if (!supabase) return;
    if (!confirm("¿Eliminar esta saga y todas sus misiones? Esta acción no se puede deshacer."))
      return;

    const { error: err } = await supabase
      .from("sagas")
      .delete()
      .eq("id", sagaId);

    if (err) {
      setError(err.message);
    } else {
      router.push("/admin/sagas");
    }
  }

  async function duplicateSaga() {
    if (!supabase || !saga) return;
    setDuplicating(true);
    setError(null);

    const { data: newSaga, error: sErr } = await supabase
      .from("sagas")
      .insert({
        title: `${saga.title} (copia)`,
        description: saga.description,
        city: saga.city,
        country: saga.country,
        difficulty: saga.difficulty,
        is_active: false,
        is_featured: false,
        estimated_duration: saga.estimated_duration,
        cover_image_url: saga.cover_image_url,
        created_by: saga.created_by,
      } as any)
      .select("id")
      .single();

    if (sErr || !newSaga) {
      setError(sErr?.message ?? "Error duplicando saga");
      setDuplicating(false);
      return;
    }

    if (levels.length > 0) {
      const levelInserts = levels.map((l) => ({
        saga_id: newSaga.id,
        level_number: l.level_number,
        title: l.title,
        description: l.description,
        clue: l.clue,
        answer: l.answer,
        answer_type: l.answer_type,
        spawn_lat: l.spawn_lat,
        spawn_lng: l.spawn_lng,
        target_lat: l.target_lat,
        target_lng: l.target_lng,
        proximity_radius: l.proximity_radius,
        points: l.points,
        time_limit: l.time_limit,
        hints: l.hints,
      }));
      await supabase.from("levels").insert(levelInserts as any);
    }

    setDuplicating(false);
    router.push(`/admin/sagas/${newSaga.id}`);
  }

  function exportSaga() {
    if (!saga) return;
    const exportData = {
      ...saga,
      levels: levels,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saga-${saga.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setError(null);

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      const lvls = imported.levels;

      if (!Array.isArray(lvls)) {
        setError("El archivo no contiene misiones válidas");
        return;
      }

      // Delete existing levels and insert imported ones
      if (!confirm(`¿Reemplazar las ${levels.length} misiones actuales con ${lvls.length} misiones importadas?`))
        return;

      await supabase.from("levels").delete().eq("saga_id", sagaId);

      const levelInserts = lvls.map(
        (l: Record<string, unknown>, idx: number) => ({
          saga_id: sagaId,
          level_number: (l.level_number as number) ?? idx + 1,
          title: (l.title as string) ?? `Misión ${idx + 1}`,
          description: (l.description as string) ?? null,
          clue: (l.clue as string) ?? "",
          answer: (l.answer as string) ?? "",
          answer_type: (l.answer_type as string) ?? "text",
          spawn_lat: (l.spawn_lat as number) ?? 18.4861,
          spawn_lng: (l.spawn_lng as number) ?? -69.9312,
          target_lat: (l.target_lat as number) ?? null,
          target_lng: (l.target_lng as number) ?? null,
          proximity_radius: (l.proximity_radius as number) ?? 50,
          points: (l.points as number) ?? 100,
          time_limit: (l.time_limit as number) ?? null,
          hints: (l.hints as string[]) ?? [],
        })
      );

      await supabase.from("levels").insert(levelInserts as any);

      // Update saga metadata from import if available
      const sagaFields: Record<string, unknown> = {};
      if (imported.title) sagaFields.title = imported.title;
      if (imported.description !== undefined) sagaFields.description = imported.description;
      if (imported.difficulty) sagaFields.difficulty = imported.difficulty;
      if (Object.keys(sagaFields).length > 0) {
        sagaFields.updated_at = new Date().toISOString();
        await supabase.from("sagas").update(sagaFields as any).eq("id", sagaId);
      }

      await loadData();
      showSuccess("Importación completada");
    } catch {
      setError("Error procesando archivo JSON");
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── Level CRUD ── */

  function toggleLevel(level: Level) {
    if (expandedLevel === level.id) {
      setExpandedLevel(null);
    } else {
      setExpandedLevel(level.id);
      setLevelForm({ ...level });
    }
  }

  async function saveLevel() {
    if (!supabase || !expandedLevel) return;
    setSavingLevel(true);
    setError(null);

    const { error: err } = await supabase
      .from("levels")
      .update({
        title: levelForm.title,
        description: levelForm.description,
        clue: levelForm.clue,
        answer: levelForm.answer,
        answer_type: levelForm.answer_type,
        spawn_lat: levelForm.spawn_lat,
        spawn_lng: levelForm.spawn_lng,
        target_lat: levelForm.target_lat,
        target_lng: levelForm.target_lng,
        proximity_radius: levelForm.proximity_radius,
        points: levelForm.points,
        time_limit: levelForm.time_limit,
        hints: levelForm.hints,
      } as any)
      .eq("id", expandedLevel);

    if (err) {
      setError(err.message);
    } else {
      await loadData();
      showSuccess("Misión guardada");
    }
    setSavingLevel(false);
  }

  async function deleteLevel(levelId: string) {
    if (!supabase) return;
    if (!confirm("¿Eliminar esta misión? Esta acción no se puede deshacer."))
      return;

    const { error: err } = await supabase
      .from("levels")
      .delete()
      .eq("id", levelId);

    if (!err) {
      setExpandedLevel(null);
      await loadData();
      showSuccess("Misión eliminada");
    }
  }

  async function addLevel() {
    if (!supabase) return;
    setAddingLevel(true);
    setError(null);

    const nextNum =
      levels.length > 0
        ? Math.max(...levels.map((l) => l.level_number)) + 1
        : 1;

    const { error: err } = await supabase.from("levels").insert({
      saga_id: sagaId,
      level_number: nextNum,
      title: `Misión ${nextNum}`,
      clue: "Escribe la señal aquí...",
      answer: "respuesta",
      answer_type: "text",
      spawn_lat: 18.4861,
      spawn_lng: -69.9312,
      target_lat: 18.4861,
      target_lng: -69.9312,
      proximity_radius: 50,
      points: 100,
      hints: [],
    } as any);

    if (err) {
      setError(err.message);
    } else {
      await loadData();
    }
    setAddingLevel(false);
  }

  async function moveLevel(levelId: string, direction: "up" | "down") {
    if (!supabase) return;
    const idx = levels.findIndex((l) => l.id === levelId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= levels.length) return;

    const a = levels[idx];
    const b = levels[swapIdx];

    await Promise.all([
      supabase
        .from("levels")
        .update({ level_number: b.level_number } as any)
        .eq("id", a.id),
      supabase
        .from("levels")
        .update({ level_number: a.level_number } as any)
        .eq("id", b.id),
    ]);

    await loadData();
  }

  /* ── Render helpers ── */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircleNotch size={32} className="text-zinc-600 animate-spin" />
      </div>
    );
  }

  if (!saga) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/sagas"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a Sagas
        </Link>
        <p className="text-zinc-500">Saga no encontrada</p>
      </div>
    );
  }

  const currentDiff =
    difficultyConfig[saga.difficulty] ?? difficultyConfig.medium;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link
        href="/admin/sagas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Sagas
      </Link>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <Warning size={18} />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:text-red-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* ─── Saga Header ─── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            {editSaga ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Título</label>
                  <input
                    type="text"
                    value={sagaForm.title ?? ""}
                    onChange={(e) =>
                      setSagaForm({ ...sagaForm, title: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    value={sagaForm.description ?? ""}
                    onChange={(e) =>
                      setSagaForm({ ...sagaForm, description: e.target.value })
                    }
                    rows={3}
                    className={inputClass}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">País</label>
                    <select
                      value={sagaForm.country}
                      onChange={(e) => setSagaForm({ ...sagaForm, country: e.target.value, city: "" })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    >
                      <option value="">Seleccionar país</option>
                      {getCountryOptions().map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Ciudad</label>
                    <select
                      value={sagaForm.city}
                      onChange={(e) => setSagaForm({ ...sagaForm, city: e.target.value })}
                      disabled={!sagaForm.country}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Seleccionar ciudad</option>
                      {sagaForm.country && getCitiesForCountry(sagaForm.country).map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Dificultad</label>
                    <select
                      value={sagaForm.difficulty ?? "medium"}
                      onChange={(e) =>
                        setSagaForm({
                          ...sagaForm,
                          difficulty: e.target.value as Saga["difficulty"],
                        })
                      }
                      className={inputClass}
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Media</option>
                      <option value="hard">Difícil</option>
                      <option value="expert">Experto</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Duración estimada (min)</label>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={sagaForm.estimated_duration ?? ""}
                      onChange={(e) =>
                        setSagaForm({
                          ...sagaForm,
                          estimated_duration: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={sagaForm.is_active ?? false}
                      onChange={(e) =>
                        setSagaForm({ ...sagaForm, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-600 focus:ring-amber-600"
                    />
                    <span className="text-sm text-zinc-300">Activa</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={sagaForm.is_featured ?? false}
                      onChange={(e) =>
                        setSagaForm({
                          ...sagaForm,
                          is_featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-600 focus:ring-amber-600"
                    />
                    <span className="text-sm text-zinc-300">Destacada</span>
                  </label>
                </div>
                <div>
                  <label className={labelClass}>URL imagen de portada</label>
                  <input
                    type="url"
                    value={sagaForm.cover_image_url ?? ""}
                    onChange={(e) =>
                      setSagaForm({
                        ...sagaForm,
                        cover_image_url: e.target.value || null,
                      })
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveSaga}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 transition-colors"
                  >
                    {saving ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <FloppyDisk size={16} weight="bold" />
                    )}
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditSaga(false);
                      setSagaForm(saga);
                    }}
                    className="px-4 py-2.5 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-zinc-100">
                    {saga.title}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${currentDiff.bg} ${currentDiff.text}`}
                  >
                    {currentDiff.label}
                  </span>
                  {saga.is_active && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-300">
                      Activa
                    </span>
                  )}
                  {saga.is_featured && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300">
                      Destacada
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {saga.city}, {saga.country}
                  {saga.estimated_duration &&
                    ` · ${saga.estimated_duration} min`}
                  {` · ${saga.total_levels} misiones`}
                </p>
                {saga.description && (
                  <p className="text-sm text-zinc-500 mt-2 whitespace-pre-wrap">
                    {saga.description}
                  </p>
                )}
                <button
                  onClick={() => setEditSaga(true)}
                  className="mt-3 text-xs text-amber-600 hover:text-amber-500 transition-colors"
                >
                  Editar información
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Action Buttons ─── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={duplicateSaga}
          disabled={duplicating}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {duplicating ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <Copy size={16} />
          )}
          Duplicar
        </button>
        <button
          onClick={exportSaga}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Export size={16} />
          Exportar JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <UploadSimple size={16} />
          Importar JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
        <button
          onClick={deleteSaga}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-900 text-red-400 text-sm font-medium hover:bg-red-950 transition-colors ml-auto"
        >
          <Trash size={16} />
          Eliminar Saga
        </button>
      </div>

      {/* ─── Levels Section ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Misiones</h2>
          <button
            onClick={addLevel}
            disabled={addingLevel}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {addingLevel ? (
              <CircleNotch size={16} className="animate-spin" />
            ) : (
              <Plus size={16} weight="bold" />
            )}
            Agregar Misión
          </button>
        </div>

        {levels.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
            <MapPin
              size={32}
              weight="duotone"
              className="mx-auto text-zinc-700"
            />
            <p className="text-zinc-500 text-sm mt-2">
              No hay misiones en esta saga aún
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {levels.map((level, idx) => {
              const diff =
                difficultyConfig[
                  saga.difficulty as keyof typeof difficultyConfig
                ] ?? difficultyConfig.medium;
              const isExpanded = expandedLevel === level.id;

              return (
                <div
                  key={level.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
                >
                  {/* Level header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-zinc-800/50 transition-colors min-h-11"
                  >
                    <span className="text-zinc-600 shrink-0">
                      {isExpanded ? (
                        <CaretDown size={16} />
                      ) : (
                        <CaretRight size={16} />
                      )}
                    </span>
                    <span className="text-sm font-mono text-zinc-500 shrink-0">
                      #{level.level_number}
                    </span>
                    <span className="text-sm font-medium text-zinc-200 flex-1 truncate">
                      {level.title}
                    </span>
                    <span className="text-xs text-zinc-600 shrink-0">
                      {level.points} pts
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${diff.bg} ${diff.text} shrink-0`}
                    >
                      {answerTypeLabels[level.answer_type] ?? level.answer_type}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLevel(level.id, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLevel(level.id, "down");
                        }}
                        disabled={idx === levels.length - 1}
                        className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </button>

                  {/* Level editor (expanded) */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800 p-5 space-y-5">
                      {/* Title + Description */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Título</label>
                          <input
                            type="text"
                            value={levelForm.title ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                title: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Descripción</label>
                          <input
                            type="text"
                            value={levelForm.description ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                description: e.target.value || null,
                              })
                            }
                            placeholder="Descripción opcional de la misión"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Clue */}
                      <div>
                        <label className={labelClass}>Señal principal</label>
                        <textarea
                          value={levelForm.clue ?? ""}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              clue: e.target.value,
                            })
                          }
                          rows={3}
                          className={inputClass}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      {/* Answer + Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Respuesta</label>
                          <input
                            type="text"
                            value={levelForm.answer ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                answer: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Tipo de respuesta</label>
                          <select
                            value={levelForm.answer_type ?? "text"}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                answer_type: e.target
                                  .value as Level["answer_type"],
                              })
                            }
                            className={inputClass}
                          >
                            <option value="text">Texto</option>
                            <option value="proximity">Proximidad</option>
                            <option value="multiple_choice">
                              Opción múltiple
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Points + Time limit + Proximity */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>XP</label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={levelForm.points ?? 100}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                points: Number(e.target.value),
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Tiempo límite (seg)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={levelForm.time_limit ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                time_limit: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                            placeholder="Sin límite"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Radio proximidad: {levelForm.proximity_radius ?? 50}
                            m
                          </label>
                          <input
                            type="range"
                            min={10}
                            max={500}
                            step={10}
                            value={levelForm.proximity_radius ?? 50}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                proximity_radius: Number(e.target.value),
                              })
                            }
                            className="w-full accent-amber-600 mt-2"
                          />
                          <div className="flex justify-between text-xs text-zinc-600 mt-1">
                            <span>10m</span>
                            <span>500m</span>
                          </div>
                        </div>
                      </div>

                      {/* Map pickers */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <MapPicker
                          lat={levelForm.spawn_lat ?? 18.4861}
                          lng={levelForm.spawn_lng ?? -69.9312}
                          onCoordinateChange={(lat, lng) =>
                            setLevelForm({
                              ...levelForm,
                              spawn_lat: lat,
                              spawn_lng: lng,
                            })
                          }
                          showStreetView
                          label="Coordenadas de inicio (spawn)"
                        />
                        <MapPicker
                          lat={levelForm.target_lat ?? 18.4861}
                          lng={levelForm.target_lng ?? -69.9312}
                          onCoordinateChange={(lat, lng) =>
                            setLevelForm({
                              ...levelForm,
                              target_lat: lat,
                              target_lng: lng,
                            })
                          }
                          showStreetView
                          label="Coordenadas objetivo (target)"
                        />
                      </div>

                      {/* Manual coordinate inputs */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className={labelClass}>
                            <MapPin size={12} className="inline mr-1" />
                            Spawn Lat
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={levelForm.spawn_lat ?? 0}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                spawn_lat: Number(e.target.value),
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <MapPin size={12} className="inline mr-1" />
                            Spawn Lng
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={levelForm.spawn_lng ?? 0}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                spawn_lng: Number(e.target.value),
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <Crosshair size={12} className="inline mr-1" />
                            Target Lat
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={levelForm.target_lat ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                target_lat: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            <Crosshair size={12} className="inline mr-1" />
                            Target Lng
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={levelForm.target_lng ?? ""}
                            onChange={(e) =>
                              setLevelForm({
                                ...levelForm,
                                target_lng: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Hints */}
                      <HintsEditor
                        hints={(levelForm.hints as string[]) ?? []}
                        onChange={(h) =>
                          setLevelForm({ ...levelForm, hints: h })
                        }
                      />

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={saveLevel}
                          disabled={savingLevel}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 transition-colors"
                        >
                          {savingLevel ? (
                            <CircleNotch size={16} className="animate-spin" />
                          ) : (
                            <FloppyDisk size={16} weight="bold" />
                          )}
                          Guardar Misión
                        </button>
                        <button
                          onClick={() => setExpandedLevel(null)}
                          className="px-4 py-2.5 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => deleteLevel(level.id)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-900 text-red-400 text-sm font-medium hover:bg-red-950 transition-colors ml-auto"
                        >
                          <Trash size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
