"use client";

import { useState } from "react";

interface AnswerInputProps {
  levelNumber: number;
  isLocked: boolean;
  onSubmit: (answer: string) => Promise<void>;
}

export default function AnswerInput({
  levelNumber,
  isLocked,
  onSubmit,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || submitting || isLocked) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      await onSubmit(answer.trim());
      setFeedback({
        type: "success",
        message: "[SINCRONIZACIÓN EXITOSA] Avanzas a la siguiente misión.",
      });
      setAnswer("");
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Respuesta incorrecta. Has sido eliminado.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-white mb-3">
        Misión {levelNumber} — Ingresa el dato
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ingresa el dato exacto..."
          disabled={isLocked || submitting}
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLocked || submitting || !answer.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "..." : "ENVIAR"}
        </button>
      </form>

      {feedback && (
        <p
          className={`mt-3 text-sm font-medium ${
            feedback.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
