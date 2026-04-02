import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const DIFFICULTY_GUIDE: Record<string, string> = {
  easy: "Pistas directas con nombres casi completos. Respuestas son lugares muy conocidos y turísticos. Radio de proximidad 300m.",
  medium:
    "Pistas con contexto histórico que requieren deducción. Mezcla de lugares conocidos y menos obvios. Radio de proximidad 200m.",
  hard: "Pistas crípticas que requieren conocimiento cultural profundo. Incluye lugares poco conocidos. Radio de proximidad 100m.",
};

interface GenerateSagaBody {
  city: string;
  country: string;
  theme?: string;
  difficulty?: string;
  num_levels?: number;
}

interface GeneratedLevel {
  level_number?: number;
  title?: string;
  description?: string;
  clue?: string;
  answer?: string;
  spawn_lat?: number;
  spawn_lng?: number;
  target_lat?: number;
  target_lng?: number;
  proximity_radius?: number;
  points?: number;
  time_limit?: number | null;
  hints?: string[];
}

interface GeneratedSaga {
  saga?: {
    title?: string;
    description?: string;
    estimated_duration?: number;
  };
  levels?: GeneratedLevel[];
}

/** POST /api/game/generate-saga — Generate a complete UBEX saga with Gemini AI. */
export async function POST(req: NextRequest) {
  let requestData = { city: "", country: "" };

  try {
    const body = (await req.json()) as GenerateSagaBody;
    const {
      city,
      country,
      theme = "historia y cultura",
      difficulty = "medium",
      num_levels = 12,
    } = body;

    requestData = { city, country };

    if (!city || !country) {
      return NextResponse.json(
        { error: "city y country son obligatorios" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyDesc = DIFFICULTY_GUIDE[difficulty] ?? DIFFICULTY_GUIDE.medium;

    const prompt = `Eres un diseñador de misiones para UBEX, una plataforma de arqueología digital donde exploradores navegan ciudades reales en Google Street View para resolver enigmas geoespaciales.

Genera una saga completa de ${num_levels} misiones ambientada en ${city}, ${country}.
Tema: ${theme}
Dificultad: ${difficulty} — ${difficultyDesc}

REGLAS CRÍTICAS:
1. Cada misión debe tener coordenadas GPS REALES y PRECISAS de ${city}
2. Las coordenadas spawn (inicio) deben estar a 100-500 metros del objetivo, EN UNA CALLE con cobertura Street View
3. Las coordenadas target (objetivo) deben ser del LUGAR EXACTO de la respuesta, EN UNA CALLE con cobertura Street View
4. Las respuestas deben ser nombres de lugares, monumentos, calles, edificios o puntos de interés REALES
5. Las pistas deben ser enigmas narrativos, NO preguntas directas
6. Cada misión debe tener 2-3 señales de radar (pistas adicionales) progresivas
7. Las misiones deben formar un recorrido geográfico lógico por la ciudad

REGLA DE ORO — ACCESIBILIDAD DESDE STREET VIEW:
8. TODAS las respuestas y pistas DEBEN ser identificables DESDE LA CALLE usando Google Street View
9. PROHIBIDO preguntar sobre:
   - Interiores de edificios, iglesias, museos o cualquier espacio cerrado (NO hay Street View interior)
   - Playas, senderos, parques interiores o zonas naturales sin cobertura vial
   - Objetos dentro de edificios (lámparas, cuadros, reliquias, etc.)
   - Detalles que solo se ven entrando a un lugar (patios interiores, altares, etc.)
   - Zonas marítimas, islas sin acceso por carretera, o coordenadas en el agua
10. PERMITIDO preguntar sobre:
   - Fachadas de edificios visibles desde la calle
   - Estatuas, monumentos y esculturas en plazas o calles
   - Nombres de calles, avenidas y plazas (visibles en señalización)
   - Arcos, columnas, torres y elementos arquitectónicos exteriores
   - Letreros, carteles y señalización visible desde la acera
   - Puentes, fuentes, murallas y estructuras al aire libre
   - Edificios emblemáticos identificables por su fachada
11. Las coordenadas DEBEN estar en calles principales con cobertura Street View verificada. Prefiere avenidas, plazas centrales, y zonas turísticas emblemáticas
12. Tanto spawn como target DEBEN estar sobre asfalto/acera, NUNCA en agua, arena, o terreno sin carretera

Responde EXCLUSIVAMENTE con un JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:

{
  "saga": {
    "title": "Título narrativo de la saga",
    "description": "Descripción de 2-3 oraciones sobre la temática",
    "estimated_duration": 90
  },
  "levels": [
    {
      "level_number": 1,
      "title": "Nombre corto de la misión",
      "description": "Contexto narrativo de 1 oración",
      "clue": "Enigma/pista principal de 2-3 oraciones con contexto histórico/cultural",
      "answer": "Nombre del Lugar Real",
      "spawn_lat": 18.4730,
      "spawn_lng": -69.8830,
      "target_lat": 18.4719,
      "target_lng": -69.8823,
      "proximity_radius": 200,
      "points": 100,
      "time_limit": null,
      "hints": ["Pista sutil nivel 1", "Pista moderada nivel 2", "Pista casi directa nivel 3"]
    }
  ]
}

IMPORTANTE:
- Genera EXACTAMENTE ${num_levels} misiones
- Todas las coordenadas deben estar dentro de ${city}, ${country}
- La respuesta debe ser SOLO el JSON, sin ningún texto antes o después
- Los puntos (points) deben ir de 100 (misión 1) a 200 (última misión) progresivamente`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Strip markdown code fences Gemini occasionally wraps around JSON
    let cleanJson = responseText;
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const generated: GeneratedSaga = JSON.parse(cleanJson);

    // Validate top-level structure
    if (
      !generated.saga ||
      !generated.levels ||
      !Array.isArray(generated.levels)
    ) {
      throw new Error("Estructura de respuesta IA inválida");
    }

    // Enrich saga metadata with original request data
    const saga = {
      title: generated.saga.title ?? `Saga de ${city}`,
      description: generated.saga.description ?? "",
      city,
      country,
      difficulty,
      estimated_duration: generated.saga.estimated_duration ?? 90,
    };

    // Normalise every level with safe defaults
    const levels = generated.levels.map((level: GeneratedLevel, idx: number) => ({
      level_number: level.level_number ?? idx + 1,
      title: level.title ?? `Misión ${idx + 1}`,
      description: level.description ?? "",
      clue: level.clue ?? "",
      answer: level.answer ?? "",
      answer_type: "text" as const,
      spawn_lat: typeof level.spawn_lat === "number" ? level.spawn_lat : 0,
      spawn_lng: typeof level.spawn_lng === "number" ? level.spawn_lng : 0,
      target_lat: typeof level.target_lat === "number" ? level.target_lat : 0,
      target_lng: typeof level.target_lng === "number" ? level.target_lng : 0,
      proximity_radius: level.proximity_radius ?? 200,
      points: level.points ?? 100,
      time_limit: level.time_limit ?? null,
      hints: Array.isArray(level.hints) ? level.hints : [],
    }));

    return NextResponse.json({ saga, levels });
  } catch (error) {
    console.error("Error generando saga:", requestData.city, requestData.country, error);
    return NextResponse.json(
      {
        error: `Error generando saga: ${error instanceof Error ? error.message : "Error desconocido"}`,
      },
      { status: 500 },
    );
  }
}
