import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI lazy client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Generate Paper Sections from Experiment Data
app.post("/api/generate-paper", async (req, res) => {
  try {
    const { experiment, customPrompt } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
        message: "Generated using research agent synthesis engine (API key not configured for live streaming).",
      });
    }

    const prompt = `You are a world-class academic researcher and IEEE / NeurIPS peer reviewer.
Based on the following experimental data, generate high-impact, scientifically rigorous Results and Discussion sections for a scientific paper:

Project Title: ${experiment?.title || "Transformer Charging Load Forecasting"}
Domain: ${experiment?.domain || "Smart Grid & Transportation"}
Dataset: ${experiment?.datasetName || "UrbanEV-ChargeBench"}
Metrics: ${JSON.stringify(experiment?.metrics || [])}
Baselines: ${JSON.stringify(experiment?.baselines || [])}
Figures & Tables: Figure 1 (Multi-horizon load curve vs actuals), Figure 2 (Spatial cross-attention heatmap), Table 1 (Hyperparameters), Table 2 (Benchmark comparison).
Key Findings: ${JSON.stringify(experiment?.keyFindings || [])}
User instructions: ${customPrompt || "Focus on academic tone, data-driven synthesis, and highlighting the 21.4% improvement over LSTM."}

Output formatted strictly as JSON with keys:
{
  "resultsContent": "Rigorous section 4.3 text with references to Figure 1 and Table 2",
  "discussionContent": "Insightful section 5 text analyzing spatial cross-attention mechanism, dynamic pricing implications, and computational latency",
  "keyHighlights": ["bullet 1", "bullet 2", "bullet 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error generating paper:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate paper",
    });
  }
});

// API: Review Paper
app.post("/api/review-paper", async (req, res) => {
  try {
    const { paperData } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
      });
    }

    const prompt = `You are an elite, critical Peer Reviewer for top-tier venues (IEEE TPWRS, NeurIPS, KDD).
Review this research manuscript thoroughly:
Title: ${paperData?.title}
Abstract: ${paperData?.abstract}
Sections: ${JSON.stringify(paperData?.sections?.map((s: any) => ({ title: s.title, snippet: s.content?.slice(0, 300) })))}

Analyze whether there is an ablation study, statistical significance tests, proper error bars in figures, and explicit units in tables.
Provide a rigorous review report in JSON format:
{
  "overallScore": 5.2,
  "decision": "Major Revision",
  "confidence": "4.5 / 5.0",
  "summary": "Concise critical appraisal...",
  "strengths": ["...", "..."],
  "majorIssues": [
    {
      "id": "issue-ablation",
      "type": "major",
      "title": "缺少 Ablation Study",
      "critique": "Detailed critique...",
      "aiSuggestion": "Concrete guidance for removing weather, dynamic pricing, and spatial features...",
      "actionTitle": "生成 Ablation 实验"
    }
  ],
  "minorIssues": [
    {
      "id": "issue-table-units",
      "type": "minor",
      "title": "Table 2 缺少完整物理单位标注",
      "critique": "Detailed critique...",
      "aiSuggestion": "Explicit units (kW, %, ms)...",
      "actionTitle": "规范三线表头与物理量纲"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error reviewing paper:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to review paper",
    });
  }
});

// API: Generate Ablation Study
app.post("/api/generate-ablation", async (req, res) => {
  try {
    const { experiment } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
      });
    }

    const prompt = `Generate a rigorous Ablation Study section (Section 4.4) for the following paper on ${experiment?.title || "Transformer Charging Load Forecasting"}.
Include variants:
1. Full Proposed ST-Trans (MAE: 14.28 kW, MAPE: 5.82%)
2. w/o Weather Features (ambient temp, rain)
3. w/o Dynamic Pricing (Time-of-Use tariff embeddings)
4. w/o Spatial Cross-Attention (replaced with static graph)

Return JSON with:
{
  "sectionTitle": "4.4 Ablation Study & Component Analysis",
  "sectionContent": "Comprehensive academic narrative analyzing the quantitative degradation across all 3 ablation variants and verifying hypothesis.",
  "discussionAdditions": "Additional insights on feature attribution for smart grid operators."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error generating ablation:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate ablation",
    });
  }
});

async function startServer() {
  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
