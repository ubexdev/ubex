const fs = require("fs");
const path = require("path");
const envLine = fs.readFileSync("/tmp/gemini_env.txt", "utf8").trim();
const API_KEY = envLine.split("=")[1];

const OUTPUT_DIR = path.join(__dirname, "..", "public");
const ICONS_DIR = path.join(OUTPUT_DIR, "icons");

// Ensure dirs exist
[ICONS_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

const MODEL = "gemini-2.5-flash-image";

async function generateImage(prompt, filename, options = {}) {
  const { width, height } = options;
  console.log(`\n🎨 Generating: ${filename}...`);
  console.log(`   Prompt: ${prompt.slice(0, 80)}...`);
  
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            responseModalities: ["IMAGE", "TEXT"],
            temperature: 1.0
          }
        })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.log(`   ❌ Error ${res.status}:`, JSON.stringify(err).slice(0, 200));
      return false;
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);
    
    if (!imagePart) {
      console.log("   ❌ No image in response");
      const textPart = parts.find(p => p.text);
      if (textPart) console.log("   Text:", textPart.text.slice(0, 150));
      return false;
    }

    const ext = imagePart.inlineData.mimeType === "image/png" ? "png" : "webp";
    const finalName = filename.replace(/\.\w+$/, `.${ext}`);
    const outputPath = path.join(OUTPUT_DIR, finalName);
    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    fs.writeFileSync(outputPath, buffer);
    console.log(`   ✅ Saved: ${outputPath} (${(buffer.length / 1024).toFixed(1)}KB)`);
    return true;
  } catch (err) {
    console.log(`   ❌ Fetch error:`, err.message);
    return false;
  }
}

// Wait between requests to avoid rate limits
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

const IMAGES = [
  {
    filename: "icons/icon-512.png",
    prompt: `Generate an image: App icon for a game called "UBEX" — a digital archaeology treasure hunt.
Design: A minimalist satellite dish silhouette facing upward-right on a pure black (#09090b) background. 
The dish has 3 thin signal wave arcs emanating from it in amber/gold color (#d97706).
Style: Flat vector, single color (amber on black), no gradients, no shadows, no text.
The icon should be a perfect square. Clean, bold, works at small sizes.
Think NASA ground control aesthetic, not sci-fi.`
  },
  {
    filename: "og-image.png",
    prompt: `Generate an image: Social media preview card for "UBEX" digital archaeology game. Landscape format (wider than tall).
Design: Dark cinematic background (#09090b) with a very subtle satellite grid overlay in thin amber (#d97706) wireframe lines.
Center: The text "UBEX" in very large, bold, white geometric sans-serif font.
Below it: "ARQUEOLOGÍA DIGITAL" in smaller amber (#d97706) text.
Bottom third: A very subtle thin-line city skyline silhouette in dark gray.
A subtle warm amber glow emanates from behind the title.
Style: Minimal, high-tech, elegant. Dark and moody. Military/satellite aesthetic.`
  },
  {
    filename: "hud-boot-bg.png",
    prompt: `Generate an image: Futuristic satellite HUD boot screen interface background.
Pure black background (#09090b). Thin amber (#d97706) wireframe grid lines receding into perspective toward a vanishing point.
Top-left corner: small radar sweep circle outline.
Center: targeting reticle crosshair made of thin amber lines.
Bottom area: horizontal data readout bars (thin amber lines).
Scattered small dots representing satellite constellation positions.
NO TEXT anywhere. Dark, minimal, cinematic. Military satellite ground control operations aesthetic.
Wide landscape format.`
  },
  {
    filename: "splash-loading.png",
    prompt: `Generate an image: Dark minimal loading screen for a satellite-themed exploration game. Portrait format (taller than wide).
Black background (#09090b) with a single amber (#d97706) radar sweep circle in the center, like a sonar ping.
Thin concentric circles radiating outward from the center.
A small bright amber dot pulsing at the center of the circles.
Very subtle grid lines in extremely dark gray in the background.
NO TEXT. Moody, atmospheric, high-tech. Clean and minimal.`
  },
  {
    filename: "victory-bg.png",
    prompt: `Generate an image: Epic victory screen background for a digital exploration game. Landscape format.
Dark background transitioning from pure black (#09090b) at the edges to very deep dark blue in the center.
Golden amber (#d97706) light rays streaming down from above like satellite signal beams.
Scattered small geometric particles and data fragments floating in the air.
A very subtle wireframe globe outline in the background.
Triumphant but minimal atmosphere, not cluttered. NO TEXT.
Cinematic, high contrast, elegant.`
  },
  {
    filename: "icons/icon-192.png",
    prompt: `Generate an image: Small app icon for "UBEX" game, same design as a larger version.
A minimalist satellite dish silhouette on pure black (#09090b) background.
The dish is amber/gold (#d97706) color, facing upward-right.
3 thin signal wave arcs emanating from the dish.
Style: Flat vector, no gradients, no shadows, no text. Must be perfectly readable at 192x192 pixels.
Bold, simple shapes only. Square format.`
  },
  {
    filename: "favicon.png",
    prompt: `Generate an image: Tiny favicon for "UBEX" — a satellite-themed game.
Pure black square background (#09090b).
A very simple, bold satellite dish icon in amber/gold (#d97706).
The dish shape should be recognizable even at 32x32 pixels — use thick bold strokes.
Just the dish with 2 signal arcs. Nothing else.
Flat, minimal, no gradients, no text.`
  }
];

(async () => {
  console.log("🛰️  UBEX Image Generator");
  console.log(`Using model: ${MODEL}`);
  console.log(`Generating ${IMAGES.length} images...\n`);
  
  let success = 0;
  for (let i = 0; i < IMAGES.length; i++) {
    const img = IMAGES[i];
    const ok = await generateImage(img.prompt, img.filename);
    if (ok) success++;
    if (i < IMAGES.length - 1) {
      console.log("   ⏳ Waiting 3s (rate limit)...");
      await delay(3000);
    }
  }
  
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Generated ${success}/${IMAGES.length} images`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
})();
