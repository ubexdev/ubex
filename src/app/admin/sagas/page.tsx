"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  Plus,
  MapTrifold,
  CircleNotch,
  MagnifyingGlass,
  Export,
  UploadSimple,
  Star,
  Lightning,
  Timer,
  ListNumbers,
  Warning,
} from "@phosphor-icons/react";

type Saga = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  country: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  is_active: boolean;
  is_featured: boolean;
  total_levels: number;
  estimated_duration: number | null;
  cover_image_url: string | null;
  created_at: string;
};

const difficultyConfig = {
  easy: {
    label: "Fácil",
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/10",
    text: "text-emerald-300",
  },
  medium: {
    label: "Media",
    dot: "bg-amber-400",
    bg: "bg-amber-400/10",
    text: "text-amber-300",
  },
  hard: {
    label: "Difícil",
    dot: "bg-orange-400",
    bg: "bg-orange-400/10",
    text: "text-orange-300",
  },
  expert: {
    label: "Experto",
    dot: "bg-red-400",
    bg: "bg-red-400/10",
    text: "text-red-300",
  },
};

export default function SagasPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadSagas();
  }, []);

  async function loadSagas() {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase no configurado");
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from("sagas")
      .select(
        "id, title, description, city, country, difficulty, is_active, is_featured, total_levels, estimated_duration, cover_image_url, created_at"
      )
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setSagas((data ?? []) as unknown as Saga[]);
    }
    setLoading(false);
  }

  async function exportAllSagas() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const { data: allSagas } = await supabase
      .from("sagas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!allSagas) return;

    const sagaIds = allSagas.map((s: { id: string }) => s.id);
    const { data: allLevels } = await supabase
      .from("levels")
      .select("*")
      .in("saga_id", sagaIds)
      .order("level_number", { ascending: true });

    const exportData = allSagas.map((saga: { id: string }) => ({
      ...saga,
      levels: (allLevels ?? []).filter(
        (l: { saga_id: string }) => l.saga_id === saga.id
      ),
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ubex-sagas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      const sagaArray = Array.isArray(imported) ? imported : [imported];

      for (const sagaData of sagaArray) {
        const { levels: lvls, id: _id, created_at: _ca, updated_at: _ua, ...sagaFields } = sagaData;

        const { data: newSaga, error: sErr } = await supabase
          .from("sagas")
          .insert({ ...sagaFields, is_active: false } as any)
          .select("id")
          .single();

        if (sErr || !newSaga) continue;

        if (Array.isArray(lvls) && lvls.length > 0) {
          const levelInserts = lvls.map(
            (l: { id?: string; saga_id?: string; created_at?: string; [key: string]: unknown }) => {
              const { id: _lid, saga_id: _lsid, created_at: _lca, ...levelFields } = l;
              return { ...levelFields, saga_id: newSaga.id };
            }
          );
          await supabase.from("levels").insert(levelInserts as any);
        }
      }

      await loadSagas();
    } catch {
      setError("Error importando archivo JSON");
    }

    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const filtered = sagas.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Sagas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestiona las aventuras de UBEX
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportAllSagas}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Export size={18} />
            Exportar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {importing ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <UploadSimple size={18} />
            )}
            Importar
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <Link
            href="/admin/sagas/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 transition-colors"
          >
            <Plus size={18} weight="bold" />
            Crear Saga
          </Link>
        </div>
      </div>

      {/* Search */}
      {!loading && sagas.length > 0 && (
        <div className="relative">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o ciudad..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
          <Warning size={18} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <CircleNotch size={32} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sagas.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <MapTrifold
            size={40}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-3 text-zinc-500 text-sm">
            No hay sagas creadas aún
          </p>
          <Link
            href="/admin/sagas/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Plus size={16} />
            Crear tu primera saga
          </Link>
        </div>
      )}

      {/* No results */}
      {!loading && sagas.length > 0 && filtered.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
          <MagnifyingGlass size={32} className="mx-auto text-zinc-700" />
          <p className="mt-2 text-zinc-500 text-sm">
            Sin resultados para &ldquo;{search}&rdquo;
          </p>
        </div>
      )}

      {/* Sagas grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((saga) => {
            const diff = difficultyConfig[saga.difficulty] ?? difficultyConfig.medium;
            return (
              <button
                key={saga.id}
                onClick={() => router.push(`/admin/sagas/${saga.id}`)}
                className="text-left rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-zinc-100 text-base group-hover:text-amber-500 transition-colors truncate">
                    {saga.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {saga.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300">
                        <Star size={12} weight="fill" />
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${diff.bg} ${diff.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}
                      />
                      {diff.label}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-500 mt-1">
                  {saga.city}, {saga.country}
                </p>

                {saga.description && (
                  <p className="text-xs text-zinc-600 mt-2 line-clamp-2">
                    {saga.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <ListNumbers size={14} />
                    {saga.total_levels} niveles
                  </span>
                  {saga.estimated_duration && (
                    <span className="inline-flex items-center gap-1">
                      <Timer size={14} />
                      {saga.estimated_duration} min
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Lightning size={14} />
                    {saga.is_active ? (
                      <span className="text-emerald-400">Activa</span>
                    ) : (
                      <span className="text-zinc-600">Inactiva</span>
                    )}
                  </span>
                </div>

                <p className="text-xs text-zinc-700 mt-2">
                  {new Date(saga.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
