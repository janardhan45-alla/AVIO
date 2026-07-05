import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with reasonable limit for base64 camera images
  app.use(express.json({ limit: "15mb" }));

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Helper to execute Gemini requests with a backup/fallback model in case of rate limits or transient errors
  async function generateContentWithFallback(contents: any, config: any) {
    if (!ai) {
      throw new Error("Gemini API is not configured on the server.");
    }

    const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Gemini] Attempting content generation with model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: config,
        });
        return response;
      } catch (err: any) {
        console.warn(`[Gemini] Model ${model} failed with error:`, err);
        lastError = err;
        // Proceed to try next model in the list
      }
    }

    throw lastError;
  }

  // Endpoint to classify user transcript into one of the 6 protocols or OTHER
  app.post("/api/gemini/classify", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text transcript is required" });
      }

      const prompt = `Classify this spoken emergency transcript: "${text}". You must choose from exactly one of these categories: HEART_ATTACK, SNAKEBITE, BLEEDING, SEIZURE, DROWNING, ELECTRIC_SHOCK, or OTHER. Respond in JSON.`;

      const response = await generateContentWithFallback(
        prompt,
        {
          systemInstruction: "You are a professional medical emergency classifier. Classify the user input transcript. Choose only from the exact categories: HEART_ATTACK, SNAKEBITE, BLEEDING, SEIZURE, DROWNING, ELECTRIC_SHOCK, or OTHER. Respond with a JSON object containing a single key 'category'.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "The classified emergency category. Must be exactly one of: HEART_ATTACK, SNAKEBITE, BLEEDING, SEIZURE, DROWNING, ELECTRIC_SHOCK, or OTHER."
              }
            },
            required: ["category"]
          }
        }
      );

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      const category = result.category ? result.category.toUpperCase() : "OTHER";

      const validCategories = ["HEART_ATTACK", "SNAKEBITE", "BLEEDING", "SEIZURE", "DROWNING", "ELECTRIC_SHOCK"];
      const validatedCategory = validCategories.includes(category) ? category : "OTHER";

      return res.json({ category: validatedCategory });
    } catch (err: any) {
      console.error("Classification API error:", err);
      return res.status(500).json({ error: err.message || "Failed to classify transcript" });
    }
  });

  // Endpoint to scan a medication blister pack and check it against the user's profile
  app.post("/api/gemini/scan-medication", async (req, res) => {
    try {
      const { image, profile } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image data is required" });
      }

      let base64Data = image;
      let mimeType = "image/jpeg";
      if (image.includes(";base64,")) {
        const parts = image.split(";base64,");
        mimeType = parts[0].replace("data:", "");
        base64Data = parts[1];
      }

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data
        }
      };

      const userProfileDesc = profile ? `
Here is the patient's saved profile to check against:
- Age: ${profile.ageYears || 'Not specified'} years
- Biological Sex: ${profile.biologicalSex || 'Not specified'}
- Blood Group: ${profile.bloodGroup || 'Not specified'}
- Chronic Conditions: ${profile.chronicConditions && profile.chronicConditions.length > 0 ? profile.chronicConditions.join(", ") : "None reported"}
- Known Allergies: ${profile.knownAllergies && profile.knownAllergies.length > 0 ? profile.knownAllergies.join(", ") : "None reported"}
- Current Active Medications: ${profile.activeMedications && profile.activeMedications.length > 0 ? profile.activeMedications.join(", ") : "None reported"}
` : "No patient profile has been configured yet.";

      const prompt = `Analyze the medication shown in this blister pack image.
1. Identify the 'medicationName' (brand or generic).
2. Identify 'activeIngredients' (strength if visible).
3. Cross-reference this medication against the patient's medical profile to assess safety.
Specifically, verify:
- If any 'activeIngredients' trigger the patient's 'Known Allergies'.
- If the drug is contraindicated or risky given the patient's 'Chronic Conditions'.
- If there are dangerous drug-drug interactions with their 'Current Active Medications'.

${userProfileDesc}

Provide a definitive safety verdict: "safe", "caution", or "unsafe".
Detail the reasoning (2-3 concise sentences) and state clear recommendations.
Return the output strictly matching the requested JSON schema.`;

      const response = await generateContentWithFallback(
        [imagePart, { text: prompt }],
        {
          systemInstruction: "You are a professional clinical AI pharmacist. Review medication packaging images against patient profiles to detect allergic reactions, drug interactions, and contraindications. Always err on the side of safety. Answer in the specified JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              medicationName: { type: Type.STRING, description: "Brand name or generic name of the identified drug." },
              activeIngredients: { type: Type.STRING, description: "Active chemical ingredients." },
              verdict: { type: Type.STRING, description: "Safety verdict. Must be exactly: 'safe', 'caution', or 'unsafe'." },
              reasoning: { type: Type.STRING, description: "Detailed clinical reasoning cross-referencing allergies, conditions, and drugs." },
              recommendation: { type: Type.STRING, description: "Actionable medical advice for this patient regarding this scan." }
            },
            required: ["medicationName", "activeIngredients", "verdict", "reasoning", "recommendation"]
          }
        }
      );

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      return res.json(result);
    } catch (err: any) {
      console.error("Medication Scan API error:", err);
      return res.status(500).json({ error: err.message || "Failed to scan medication blister pack" });
    }
  });

  // Serve static files in production or use Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
