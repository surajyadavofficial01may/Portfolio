import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  SheetTabName,
  retrieveKnowledgeForQuery,
} from "./src/data/knowledgeBaseSchema";
import { syncKnowledgeBaseToSupabase } from "./scripts/sync-knowledge-base-to-supabase";
import {
  getServerConfig,
  validateStartupConfig,
  validateAdminAuthConfig,
  timingSafeCompare,
} from "./src/config/env";

const config = getServerConfig();
const app = express();
const PORT = config.port;

app.use(express.json());

// Ephemeral in-memory signing secret per server process for short-lived admin tokens
const ADMIN_SESSION_SIGNING_KEY = crypto.randomBytes(32).toString("hex");
const ADMIN_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function issueAdminSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_TOKEN_TTL_MS;
  const payload = `admin:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", ADMIN_SESSION_SIGNING_KEY)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`, "utf8").toString("base64url");
}

function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const expiresAt = Number(parts[1]);
    const providedSig = parts[2];
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `admin:${expiresAt}`;
    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SESSION_SIGNING_KEY)
      .update(payload)
      .digest("hex");
    return timingSafeCompare(providedSig, expectedSig);
  } catch {
    return false;
  }
}

let supabaseSyncStatus: {
  supabaseUrl: string;
  bucketName: string;
  tableName: string;
  publicMasterJsonUrl: string;
  tableSynced: boolean;
  lastSyncedAt: string;
} = {
  supabaseUrl: config.supabase.url,
  bucketName: config.supabase.kbBucket,
  tableName: config.supabase.kbTable,
  publicMasterJsonUrl: config.supabase.url
    ? `${config.supabase.url}/storage/v1/object/public/${config.supabase.kbBucket}/Portfolio_Knowledge_Base.json`
    : "/api/knowledge-base",
  tableSynced: false,
  lastSyncedAt: new Date().toISOString(),
};

// Lazy-initialized Gemini Client via centralized config
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const latestConfig = getServerConfig();
  if (!aiClient && latestConfig.geminiApiKey) {
    aiClient = new GoogleGenAI({
      apiKey: latestConfig.geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SURAJ_CONTEXT = `
You are the AI Assistant companion for Suraj Kumar Yadav's interactive retro developer portfolio.
About Suraj Kumar Yadav:
- Full Name: Suraj Kumar Yadav
- Contact: thesuraj396@gmail.com | +91 9508998437
- LinkedIn: https://linkedin.com/in/surajyadav01
- GitHub: https://github.com/Thesuraj01
- Education: KIIT Deemed University — B.Tech in CSE (CGPA: 8.35/10.0)
- Title: Software Engineer
- Location: Bhubaneswar, Odisha, India
- Availability: Seeking opportunities at Google Payments
- Tagline: "Building scalable full-stack systems and AI-powered applications."
- Bio: Results-driven Software Engineer with 1+ year of hands-on industry experience designing, developing, and deploying scalable full-stack systems and AI-powered applications in production environments.
- Technical Skills:
  - Languages: Python, JavaScript (ES6+), TypeScript, Java, C, C++, SQL
  - Frontend: React.js, Vue.js 3, Next.js, Vite, TailwindCSS, HTML5, CSS3, Three.js, Zustand
  - Backend: Node.js, Express.js, FastAPI, RESTful APIs, WebSockets, Server-Sent Events (SSE)
  - AI / ML: LangGraph, LiteLLM, RAG (BM25/TF-IDF/Vector), TensorFlow, PyTorch, Scikit-Learn, FAISS, Pydantic
  - Databases: Supabase (PostgreSQL), MongoDB, Redis, MongoDB Atlas (Vector Search), Pinecone, TimescaleDB
  - Cloud & DevOps: Docker, Docker Compose, GKE, AWS (Bedrock, EKS), CI/CD, Kafka, Celery
  - Security: OAuth 2.0, JWT, RBAC, Token Encryption, SSO
- Experience & Internships:
  1. Spotline, Inc. (May 2025 – Present): Software Engineer — Architected V-Assure ScriptGen Extension, engineered DB-Compare, led a production-grade Agentic-RAG system, and contributed to a MS Teams AI Knowledge Bot.
  2. SmartInternz (May 2024 – Jun 2024): Salesforce Development Intern — Developed Apex triggers and automated workflows reducing manual intervention by 30%.
- Key Projects:
  1. Jira Fixer (Jira-Ticket-Fixer): Open-source plugin for Claude Code and GitHub Copilot in VS Code (Node.js 18+, zero dependencies, MIT license). Investigates Jira tickets via Atlassian MCP, proposes a minimal "At a glance" plan, and uses a deterministic hook to physically block file edits until human approval.
  2. EVEE: Open-source, offline-first Voice PC Agent for Windows 11 using local faster-whisper speech-to-text, 55+ built-in voice commands with 1.6ms latency, a local policy engine, and optional Groq/Qwen fallback.
  3. TalkingHead 3D: Open-source real-time 3D Avatar-as-a-Service for chatbots with realistic lip-sync, moods, gestures, free Microsoft Edge Neural TTS, and Groq Qwen 3 / OpenAI-compatible APIs.
  4. Aiden (2025): Emotionally Intelligent AI Companion featuring tree-leaf persistent memory, 11-dimension emotion detection, and FAISS-based semantic memory retrieval.
  5. AI Quantitative Stock Intelligence System (2025): Institutional-grade predictive analytics platform aggregating 100+ technical indicators with an ML ensemble forecasting engine.
  6. ZipIgnore: Python-based CLI utility published on PyPI to simplify project packaging by automatically excluding non-essential files.
  7. MeDict AI (04/2024): Designed deep learning lung cancer detection system achieving 81% accuracy using VGG16 and Streamlit UI.
- Certifications:
  - AWS Academy Graduate — Introduction to Cloud Foundations
  - Cognite Game v4.5 — Certified
- Extracurricular:
  - Led 3 end-to-end production systems at Spotline Inc.
  - National Service Scheme (NSS) | General Volunteer (2022 – Present)
- Personality: Friendly, technical, concise, and enthusiastic about software craftsmanship. Keep responses crisp and informative.
`;

// Health check route (never exposes secrets or private configuration)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    supabaseConfigured: Boolean(config.supabase.url && config.supabase.secretKey),
    timestamp: new Date().toISOString(),
  });
});

// Server-side Admin Authentication Endpoint (replaces client-side hardcoded password)
app.post("/api/admin/verify", (req, res) => {
  try {
    const latestConfig = getServerConfig();
    validateAdminAuthConfig(latestConfig);

    const candidatePassword =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!timingSafeCompare(candidatePassword, latestConfig.security.adminPassword)) {
      return res.status(401).json({
        authenticated: false,
        error: "Invalid administrator password.",
      });
    }

    const token = issueAdminSessionToken();
    return res.json({
      authenticated: true,
      token,
      expiresInSeconds: ADMIN_TOKEN_TTL_MS / 1000,
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : "Admin authentication is not configured on the server.";
    return res.status(503).json({
      authenticated: false,
      error: msg,
    });
  }
});

// Trigger on-demand sync to Supabase (requires valid Admin Session Token)
app.post("/api/knowledge-base/sync-supabase", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  if (!verifyAdminSessionToken(token)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Valid administrator session token is required.",
    });
  }

  try {
    const syncResult = await syncKnowledgeBaseToSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE);
    supabaseSyncStatus = {
      supabaseUrl: syncResult.supabaseUrl,
      bucketName: syncResult.bucketName,
      tableName: syncResult.tableName,
      publicMasterJsonUrl: syncResult.publicMasterJsonUrl,
      tableSynced: syncResult.tableSynced,
      lastSyncedAt: syncResult.lastSyncedAt,
    };
    res.json({
      success: true,
      ...syncResult,
      supabase: supabaseSyncStatus,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Supabase sync failed";
    res.status(500).json({ success: false, error: msg });
  }
});

// Automated GitHub Push/Merge Webhook -> Syncs directly to Supabase
app.post("/api/knowledge-base/webhook/github", async (_req, res) => {
  try {
    const syncResult = await syncKnowledgeBaseToSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE);
    supabaseSyncStatus = {
      supabaseUrl: syncResult.supabaseUrl,
      bucketName: syncResult.bucketName,
      tableName: syncResult.tableName,
      publicMasterJsonUrl: syncResult.publicMasterJsonUrl,
      tableSynced: syncResult.tableSynced,
      lastSyncedAt: syncResult.lastSyncedAt,
    };
    res.json({
      success: true,
      ...syncResult,
      supabase: supabaseSyncStatus,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Automated Supabase sync failed";
    res.status(500).json({ success: false, error: msg });
  }
});

// RAG Retrieval API for external codebases/services: GET /api/knowledge-base/rag?q=What+is+Jira+Fixer
app.get("/api/knowledge-base/rag", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const topK = Number(req.query.topK) || 6;
  const context = retrieveKnowledgeForQuery(query, DEFAULT_PORTFOLIO_KNOWLEDGE_BASE, topK);
  res.json({
    query,
    topK,
    supabase: supabaseSyncStatus,
    context,
  });
});

// Read-only Knowledge Base JSON API so external codebases can fetch all 7 categories or discover public URLs
app.get("/api/knowledge-base", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const baseUrl = supabaseSyncStatus.supabaseUrl;
  const bucket = supabaseSyncStatus.bucketName;
  res.json({
    title: MASTER_SPREADSHEET_TITLE,
    storageProvider: "Supabase",
    supabase: supabaseSyncStatus,
    tabs: PORTFOLIO_SHEETS_SCHEMA.map((s) => ({
      number: s.number,
      name: s.name,
      columns: s.columns.map((c) => c.key),
      rowCount: (DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[s.name] || []).length,
      supabaseJsonUrl: baseUrl
        ? `${baseUrl}/storage/v1/object/public/${bucket}/${s.name}.json`
        : `/api/knowledge-base/${s.name}`,
      supabaseCsvUrl: baseUrl
        ? `${baseUrl}/storage/v1/object/public/${bucket}/${s.name}.csv`
        : `/api/knowledge-base/${s.name}/csv`,
    })),
    data: DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  });
});

// Live CSV endpoint for any of the 7 categories
app.get("/api/knowledge-base/:tab/csv", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const requested = req.params.tab.toLowerCase();
  const matchedSchema = PORTFOLIO_SHEETS_SCHEMA.find(
    (s) => s.name.toLowerCase() === requested
  );
  if (!matchedSchema) {
    return res.status(404).send(`Unknown category "${req.params.tab}"`);
  }
  const tabName = matchedSchema.name as SheetTabName;
  const rows = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[tabName] || [];
  const headers = matchedSchema.columns.map((c) => c.key);
  const escapeCell = (val: string) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvLines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h] ?? "")).join(",")),
  ];
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.send(csvLines.join("\n"));
});

app.get("/api/knowledge-base/:tab", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const requested = req.params.tab.toLowerCase();
  const matchedSchema = PORTFOLIO_SHEETS_SCHEMA.find(
    (s) => s.name.toLowerCase() === requested
  );
  if (!matchedSchema) {
    return res.status(404).json({
      error: `Unknown category "${req.params.tab}". Valid categories: ${PORTFOLIO_SHEETS_SCHEMA.map((s) => s.name).join(", ")}`,
    });
  }
  const tabName = matchedSchema.name as SheetTabName;
  res.json({
    tab: tabName,
    supabase: supabaseSyncStatus,
    columns: matchedSchema.columns,
    rows: DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[tabName] || [],
  });
});

// AI Chatbot endpoint powered by Portfolio_Knowledge_Base RAG (Supabase)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, ragContext } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    const knowledgeSection =
      typeof ragContext === "string" && ragContext.trim()
        ? `\n\nRetrieved Records from Portfolio_Knowledge_Base (Supabase Master Source):\n${ragContext}`
        : "";

    if (ai) {
      const prompt = `System Context:\n${SURAJ_CONTEXT}${knowledgeSection}\n\nInstruction: Answer the visitor's question naturally, accurately, and concisely using the retrieved Portfolio_Knowledge_Base records and system context.\n\nUser Question: ${message}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const reply =
        response.text ||
        "Hello! I'm here to help you learn all about Suraj Yadav's work, projects, and skills.";
      return res.json({ reply });
    }

    // Fallback response generator using RAG context + keyword matching if GEMINI_API_KEY is not configured
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("jira") || lower.includes("fixer") || lower.includes("claude code") || lower.includes("copilot")) {
      reply =
        "**Jira Fixer (PRJ008)** (`github.com/TheSuraj01/Jira-Ticket-Fixer`) is an open-source plugin for **Claude Code** and **GitHub Copilot in VS Code** built by Suraj. It investigates Jira tickets, proposes a minimal **'At a glance'** plan, and uses a zero-dependency Node.js 18+ hook to **physically block file edits** until you click Approve—limiting edits strictly to approved files and writing a failing regression test first.";
    } else if (lower.includes("evee")) {
      reply =
        "**EVEE (PRJ001)** is an open-source, offline-first voice-controlled PC agent for Windows 11 built by Suraj. It uses int8-quantized **faster-whisper** on CPU for 100% local speech recognition, matches 55+ commands with **1.6ms (p95) latency** (including negation checks), and enforces a local policy engine (allow/confirm/deny) with optional **Groq/Qwen** fallback.";
    } else if (lower.includes("vassure") || lower.includes("scriptgen") || lower.includes("veeva")) {
      reply =
        "**VAssureAI (PRJ003)**: At **Spotline, Inc.**, Suraj architected the V-Assure ScriptGen Chrome Extension (MV3) and its asynchronous **FastAPI + Groq LLM** backend to automatically extract requirement context and generate compliant validation test scripts for Veeva Vault.";
    } else if (lower.includes("travel together")) {
      reply =
        "**Travel Together (PRJ002)** is a collaborative community trip planning platform built with **React, TypeScript, Node.js, and WebSockets**, enabling developer communities and friends to coordinate shared itineraries, voting, and expenses in real time.";
    } else if (lower.includes("model") || lower.includes("ai") || lower.includes("rag") || lower.includes("llm")) {
      reply =
        "Suraj has integrated **Groq LLMs (Llama 8B/70B, Qwen 3)**, **LangGraph** multi-agent workflows, **faster-whisper** (local int8 CPU speech-to-text), **FAISS & MongoDB Atlas Vector Search** (achieving sub-45ms cache-hit latency), **Microsoft Edge Neural TTS**, and deep learning ensembles (**VGG16, ResNet50, InceptionV3, EfficientNet**).";
    } else if (lower.includes("auth") || lower.includes("security") || lower.includes("oauth")) {
      reply =
        "For authentication and security, Suraj implements **OAuth 2.0, JWT bearer tokens, Role-Based Access Control (RBAC), token encryption, and SSO**, alongside deterministic local policy engines and physical edit-blocking hooks in autonomous agents (**EVEE**, **Jira Fixer**).";
    } else if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) {
      reply =
        "Suraj's technical skills (from **Technical_Skills**) include **Python, TypeScript, React.js, FastAPI, Node.js**, databases (**Supabase/PostgreSQL, MongoDB Atlas, Redis, FAISS**), and AI orchestration with **LangGraph, LiteLLM, Groq, TensorFlow, and PyTorch**.";
    } else if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
      reply =
        "Suraj's projects (newest first) include:\n• **Jira Fixer (PRJ008)**: Deterministic approval gate plugin for Claude Code & GitHub Copilot.\n• **EVEE (PRJ001)**: Offline-first Voice PC Agent (1.6ms latency, faster-whisper).\n• **TalkingHead 3D (PRJ005)**: Real-time 3D Avatar-as-a-Service.\n• **VAssureAI (PRJ003)**: AI test script generator at Spotline, Inc.\n• **Aiden (PRJ004)**: Emotionally Intelligent AI Companion with tree-leaf FAISS memory.\n• **Travel Together (PRJ002)**: Collaborative community trip planner.\n• **ZipIgnore (PRJ006)**: Python CLI packaging tool on PyPI.\n• **MeDict AI (PRJ007)**: VGG16 lung cancer detection (81% accuracy).";
    } else if (lower.includes("experience") || lower.includes("internship") || lower.includes("spotline")) {
      reply =
        "Suraj is a **Software Engineer at Spotline, Inc.** (May 2025 – Present), where he led 3 end-to-end production systems (VAssureAI, DB-Compare, and an Agentic-RAG system). Previously, he was a **Salesforce Development Intern at SmartInternz**, reducing manual workflows by 30%.";
    } else if (lower.includes("hire") || lower.includes("available") || lower.includes("contact") || lower.includes("email")) {
      reply =
        "Suraj is open to Software Engineer opportunities (including **Google Payments**)! Reach him at **thesuraj396@gmail.com** or **linkedin.com/in/surajyadav01**.";
    } else if (typeof ragContext === "string" && ragContext.trim()) {
      const firstChunk = ragContext.split("\n\n")[0] || "";
      reply = firstChunk
        ? `From **Portfolio_Knowledge_Base**:\n${firstChunk}`
        : `Hello! Ask me about Suraj's projects (**Jira Fixer, EVEE, VAssureAI, Travel Together, Aiden, TalkingHead 3D**), **Technical_Skills**, or **Work_Experience**!`;
    } else {
      reply = `Hello! Suraj Kumar Yadav is a Software Engineer specializing in scalable full-stack systems and Agentic AI (FastAPI, React, LangGraph). Ask me about **Jira Fixer**, **EVEE**, **VAssureAI**, or **AI models integrated**!`;
    }

    return res.json({ reply });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    res.status(500).json({
      reply:
        "Suraj is a software engineer passionate about scalable web apps, React, Python, and Agentic AI. Feel free to explore the console or ask another question!",
    });
  }
});

// Contact transmission endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transmissionId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
  res.json({
    success: true,
    transmissionId,
    message: "Transmission received and logged in Suraj's terminal!",
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  // Validate startup configuration
  const startupCheck = validateStartupConfig({ strict: config.nodeEnv === "production" });
  if (!startupCheck.valid) {
    console.warn(
      `[Config Validation] Missing environment variables: ${startupCheck.missing.join(", ")}. Configure them in .env.`
    );
  } else {
    // Automatically sync all 7 categories of Portfolio_Knowledge_Base to Supabase on startup when credentials are valid
    syncKnowledgeBaseToSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE)
      .then((res) => {
        supabaseSyncStatus = {
          supabaseUrl: res.supabaseUrl,
          bucketName: res.bucketName,
          tableName: res.tableName,
          publicMasterJsonUrl: res.publicMasterJsonUrl,
          tableSynced: res.tableSynced,
          lastSyncedAt: res.lastSyncedAt,
        };
        console.log(`[Supabase Auto-Sync] ${res.message}`);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Supabase Auto-Sync Warning] ${msg}`);
      });
  }

  // Vite middleware for development
  if (config.nodeEnv !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
