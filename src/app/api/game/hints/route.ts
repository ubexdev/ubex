import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const HINT_INTENSITY: Record<number, string> = {
  1: "Muy sutil e indirecta. No menciones la respuesta ni sinónimos directos. Da una pista sobre la categoría o época general.",
  2: "Moderadamente útil. Puedes mencionar características específicas del lugar/objeto, pero NO la respuesta directa.",
  3: "Bastante directa. Puedes dar iniciales, número de palabras, o una descripción muy específica, pero NO digas la respuesta exacta.",
};

const FALLBACK_HINTS: Record<number, string> = {
  1: "Señal débil detectada. Explora los alrededores con atención.",
  2: "Datos parciales recuperados. El objetivo está cerca de un punto de referencia conocido.",
  3: "Señal fuerte. Revisa los nombres visibles en tu entorno inmediato.",
};

/** POST /api/game/hints — Generate a contextual Gemini-powered hint. */
export async function POST(req: NextRequest) {
  let hintLevel = 1;

  try {
    const body = await req.json();
    const {
      clue_text,
      answer,
      city,
      country,
      hint_level = 1,
      existing_hints = [],
    } = body as {
      clue_text?: string;
      answer?: string;
      city?: string;
      country?: string;
      hint_level?: number;
      existing_hints?: string[];
    };

    hintLevel = hint_level;

    if (!clue_text || !answer) {
      return NextResponse.json(
        { error: "clue_text and answer are required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const existingHintsText =
      existing_hints.length > 0
        ? `\n\nPistas ya mostradas (NO las repitas):\n${existing_hints.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
        : "";

    const prompt = `Eres el sistema de radar de UBEX, una plataforma de arqueología digital donde exploradores resuelven enigmas geoespaciales navegando por ciudades reales en Google Street View.

Un explorador está atascado en una misión en ${city ?? "una ciudad"}, ${country ?? "un país desconocido"}.

Enigma de la misión:
"${clue_text}"

La respuesta correcta es: "${answer}" (NUNCA reveles esta respuesta directamente)

Nivel de ayuda: ${hintLevel}/3
Instrucción: ${HINT_INTENSITY[hintLevel] ?? HINT_INTENSITY[1]}
${existingHintsText}

Genera UNA sola señal de radar (pista) en español.
- Máximo 2 oraciones
- Usa vocabulario de exploración/arqueología digital
- Sé útil pero no arruines el descubrimiento
- NO uses emojis
- NO menciones que eres una IA
- Habla como un sistema de inteligencia satelital`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text().trim();

    return NextResponse.json({ hint, hint_level: hintLevel });
  } catch (error) {
    console.error("Gemini hint error:", error);

    return NextResponse.json({
      hint: FALLBACK_HINTS[hintLevel] ?? FALLBACK_HINTS[1],
      hint_level: hintLevel,
    });
  }
}
