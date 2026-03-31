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
  MapPin,
  CalendarBlank,
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

    try {
      const { data, error: err } = await supabase
        .from("sagas")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setSagas((data ?? []) as unknown as Saga[]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando sagas");
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
            Sagas
          </h1>
          <p className="text-zinc-500 mt-2">
            Gestiona las aventuras de UBEX
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportAllSagas}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
            style={{ minHeight: 48 }}
          >
            <Export size={18} />
            Exportar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            style={{ minHeight: 48 }}
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
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 transition-colors shadow-lg shadow-amber-600/20"
            style={{ minHeight: 48 }}
          >
            <Plus size={20} weight="bold" />
            Crear Saga
          </Link>
        </div>
      </div>

      {/* Search + count */}
      {!loading && sagas.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o ciudad..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-12 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition-colors"
            />
          </div>
          <p className="text-sm text-zinc-500 pl-1">
            {filtered.length}{" "}
            {filtered.length === 1 ? "saga encontrada" : "sagas encontradas"}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950 px-6 py-4 text-sm text-red-300 flex items-center gap-3">
          <Warning size={20} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <CircleNotch size={36} className="text-zinc-600 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sagas.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-20 text-center">
          <MapTrifold
            size={48}
            weight="duotone"
            className="mx-auto text-zinc-700"
          />
          <p className="mt-4 text-zinc-400 font-medium">
            No hay sagas creadas aún
          </p>
          <p className="mt-2 text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
            Las sagas son aventuras urbanas que guían a los exploradores por
            diferentes ciudades. Crea tu primera saga para comenzar.
          </p>
          <Link
            href="/admin/sagas/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Plus size={18} />
            Crear tu primera saga
          </Link>
        </div>
      )}

      {/* No results */}
      {!loading && sagas.length > 0 && filtered.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <MagnifyingGlass size={36} className="mx-auto text-zinc-700" />
          <p className="mt-3 text-zinc-400 font-medium">Sin resultados</p>
          <p className="mt-1 text-sm text-zinc-600">
            No se encontraron sagas para &ldquo;{search}&rdquo;
          </p>
        </div>
      )}

      {/* Sagas grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((saga) => {
            const diff =
              difficultyConfig[saga.difficulty] ?? difficultyConfig.medium;
            return (
              <button
                key={saga.id}
                onClick={() => router.push(`/admin/sagas/${saga.id}`)}
                className="text-left rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 hover:scale-[1.01] hover:shadow-xl hover:shadow-zinc-950/60 transition-all duration-200 group"
              >
                {/* Cover image placeholder */}
                <div
                  className="w-full bg-zinc-800 flex items-center justify-center"
                  style={{ height: "120px" }}
                >
                  {saga.cover_image_url ? (
                    <img
                      src={saga.cover_image_url}
                      alt={saga.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapTrifold
                      size={36}
                      weight="duotone"
                      className="text-zinc-600"
                    />
                  )}
                </div>

                {/* Card content */}
                <div className="px-6 py-5">
                  {/* Title + badges row */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-zinc-100 text-lg leading-snug group-hover:text-amber-500 transition-colors line-clamp-1">
                      {saga.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {saga.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300">
                          <Star size={14} weight="fill" />
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${diff.bg} ${diff.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}
                        />
                        {diff.label}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-zinc-500 mt-2 flex items-center gap-1.5">
                    <MapPin size={14} className="shrink-0 text-zinc-600" />
                    {saga.city}, {saga.country}
                  </p>

                  {/* Description */}
                  {saga.description && (
                    <p className="text-sm text-zinc-600 mt-3 line-clamp-3 leading-relaxed">
                      {saga.description}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-5 mt-5 text-sm text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <ListNumbers size={16} />
                      {saga.total_levels} misiones
                    </span>
                    {saga.estimated_duration && (
                      <span className="inline-flex items-center gap-1.5">
                        <Timer size={16} />
                        {saga.estimated_duration} min
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Lightning size={16} />
                      {saga.is_active ? (
                        <span className="text-emerald-400">Activa</span>
                      ) : (
                        <span className="text-zinc-600">Inactiva</span>
                      )}
                    </span>
                  </div>

                  {/* Date row — separated */}
                  <div className="mt-5 pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                      <CalendarBlank size={14} />
                      {new Date(saga.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
