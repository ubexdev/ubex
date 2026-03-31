"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
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
} from "@phosphor-icons/react";

type Saga = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  city: string;
  country: string;
  prize_amount_usd: number;
  max_participants: number;
  status: "draft" | "active" | "completed";
  starts_at: string | null;
  ends_at: string | null;
};

type Level = {
  id: string;
  saga_id: string;
  number: number;
  title: string;
  clue_text: string;
  hint: string | null;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  spawn_lat: number;
  spawn_lng: number;
  spawn_heading: number;
  spawn_pitch: number;
  target_lat: number;
  target_lng: number;
  correct_answers: string[];
  explanation: string | null;
  proximity_radius_m: number;
};

const difficultyConfig = {
  easy: { label: "Fácil", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  medium: { label: "Media", bg: "bg-amber-400/10", text: "text-amber-300" },
  hard: { label: "Difícil", bg: "bg-orange-400/10", text: "text-orange-300" },
  extreme: { label: "Extrema", bg: "bg-red-400/10", text: "text-red-300" },
};

const statusFlow: ("draft" | "active" | "completed")[] = [
  "draft",
  "active",
  "completed",
];
const statusLabels = {
  draft: "Borrador",
  active: "Activa",
  completed: "Completada",
};

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-zinc-400 mb-1";

export default function SagaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sagaId = params.id as string;

  const [saga, setSaga] = useState<Saga | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline editing for saga
  const [editSaga, setEditSaga] = useState(false);
  const [sagaForm, setSagaForm] = useState<Partial<Saga>>({});

  // Level editor
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [levelForm, setLevelForm] = useState<Partial<Level>>({});
  const [savingLevel, setSavingLevel] = useState(false);
  const [addingLevel, setAddingLevel] = useState(false);

  const supabase = getSupabaseBrowser();

  const loadData = useCallback(async () => {
    if (!supabase) return;

    const [sagaRes, levelsRes] = await Promise.all([
      supabase.from("sagas").select("*").eq("id", sagaId).single(),
      supabase
        .from("levels")
        .select("*")
        .eq("saga_id", sagaId)
        .order("number", { ascending: true }),
    ]);

    if (sagaRes.error) {
      setError(sagaRes.error.message);
    } else {
      setSaga(sagaRes.data);
      setSagaForm(sagaRes.data);
    }

    if (!levelsRes.error) {
      setLevels(levelsRes.data ?? []);
    }

    setLoading(false);
  }, [supabase, sagaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save saga metadata
  async function saveSaga() {
    if (!supabase || !saga) return;
    setSaving(true);
    setError(null);

    const { error: err } = await supabase
      .from("sagas")
      .update({
        title: sagaForm.title,
        subtitle: sagaForm.subtitle,
        description: sagaForm.description,
        city: sagaForm.city,
        country: sagaForm.country,
        prize_amount_usd: sagaForm.prize_amount_usd,
        max_participants: sagaForm.max_participants,
        starts_at: sagaForm.starts_at,
        ends_at: sagaForm.ends_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sagaId);

    if (err) {
      setError(err.message);
    } else {
      setSaga({ ...saga, ...sagaForm } as Saga);
      setEditSaga(false);
    }
    setSaving(false);
  }

  // Toggle status
  async function toggleStatus() {
    if (!supabase || !saga) return;
    const currentIdx = statusFlow.indexOf(saga.status);
    const nextStatus = statusFlow[(currentIdx + 1) % statusFlow.length];

    const { error: err } = await supabase
      .from("sagas")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", sagaId);

    if (!err) {
      setSaga({ ...saga, status: nextStatus });
    }
  }

  // Level: expand & populate form
  function toggleLevel(level: Level) {
    if (expandedLevel === level.id) {
      setExpandedLevel(null);
    } else {
      setExpandedLevel(level.id);
      setLevelForm({
        ...level,
        correct_answers: level.correct_answers,
      });
    }
  }

  // Save level
  async function saveLevel() {
    if (!supabase || !expandedLevel) return;
    setSavingLevel(true);
    setError(null);

    const { error: err } = await supabase
      .from("levels")
      .update({
        title: levelForm.title,
        clue_text: levelForm.clue_text,
        hint: levelForm.hint,
        difficulty: levelForm.difficulty,
        spawn_lat: levelForm.spawn_lat,
        spawn_lng: levelForm.spawn_lng,
        spawn_heading: levelForm.spawn_heading,
        spawn_pitch: levelForm.spawn_pitch,
        target_lat: levelForm.target_lat,
        target_lng: levelForm.target_lng,
        correct_answers: levelForm.correct_answers,
        explanation: levelForm.explanation,
        proximity_radius_m: levelForm.proximity_radius_m,
      })
      .eq("id", expandedLevel);

    if (err) {
      setError(err.message);
    } else {
      await loadData();
      setExpandedLevel(null);
    }
    setSavingLevel(false);
  }

  // Delete level
  async function deleteLevel(levelId: string) {
    if (!supabase) return;
    if (!confirm("¿Eliminar este nivel? Esta acción no se puede deshacer."))
      return;

    const { error: err } = await supabase
      .from("levels")
      .delete()
      .eq("id", levelId);

    if (!err) {
      setExpandedLevel(null);
      await loadData();
    }
  }

  // Add new level
  async function addLevel() {
    if (!supabase) return;
    setAddingLevel(true);
    setError(null);

    const nextNumber = levels.length > 0 ? Math.max(...levels.map((l) => l.number)) + 1 : 1;

    const { error: err } = await supabase.from("levels").insert({
      saga_id: sagaId,
      number: nextNumber,
      title: `Nivel ${nextNumber}`,
      clue_text: "Escribe la pista aquí...",
      difficulty: "medium",
      spawn_lat: 19.4326,
      spawn_lng: -99.1332,
      spawn_heading: 0,
      spawn_pitch: 0,
      target_lat: 19.4326,
      target_lng: -99.1332,
      correct_answers: ["respuesta"],
      proximity_radius_m: 100,
    });

    if (err) {
      setError(err.message);
    } else {
      await loadData();
    }
    setAddingLevel(false);
  }

  // Move level
  async function moveLevel(levelId: string, direction: "up" | "down") {
    if (!supabase) return;
    const idx = levels.findIndex((l) => l.id === levelId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= levels.length) return;

    const a = levels[idx];
    const b = levels[swapIdx];

    await Promise.all([
      supabase.from("levels").update({ number: b.number }).eq("id", a.id),
      supabase.from("levels").update({ number: a.number }).eq("id", b.id),
    ]);

    await loadData();
  }

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

  const currentStatusConf = {
    draft: { bg: "bg-zinc-400/10", text: "text-zinc-300" },
    active: { bg: "bg-emerald-400/10", text: "text-emerald-300" },
    completed: { bg: "bg-blue-400/10", text: "text-blue-300" },
  }[saga.status];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/sagas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a Sagas
      </Link>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Saga header */}
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
                  <label className={labelClass}>Subtítulo</label>
                  <input
                    type="text"
                    value={sagaForm.subtitle ?? ""}
                    onChange={(e) =>
                      setSagaForm({ ...sagaForm, subtitle: e.target.value })
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
                    <label className={labelClass}>Ciudad</label>
                    <input
                      type="text"
                      value={sagaForm.city ?? ""}
                      onChange={(e) =>
                        setSagaForm({ ...sagaForm, city: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>País</label>
                    <input
                      type="text"
                      value={sagaForm.country ?? ""}
                      onChange={(e) =>
                        setSagaForm({ ...sagaForm, country: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Premio (USD)</label>
                    <input
                      type="number"
                      min={0}
                      value={sagaForm.prize_amount_usd ?? 0}
                      onChange={(e) =>
                        setSagaForm({
                          ...sagaForm,
                          prize_amount_usd: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Máx. participantes</label>
                    <input
                      type="number"
                      min={1}
                      value={sagaForm.max_participants ?? 100}
                      onChange={(e) =>
                        setSagaForm({
                          ...sagaForm,
                          max_participants: Number(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveSaga}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 transition-colors"
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
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-zinc-100">
                  {saga.title}
                </h1>
                {saga.subtitle && (
                  <p className="text-sm text-zinc-400 mt-0.5">
                    {saga.subtitle}
                  </p>
                )}
                <p className="text-sm text-zinc-500 mt-1">
                  {saga.city}, {saga.country}
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

          {/* Status toggle */}
          {!editSaga && (
            <button
              onClick={toggleStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${currentStatusConf.bg} ${currentStatusConf.text}`}
            >
              {statusLabels[saga.status]}
            </button>
          )}
        </div>
      </div>

      {/* Levels section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Niveles</h2>
          <button
            onClick={addLevel}
            disabled={addingLevel}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {addingLevel ? (
              <CircleNotch size={16} className="animate-spin" />
            ) : (
              <Plus size={16} weight="bold" />
            )}
            Agregar Nivel
          </button>
        </div>

        {levels.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
            <p className="text-zinc-500 text-sm">
              No hay niveles en esta saga aún
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {levels.map((level, idx) => {
              const diff = difficultyConfig[level.difficulty];
              const isExpanded = expandedLevel === level.id;

              return (
                <div
                  key={level.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
                >
                  {/* Level header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-zinc-600 shrink-0">
                      {isExpanded ? (
                        <CaretDown size={16} />
                      ) : (
                        <CaretRight size={16} />
                      )}
                    </span>
                    <span className="text-sm font-mono text-zinc-500 shrink-0">
                      #{level.number}
                    </span>
                    <span className="text-sm font-medium text-zinc-200 flex-1 truncate">
                      {level.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${diff.bg} ${diff.text}`}
                    >
                      {diff.label}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLevel(level.id, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLevel(level.id, "down");
                        }}
                        disabled={idx === levels.length - 1}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </button>

                  {/* Level editor */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800 p-5 space-y-4">
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
                        <label className={labelClass}>Pista</label>
                        <textarea
                          value={levelForm.clue_text ?? ""}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              clue_text: e.target.value,
                            })
                          }
                          rows={3}
                          className={inputClass}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Pista adicional</label>
                        <textarea
                          value={levelForm.hint ?? ""}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              hint: e.target.value,
                            })
                          }
                          rows={2}
                          className={inputClass}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Dificultad</label>
                        <select
                          value={levelForm.difficulty ?? "medium"}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              difficulty: e.target.value as Level["difficulty"],
                            })
                          }
                          className={inputClass}
                        >
                          <option value="easy">Fácil</option>
                          <option value="medium">Media</option>
                          <option value="hard">Difícil</option>
                          <option value="extreme">Extrema</option>
                        </select>
                      </div>

                      {/* Spawn coords */}
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                          Coordenadas de inicio
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className={labelClass}>Lat</label>
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
                            <label className={labelClass}>Lng</label>
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
                            <label className={labelClass}>Heading</label>
                            <input
                              type="number"
                              step="any"
                              value={levelForm.spawn_heading ?? 0}
                              onChange={(e) =>
                                setLevelForm({
                                  ...levelForm,
                                  spawn_heading: Number(e.target.value),
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Pitch</label>
                            <input
                              type="number"
                              step="any"
                              value={levelForm.spawn_pitch ?? 0}
                              onChange={(e) =>
                                setLevelForm({
                                  ...levelForm,
                                  spawn_pitch: Number(e.target.value),
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Target coords */}
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                          Coordenadas objetivo
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Lat</label>
                            <input
                              type="number"
                              step="any"
                              value={levelForm.target_lat ?? 0}
                              onChange={(e) =>
                                setLevelForm({
                                  ...levelForm,
                                  target_lat: Number(e.target.value),
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Lng</label>
                            <input
                              type="number"
                              step="any"
                              value={levelForm.target_lng ?? 0}
                              onChange={(e) =>
                                setLevelForm({
                                  ...levelForm,
                                  target_lng: Number(e.target.value),
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Proximity radius */}
                      <div>
                        <label className={labelClass}>
                          Radio de proximidad:{" "}
                          {levelForm.proximity_radius_m ?? 100}m
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={500}
                          step={10}
                          value={levelForm.proximity_radius_m ?? 100}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              proximity_radius_m: Number(e.target.value),
                            })
                          }
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-xs text-zinc-600 mt-1">
                          <span>50m</span>
                          <span>500m</span>
                        </div>
                      </div>

                      {/* Correct answers */}
                      <div>
                        <label className={labelClass}>
                          Respuestas correctas (separadas por comas)
                        </label>
                        <input
                          type="text"
                          value={(levelForm.correct_answers ?? []).join(", ")}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              correct_answers: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="respuesta1, respuesta2"
                          className={inputClass}
                        />
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className={labelClass}>Explicación</label>
                        <textarea
                          value={levelForm.explanation ?? ""}
                          onChange={(e) =>
                            setLevelForm({
                              ...levelForm,
                              explanation: e.target.value,
                            })
                          }
                          rows={2}
                          className={inputClass}
                          style={{ resize: "vertical" }}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={saveLevel}
                          disabled={savingLevel}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 transition-colors"
                        >
                          {savingLevel ? (
                            <CircleNotch
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <FloppyDisk size={16} weight="bold" />
                          )}
                          Guardar
                        </button>
                        <button
                          onClick={() => deleteLevel(level.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-900 text-red-400 text-sm font-medium hover:bg-red-950 transition-colors"
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
