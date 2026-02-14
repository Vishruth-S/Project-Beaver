import { useState } from "react";
import Navbar from './Navbar';
import Footer from './Footer';

const colors = {
  bg: "#FFFFFF",
  bgSecondary: "#F9FAFB",
  cardBg: "#FFFFFF",
  cardBorder: "#E5E7EB",
  primary: "#14B8A6",
  primaryLight: "#5EEAD4",
  primaryDark: "#0F766E",
  accent: "#10B981",
  accentGlow: "rgba(16, 185, 129, 0.15)",
  warning: "#F59E0B",
  warningGlow: "rgba(245, 158, 11, 0.15)",
  info: "#3B82F6",
  infoGlow: "rgba(59, 130, 246, 0.15)",
  error: "#EF4444",
  errorGlow: "rgba(239, 68, 68, 0.15)",
  text: "#1F2937",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
};

interface ArrowProps {
  color?: string;
}

interface ServiceCardProps {
  title: string;
  subtitle: string;
  items: string[];
  color: string;
  glowColor: string;
  icon: string;
}

interface BadgeProps {
  label: string;
}

// interface DeployBadgeProps {
//   label: string;
//   platform: string;
// }

const ArrowDown = ({ color = colors.textLight }: ArrowProps) => (
  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
    <svg width="20" height="32" viewBox="0 0 20 32">
      <line x1="10" y1="0" x2="10" y2="26" stroke={color} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="4,22 10,30 16,22" fill={color} />
    </svg>
  </div>
);

const ServiceCard = ({ title, subtitle, items, color, glowColor, icon }: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.cardBg,
        border: `1px solid ${hovered ? color : colors.cardBorder}`,
        borderRadius: "12px",
        padding: "20px",
        flex: 1,
        minWidth: "200px",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 4px 12px ${glowColor}` : "0 1px 3px rgba(0, 0, 0, 0.1)",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px" }}>
          {title}
        </span>
      </div>
      <div style={{ color: colors.textSecondary, fontSize: "12px", marginBottom: "14px", fontFamily: "'JetBrains Mono', monospace" }}>
        {subtitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: colors.text }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TechBadge = ({ label }: BadgeProps) => (
  <span
    style={{
      background: "rgba(20, 184, 166, 0.1)",
      border: "1px solid rgba(20, 184, 166, 0.3)",
      borderRadius: "6px",
      padding: "4px 10px",
      fontSize: "11px",
      color: colors.primary,
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500,
    }}
  >
    {label}
  </span>
);

// const DeployBadge = ({ label, platform }: DeployBadgeProps) => (
//   <span
//     style={{
//       background: "rgba(16, 185, 129, 0.1)",
//       border: "1px solid rgba(16, 185, 129, 0.3)",
//       borderRadius: "6px",
//       padding: "4px 10px",
//       fontSize: "11px",
//       color: colors.accent,
//       fontFamily: "'JetBrains Mono', monospace",
//       fontWeight: 500,
//     }}
//   >
//     {label} → {platform}
//   </span>
// );

export default function AboutPage() {
  return (
    <div style={{ background: colors.bgSecondary, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar showBackButton={true} />

      {/* Main Content */}
      <div
        style={{
          padding: "40px 24px",
          fontFamily: "'Inter', sans-serif",
          color: colors.text,
          flex: 1,
        }}
      >
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "28px", fontWeight: 700, color: colors.text, margin: 0 }}>
          <span style={{ color: colors.primary }}>APItome</span>
          {/* <span style={{ color: colors.textLight, fontWeight: 400 }}>: preview</span> */}
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: "14px", marginTop: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
          System Architecture — Microservices RAG Pipeline
        </p>
      </div>

      {/* User Layer */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
        <div
          style={{
            background: "rgba(20, 184, 166, 0.08)",
            border: `1px solid rgba(20, 184, 166, 0.3)`,
            borderRadius: "10px",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "18px" }}>👤</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: colors.primary, fontWeight: 600 }}>
            User / Developer
          </span>
          <span style={{ color: colors.textSecondary, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
            submits API doc URLs + queries
          </span>
        </div>
      </div>

      <ArrowDown color={colors.primary} />

      {/* Frontend */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "10px",
            padding: "16px 28px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600, color: colors.text }}>
            🌐 Frontend — React / Next.js
          </div>
          <div style={{ color: colors.textSecondary, fontSize: "12px", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
            Chat UI · URL submission · Streaming responses
          </div>
        </div>
      </div>

      <ArrowDown color={colors.info} />

      {/* Gateway Service */}
      <div style={{ maxWidth: "720px", margin: "0 auto 4px" }}>
        <ServiceCard
          title="GATEWAY SERVICE"
          subtitle="FastAPI — Unified Entry Point"
          icon="🚪"
          color={colors.info}
          glowColor={colors.infoGlow}
          items={[
            "Routes requests to Parser & RAG services",
            "Rate-limiting & validations",
            "Conversational context management",
            "Request validation & error handling",
          ]}
        />
      </div>

      {/* Split into two services */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0px", maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ArrowDown color={colors.accent} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ArrowDown color={colors.warning} />
        </div>
      </div>

      {/* Parser + RAG Services */}
      <div style={{ display: "flex", gap: "16px", maxWidth: "720px", margin: "0 auto 4px", flexWrap: "wrap" }}>
        <ServiceCard
          title="PARSER SERVICE"
          subtitle="Documentation Ingestion"
          icon="🔍"
          color={colors.accent}
          glowColor={colors.accentGlow}
          items={[
            "Web crawling & scraping",
            "Content extraction & cleaning",
            "Semantic chunking",
            "Metadata preservation",
            "Embedding generation",
          ]}
        />
        <ServiceCard
          title="RAG SERVICE"
          subtitle="Retrieval & Generation"
          icon="🧠"
          color={colors.warning}
          glowColor={colors.warningGlow}
          items={[
            "Query embedding",
            "Cross-API semantic retrieval",
            "Context-aware prompt construction",
            "LLM response generation",
            "Streaming output",
          ]}
        />
      </div>

      {/* Both connect to data layer */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0px", maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ArrowDown color={colors.accent} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ArrowDown color={colors.warning} />
        </div>
      </div>

      {/* Data Layer */}
      <div style={{ display: "flex", gap: "16px", maxWidth: "720px", margin: "0 auto 24px", flexWrap: "wrap" }}>
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "10px",
            padding: "16px 20px",
            flex: 1,
            minWidth: "200px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "6px" }}>🗄️</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 600, color: colors.error }}>
            ChromaDB
          </div>
          <div style={{ color: colors.textSecondary, fontSize: "11px", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
            Vector Store · Cache
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "1px", height: "40px", background: colors.cardBorder }} />
        </div>

        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "10px",
            padding: "16px 20px",
            flex: 1,
            minWidth: "200px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "6px" }}>⚡</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 600, color: colors.error }}>
            Groq — Llama 3.1
          </div>
          <div style={{ color: colors.textSecondary, fontSize: "11px", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
            Fast LLM Inference
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div style={{ maxWidth: "720px", margin: "0 auto", borderTop: `1px solid ${colors.cardBorder}`, paddingTop: "24px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: colors.textSecondary, marginBottom: "12px", fontWeight: 600 }}>
          TECH STACK
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {["Python", "FastAPI", "ChromaDB", "Groq", "Llama 3.1", "LangChain", "React", "Next.js"].map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
        {/* <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: colors.textSecondary, marginBottom: "12px", fontWeight: 600 }}>
          DEPLOYMENT
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <DeployBadge label="Backend" platform="Render" />
          <DeployBadge label="Frontend" platform="Vercel" />
        </div> */}
      </div>
    </div>

    <Footer />
  </div>
  );
}
