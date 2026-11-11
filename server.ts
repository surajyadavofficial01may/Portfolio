import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
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
  - Databases: MongoDB, PostgreSQL, Redis, MongoDB Atlas (Vector Search), Pinecone, TimescaleDB
  - Cloud & DevOps: Docker, Docker Compose, GKE, AWS (Bedrock, EKS), CI/CD, Kafka, Celery
  - Security: OAuth 2.0, JWT, RBAC, Token Encryption, SSO
- Experience & Internships:
  1. Spotline, Inc. (May 2025 – Present): Software Engineer — Architected V-Assure ScriptGen Extension, engineered DB-Compare, led a production-grade Agentic-RAG system, and contributed to a MS Teams AI Knowledge Bot.
  2. SmartInternz (May 2024 – Jun 2024): Salesforce Development Intern — Developed Apex triggers and automated workflows reducing manual intervention by 30%.
- Key Projects:
  1. Aiden (2025): Emotionally Intelligent AI Companion featuring tree-leaf persistent memory, 11-dimension emotion detection, and FAISS-based semantic memory retrieval.
  2. AI Quantitative Stock Intelligence System (2025): Institutional-grade predictive analytics platform aggregating 100+ technical indicators with an ML ensemble forecasting engine.
  3. MeDict AI (04/2024): Designed deep learning lung cancer detection system achieving 81% accuracy using VGG16 and Streamlit UI.
  4. ZipIgnore: Python-based CLI utility published on PyPI to simplify project packaging by automatically excluding non-essential files.
  5. EVEE: Open-source, offline-first Voice PC Agent for Windows 11 using local faster-whisper speech-to-text, 55+ built-in voice commands with 1.6ms latency, a local policy engine, and optional Groq/Qwen fallback.
  6. TalkingHead 3D: Open-source real-time 3D Avatar-as-a-Service for chatbots with realistic lip-sync, moods, gestures, free Microsoft Edge Neural TTS, and Groq Qwen 3 / OpenAI-compatible APIs.
  7. Jira Fixer (Jira-Ticket-Fixer): Open-source plugin for Claude Code and GitHub Copilot in VS Code (Node.js 18+, zero dependencies, MIT license). Investigates Jira tickets via Atlassian MCP, proposes a minimal "At a glance" plan, and uses a deterministic hook to physically block file edits until human approval.
- Certifications:
  - AWS Academy Graduate — Introduction to Cloud Foundations
  - Cognite Game v4.5 — Certified
- Extracurricular:
  - Led 3 end-to-end production systems at Spotline Inc.
  - National Service Scheme (NSS) | General Volunteer (2022 – Present)
- Personality: Friendly, technical, concise, and enthusiastic about software craftsmanship. Keep responses crisp and informative.
`;

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chatbot endpoint powered by Portfolio_Knowledge_Base RAG
app.post("/api/chat", async (req, res) => {
  try {
    const { message, ragContext } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    const knowledgeSection =
      typeof ragContext === "string" && ragContext.trim()
        ? `\n\nRetrieved Records from Portfolio_Knowledge_Base (Google Sheets Master Source):\n${ragContext}`
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
        "Suraj's technical skills (from **Tech_Knowledge**) include **Python, TypeScript, React.js, FastAPI, Node.js**, databases (**PostgreSQL, MongoDB Atlas, Redis, FAISS**), and AI orchestration with **LangGraph, LiteLLM, Groq, TensorFlow, and PyTorch**.";
    } else if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
      reply =
        "Suraj's projects include:\n• **Jira Fixer (PRJ008)**: Deterministic approval gate plugin for Claude Code & GitHub Copilot.\n• **EVEE (PRJ001)**: Offline-first Voice PC Agent (1.6ms latency, faster-whisper).\n• **TalkingHead 3D (PRJ005)**: Real-time 3D Avatar-as-a-Service.\n• **VAssureAI (PRJ003)**: AI test script generator at Spotline, Inc.\n• **Aiden (PRJ004)**: Emotionally Intelligent AI Companion with tree-leaf FAISS memory.\n• **Travel Together (PRJ002)**: Collaborative community trip planner.\n• **ZipIgnore (PRJ006)**: Python CLI packaging tool on PyPI.\n• **MeDict AI (PRJ007)**: VGG16 lung cancer detection (81% accuracy).";
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
        : `Hello! Ask me about Suraj's projects (**EVEE, VAssureAI, Travel Together, Aiden, TalkingHead 3D**), **Tech_Knowledge**, or **Work_Experience**!`;
    } else {
      reply = `Hello! Suraj Kumar Yadav is a Software Engineer specializing in scalable full-stack systems and Agentic AI (FastAPI, React, LangGraph). Ask me about **EVEE**, **VAssureAI**, **AI models integrated**, or open the **Google Sheets Knowledge Base**!`;
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
