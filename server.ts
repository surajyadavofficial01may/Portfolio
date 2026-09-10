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

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    if (ai) {
      // Build conversation context
      const prompt = `System Context:\n${SURAJ_CONTEXT}\n\nUser Question: ${message}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const reply = response.text || "Hello! I'm here to help you learn all about Suraj Yadav's work and skills.";
      return res.json({ reply });
    }

    // Fallback response generator if GEMINI_API_KEY is not configured
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) {
      reply = "Suraj's technical skills are extensive! They include **Python, TypeScript, React.js, FastAPI, Node.js**, and databases like **MongoDB, PostgreSQL, and Redis**. He specializes in AI/ML using **LangGraph, TensorFlow, PyTorch, and Vector databases (FAISS, Pinecone)**.";
    } else if (lower.includes("project") || lower.includes("work") || lower.includes("portfolio")) {
      reply = "Suraj's highlighted projects include:\n• **Aiden**: An Emotionally Intelligent AI Companion with persistent memory.\n• **AI Quantitative Stock System**: A predictive analytics platform with 100+ technical indicators.\n• **ZipIgnore**: A Python CLI packaging utility published on PyPI.\n• **MeDict AI**: Deep learning lung cancer detection with 81% accuracy.";
    } else if (lower.includes("experience") || lower.includes("internship") || lower.includes("years") || lower.includes("background")) {
      reply = "Suraj is currently a **Software Engineer at Spotline, Inc.** where he leads Agentic-RAG systems and DB validation platforms. Previously, he was a Salesforce Development Intern at SmartInternz. He has led 3 end-to-end production systems within his first year!";
    } else if (lower.includes("hire") || lower.includes("available") || lower.includes("contact") || lower.includes("email")) {
      reply = "Suraj is currently **seeking opportunities at Google Payments**! You can email him at **thesuraj396@gmail.com**, or connect via **LinkedIn (linkedin.com/in/surajyadav01)** and **GitHub (github.com/Thesuraj01)**.";
    } else if (lower.includes("education") || lower.includes("college") || lower.includes("university")) {
      reply = "Suraj holds a **Bachelor of Technology in Computer Science and Engineering** (CGPA: 8.35/10.0) from **KIIT Deemed University**. He is also an **AWS Academy Graduate** and certified by Cognite.";
    } else if (lower.includes("location") || lower.includes("where")) {
      reply = "Suraj is based in **Bhubaneswar, Odisha, India**.";
    } else {
      reply = `Hello! Suraj Kumar Yadav is a Software Engineer specializing in scalable full-stack systems and AI-powered applications (FastAPI, React, LangGraph). Feel free to ask about his **projects** (Aiden, ZipIgnore, MeDict AI), **skills**, **education**, or **experience** at Spotline Inc.!`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      reply: "Suraj is a software engineer passionate about scalable web apps, React, Python, and Node.js. Feel free to explore the console or ask another question!",
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
