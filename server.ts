import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI features will fall back.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Procedural Loot Generation API
app.post("/api/generate-loot", async (req, res) => {
  try {
    const ai = getAi();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured on the server." });
    }

    const { level, forceRarity } = req.body;
    const playerLevel = Number(level) || 1;

    // Roll rarity if not forced
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    let rarity = forceRarity;
    if (!rarity) {
      const roll = Math.random() * 100;
      if (roll < 2) rarity = 'Legendary';
      else if (roll < 7) rarity = 'Epic';
      else if (roll < 18) rarity = 'Rare';
      else if (roll < 45) rarity = 'Uncommon';
      else rarity = 'Common';
    }

    const prompt = `Generate a creative procedurally generated item for a retro roguelike RPG game called 'BitCrawler'. 
The item should be scaled for a player at level ${playerLevel} with rarity level: '${rarity}'.
Choose one of the following item types randomly: 'helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'.
Choose a highly creative thematic retro name, appropriate RPG stats (only include positive integer modifiers that match the level and rarity, e.g. level ${playerLevel} Legendary weapon might have strong strength or crit stats, boots should have agility, offhand should have defense or maxHp, etc. Keep values balanced), an atmospheric description, and a single matching emojis character.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Highly creative name of the item, e.g. 'Glacial Scepter of Eternity', 'Gravekeeper Pauldrons'" },
            type: { type: Type.STRING, description: "Must be exactly one of: 'helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'" },
            rarity: { type: Type.STRING, description: "Must be exactly: 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'" },
            stats: {
              type: Type.OBJECT,
              properties: {
                strength: { type: Type.INTEGER, description: "Melee strike impact boost" },
                intellect: { type: Type.INTEGER, description: "Spell damage focus boost" },
                agility: { type: Type.INTEGER, description: "Stealth/evasion speed boost" },
                defense: { type: Type.INTEGER, description: "Shield blocking boost" },
                maxHp: { type: Type.INTEGER, description: "Maximum health pool boost" },
                critChance: { type: Type.INTEGER, description: "Critical hit rate multiplier boost" },
                luck: { type: Type.INTEGER, description: "Scavenging luck boost" },
                meleeBonus: { type: Type.INTEGER, description: "Melee damage absolute bonus" },
                defenseBonus: { type: Type.INTEGER, description: "Physical absorption bonus" },
                arcaneBonus: { type: Type.INTEGER, description: "Spellpower absolute bonus" }
              }
            },
            description: { type: Type.STRING, description: "A highly atmospheric, short lore text flavor description under 15 words" },
            icon: { type: Type.STRING, description: "A single matching emoji representing this item" }
          },
          required: ["name", "type", "rarity", "stats", "description", "icon"]
        }
      }
    });

    const lootData = JSON.parse(response.text?.trim() || "{}");
    
    // Guarantee type correctness
    if (!['helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'].includes(lootData.type)) {
      lootData.type = 'weapon';
    }
    lootData.rarity = rarity;

    // Scale gold value appropriately
    const rarityMultiplier: Record<string, number> = {
      Common: 1.0,
      Uncommon: 1.4,
      Rare: 2.0,
      Epic: 3.0,
      Legendary: 5.0
    };
    const mult = (rarityMultiplier[rarity] || 1.0) * (1 + (playerLevel - 1) * 0.1);
    lootData.goldValue = Math.round(20 * mult * (1 + Math.random() * 0.5));
    lootData.id = 'ai_item_' + Math.random().toString(36).substring(2, 9);
    lootData.isAiGenerated = true;

    res.json(lootData);
  } catch (error: any) {
    const errString = error?.message || error?.toString() || JSON.stringify(error) || "";
    if (errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("429") || error?.status === "RESOURCE_EXHAUSTED" || error?.status === 429) {
      console.warn("AI Loot Generation: Quota exceeded (RESOURCE_EXHAUSTED). Falling back.");
      return res.status(429).json({ error: "Gemini API rate limit reached. Falling back to local procedural items." });
    }
    console.error("Loot generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI loot." });
  }
});

// 2. Procedural Enemy Generation API
app.post("/api/generate-enemy", async (req, res) => {
  try {
    const ai = getAi();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured on the server." });
    }

    const { level, isBoss } = req.body;
    const playerLevel = Number(level) || 1;

    // Define rarities for AI enemies
    const enemyRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    let rarity = 'Common';
    if (isBoss) {
      rarity = 'Legendary';
    } else {
      const roll = Math.random() * 100;
      if (roll < 4) rarity = 'Epic';
      else if (roll < 15) rarity = 'Rare';
      else if (roll < 40) rarity = 'Uncommon';
    }

    const prompt = `Generate a highly unique and thematic enemy creature for a retro roguelike RPG game called 'BitCrawler'. 
The enemy level is ${playerLevel} and rarity state is '${rarity}'. ${isBoss ? 'This creature is an elite BOSS, so make it sound extremely dangerous and epic!' : ''}
Invent a highly creative name, a single matching icon emoji, and 2-3 short combat abilities with brief explanations (e.g. 'Frost Bite (inflicts chill status)'). Include a very short thematic bio description.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the enemy creature, e.g. 'Void-Spawned Chimera', 'Tomb Sentinel'" },
            abilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 short abilities, each as a string, e.g. 'Shadow strike (attacks from shadows)', 'Siphon focus (drains player mana)'"
            },
            description: { type: Type.STRING, description: "A brief, highly atmospheric 1-sentence description of the creature's lore" },
            icon: { type: Type.STRING, description: "A single matching emoji representing the creature" }
          },
          required: ["name", "abilities", "description", "icon"]
        }
      }
    });

    const enemyData = JSON.parse(response.text?.trim() || "{}");
    
    // Scale stats according to game formulas to preserve balance
    let enemyLevel = playerLevel + Math.floor(Math.random() * 3) - 1;
    if (isBoss) {
      enemyLevel = playerLevel + 3;
    }
    if (enemyLevel < 1) enemyLevel = 1;

    const hpBase = 25 + enemyLevel * 12 + Math.pow(enemyLevel, 1.4) * 4;
    const dmgBase = 6 + enemyLevel * 2.5 + Math.pow(enemyLevel, 1.2) * 0.8;
    const defBase = enemyLevel * 1.2 + Math.pow(enemyLevel, 1.1) * 0.4;

    // Rarity scalars for stats
    const rarityMultiplier: Record<string, number> = {
      Common: 0.9,
      Uncommon: 1.1,
      Rare: 1.4,
      Epic: 1.8,
      Legendary: 2.5
    };
    const mult = rarityMultiplier[rarity] || 1.0;

    enemyData.level = enemyLevel;
    enemyData.hp = Math.round(hpBase * mult);
    enemyData.maxHp = enemyData.hp;
    enemyData.damage = Math.round(dmgBase * mult);
    enemyData.defense = Math.round(defBase * mult);
    enemyData.xpReward = Math.round((20 + enemyLevel * 8 + Math.pow(enemyLevel, 1.3) * 3) * (isBoss ? 2.5 : 1) * mult);
    enemyData.goldValue = Math.round((10 + enemyLevel * 4 + Math.random() * (enemyLevel * 4)) * (isBoss ? 3.0 : 1) * mult);
    enemyData.isAiGenerated = true;
    enemyData.rarity = rarity;

    if (isBoss) {
      enemyData.name = enemyData.name + " (BOSS 👑)";
    }

    res.json(enemyData);
  } catch (error: any) {
    const errString = error?.message || error?.toString() || JSON.stringify(error) || "";
    if (errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("429") || error?.status === "RESOURCE_EXHAUSTED" || error?.status === 429) {
      console.warn("AI Enemy Generation: Quota exceeded (RESOURCE_EXHAUSTED). Falling back.");
      return res.status(429).json({ error: "Gemini API rate limit reached. Falling back to local procedural enemies." });
    }
    console.error("Enemy generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI enemy." });
  }
});

// 3. Pixel Art Sprite Generation API (Uses Paid model gemini-2.5-flash-image)
app.post("/api/generate-sprite", async (req, res) => {
  try {
    const ai = getAi();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured on the server." });
    }

    const { name, description, isEnemy } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required for sprite generation." });
    }

    const prompt = isEnemy
      ? `A retro 2D pixel art battle sprite of the creature '${name}' (${description || ""}), official pokémon style, sharp and crisp pixelated outlines, clean colors, vibrant and well shaded, centered game asset, solid black background, Gameboy Advance / GBA sprite art.`
      : `A retro 2D pixel art sprite of the item '${name}' (${description || ""}), iconic pokémon item / accessory style, sharp and crisp pixelated black outlines, clean colors, vibrant and beautiful, centered game asset, solid black background, Gameboy Advance / GBA sprite art.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      },
    });

    let base64Image = null;
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      return res.status(500).json({ error: "No image payload returned from model candidates." });
    }

    res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    const errString = error?.message || error?.toString() || JSON.stringify(error) || "";
    if (errString.includes("quota") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("429") || error?.status === "RESOURCE_EXHAUSTED" || error?.status === 429) {
      console.warn("AI Sprite Generation: Quota exceeded (RESOURCE_EXHAUSTED). Falling back.");
      return res.status(429).json({ error: "Gemini Image API is resting (Quota limit hit). Try again soon!" });
    }
    console.error("Sprite generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate pixel art sprite." });
  }
});

// Mount Vite middleware for SPA and dev mode asset loading
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
