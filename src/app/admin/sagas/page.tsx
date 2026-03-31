"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  Plus,
  MapTrifold,
  CircleNotch,
} from "@phosphor-icons/react";

type Saga = {
  id: string;
  title: string;
  city: string;
  country: string;
  status: "draft" | "active" | "completed";
  prize_amount_usd: number;
  max_participants: number;
  created_at: string;
};

const statusConfig = {
  draft: { label: "Borrador", dot: "bg-zinc-400", bg: "bg-zinc-400/10", text: "text-zinc-300" },
  active: { label: "Activa", dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  completed: { label: "Completada", dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
};

export default function SagasPage() {
  const router = useRouter();
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError("Supabase no configurado");
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from("sagas")
        .select("id, title, city, country, status, prize_amount_usd, max_participants, created_at")
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setSagas(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Sagas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestiona las aventuras de UBEX
          </p>
        </div>
        <Link
          href="/admin/sagas/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-zinc-950 text-sm font-semibold hover:bg-amber-500 transition-colors"
        >
          <Plus size={18} weight="bold" />
          Crear Saga
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
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
          <MapTrifold size={40} weight="duotone" className="mx-auto text-zinc-700" />
          <p className="mt-3 text-zinc-500 text-sm">No hay sagas creadas aún</p>
          <Link
            href="/admin/sagas/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Plus size={16} />
            Crear tu primera saga
          </Link>
        </div>
      )}

      {/* Sagas grid */}
      {!loading && sagas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sagas.map((saga) => {
            const st = statusConfig[saga.status];
            return (
              <button
                key={saga.id}
                onClick={() => router.push(`/admin/sagas/${saga.id}`)}
                className="text-left rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-zinc-100 text-base">
                    {saga.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {saga.city}, {saga.country}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-zinc-600">
                  <span>
                    ${saga.prize_amount_usd.toLocaleString("es-ES")} USD
                  </span>
                  <span>Máx. {saga.max_participants} participantes</span>
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
