import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? ""
);

/**
 * Validates a player's answer using Gemini AI.
 * Supports natural language fuzzy matching — the player doesn't need
 * to type the exact string, Gemini interprets intent.
 */
export async function validateAnswerWithAI(
  playerAnswer: string,
  correctAnswer: string,
  clueContext: string
): Promise<{ isCorrect: boolean; confidence: number; reasoning: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are the game master of UBEX, a geo-exploration treasure hunt.
A player explored Google Street View and submitted an answer to a clue.

CLUE: "${clueContext}"
CORRECT ANSWER: "${correctAnswer}"
PLAYER'S ANSWER: "${playerAnswer}"

Evaluate if the player's answer matches the correct answer. Consider:
- Typos and minor spelling variations
- Equivalent formats (e.g., "+54 11 1234-5678" vs "5411 12345678")
- Language variations (Spanish/English/Portuguese)

Respond ONLY in JSON format:
{
  "isCorrect": boolean,
  "confidence": number (0-1),
  "reasoning": "brief explanation"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]);
  } catch {
    // Fallback to exact match if AI fails
    const isCorrect =
      playerAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    return { isCorrect, confidence: isCorrect ? 1 : 0, reasoning: "Exact match fallback" };
  }
}

/**
 * Generates a dynamic riddle based on a location using Gemini AI.
 */
export async function generateRiddle(
  locationDescription: string,
  difficulty: "easy" | "medium" | "hard" | "extreme"
): Promise<{ riddle: string; answer: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are UBEX Game Master. Create a ${difficulty} treasure hunt clue.
The player must explore Google Street View at this location: "${locationDescription}"
and find a specific visual detail (phone number, sign text, building color, street name, etc.).

Create a cryptic but solvable clue. Respond in JSON:
{
  "riddle": "the clue text shown to the player",
  "answer": "the exact data they must find"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to generate riddle");
  return JSON.parse(jsonMatch[0]);
}
