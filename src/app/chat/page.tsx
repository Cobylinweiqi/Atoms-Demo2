"use client";

import React, { useState } from "react";
import {
  ChatWorkspace,
  ChatColumn,
} from "@/components/chat/ChatWorkspace";
import { ProjectList } from "@/components/chat/ProjectList";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PreviewPanel } from "@/components/chat/PreviewPanel";
import type { Project, ChatMessage, AIModel } from "@/components/chat/types";

// ═══════════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════════

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Landing Page",
    description: "Marketing site for SaaS product",
    framework: "Next.js",
    status: "active",
    lastActiveAt: Date.now() - 3600000,
    conversationCount: 12,
  },
  {
    id: "p2",
    name: "Dashboard App",
    description: "Admin dashboard with charts",
    framework: "React",
    status: "active",
    lastActiveAt: Date.now() - 86400000,
    conversationCount: 8,
  },
  {
    id: "p3",
    name: "AI Chatbot",
    description: "Customer support chatbot",
    framework: "Python",
    status: "archived",
    lastActiveAt: Date.now() - 604800000,
    conversationCount: 24,
  },
  {
    id: "p4",
    name: "E-commerce Store",
    description: "Online shop with Stripe",
    framework: "Next.js",
    status: "active",
    lastActiveAt: Date.now() - 7200000,
    conversationCount: 15,
  },
];

const MOCK_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    capabilities: ["streaming", "function_calling", "vision"],
  },
  {
    id: "claude-3.5",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    capabilities: ["streaming", "function_calling", "vision"],
  },
  {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 1000000,
    capabilities: ["streaming", "function_calling", "vision"],
  },
];

let blockId = 0;
const nextId = () => `b${++blockId}`;

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: [
      {
        id: nextId(),
        type: "text",
        content: "Create a responsive pricing section with 3 tiers. Make it look modern with glassmorphism.",
      },
    ],
    createdAt: Date.now() - 120000,
  },
  {
    id: "m2",
    role: "assistant",
    model: "GPT-4o",
    streamState: "done",
    content: [
      {
        id: nextId(),
        type: "thinking",
        content: "The user wants a pricing section with 3 tiers. I'll create a glassmorphism design with:\n\n1. Free tier - basic features\n2. Pro tier - most popular, highlighted\n3. Enterprise tier - premium features\n\nI'll use CSS backdrop-filter for the glass effect, with gradient borders and hover animations. The layout will be responsive using CSS Grid.",
        duration: 3200,
      },
      {
        id: nextId(),
        type: "text",
        content: "I'll create a modern **glassmorphism pricing section** with 3 tiers. Here's the implementation:",
      },
      {
        id: nextId(),
        type: "tool_call",
        toolName: "web_search",
        toolId: "t1",
        args: { query: "glassmorphism pricing card design 2024" },
        status: "completed",
        result: { results: ["10 modern glass UI examples", "Best practices for glassmorphism"] },
        duration: 850,
      },
      {
        id: nextId(),
        type: "code",
        language: "tsx",
        filename: "PricingSection.tsx",
        code: `import React from "react";

export function PricingSection() {
  const tiers = [
    { name: "Free", price: "$0", features: ["1 project", "Basic support", "1GB storage"] },
    { name: "Pro", price: "$29", features: ["Unlimited projects", "Priority support", "100GB storage", "Custom domain"] },
    { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated support", "1TB storage", "SLA guarantee"] },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {tiers.map((tier) => (
        <div key={tier.name} className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold">{tier.name}</h3>
          <p className="text-3xl font-bold my-4">{tier.price}<span className="text-sm">/mo</span></p>
          <ul className="space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-success">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}`,
      },
      {
        id: nextId(),
        type: "diff",
        language: "tsx",
        filename: "PricingSection.tsx",
        oldContent: `<div key={tier.name} className="glass rounded-2xl p-6">
  <h3 className="text-xl font-bold">{tier.name}</h3>`,
        newContent: `<div key={tier.name} className="glass rounded-2xl p-6 border-gradient">
  <h3 className="text-xl font-bold text-gradient">{tier.name}</h3>`,
      },
      {
        id: nextId(),
        type: "artifact",
        title: "Pricing Section",
        type_kind: "react",
        language: "tsx",
        filename: "PricingSection.tsx",
        content: `import React from "react";

export function PricingSection() {
  const tiers = [
    { name: "Free", price: "$0", features: ["1 project", "Basic support", "1GB storage"] },
    { name: "Pro", price: "$29", features: ["Unlimited projects", "Priority support", "100GB storage", "Custom domain"] },
    { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Dedicated support", "1TB storage", "SLA guarantee"] },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {tiers.map((tier) => (
        <div key={tier.name} className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold">{tier.name}</h3>
          <p className="text-3xl font-bold my-4">{tier.price}<span className="text-sm">/mo</span></p>
          <ul className="space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-success">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}`,
      },
      {
        id: nextId(),
        type: "image",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600",
        alt: "Glassmorphism UI Preview",
        width: 600,
        height: 400,
      },
      {
        id: nextId(),
        type: "file",
        filename: "package.json",
        mimeType: "application/json",
        size: 2456,
        url: "#",
      },
    ],
    createdAt: Date.now() - 60000,
    tokens: { prompt: 156, completion: 892 },
  },
];

// ═══════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════

export default function ChatPage() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>("p1");
  const [activeModel, setActiveModel] = useState("gpt-4o");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: `m${Date.now()}`,
      role: "user",
      content: [{ id: nextId(), type: "text", content: text }],
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate streaming response
    setIsStreaming(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        model: MOCK_MODELS.find((m) => m.id === activeModel)?.name,
        streamState: "done",
        content: [
          {
            id: nextId(),
            type: "thinking",
            content: "Analyzing the request and generating a response...",
            duration: 1500,
          },
          {
            id: nextId(),
            type: "text",
            content: `I received your request: *"${text}"*. Here's my response with a **markdown** example.\n\n## Features\n\n- Real-time updates\n- Glassmorphism design\n- Responsive layout\n\n> This is a simulated response for demo purposes.`,
          },
        ],
        createdAt: Date.now(),
        tokens: { prompt: 50, completion: 120 },
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
    }, 2000);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  const handleRegenerate = () => {
    // Remove last assistant message and regenerate
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        return prev.slice(0, -1);
      }
      return prev;
    });
    setIsStreaming(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        model: MOCK_MODELS.find((m) => m.id === activeModel)?.name,
        streamState: "done",
        content: [
          {
            id: nextId(),
            type: "text",
            content: "Here is a *regenerated* response with different content.",
          },
        ],
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsStreaming(false);
    }, 1500);
  };

  const mockHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: system-ui; margin: 0; padding: 40px; background: #07070B; color: #FAFAFA; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
  .card { background: rgba(255,255,255,0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
  .card.featured { border-color: rgba(99,102,241,0.3); }
  h3 { font-size: 20px; margin: 0 0 8px; }
  .price { font-size: 32px; font-weight: 700; margin: 16px 0; }
  .price span { font-size: 14px; opacity: 0.5; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { padding: 6px 0; display: flex; gap: 8px; align-items: center; }
  .check { color: #10B981; }
</style>
</head>
<body>
  <div class="grid">
    <div class="card"><h3>Free</h3><div class="price">$0<span>/mo</span></div><ul><li><span class="check">✓</span> 1 project</li><li><span class="check">✓</span> Basic support</li><li><span class="check">✓</span> 1GB storage</li></ul></div>
    <div class="card featured"><h3>Pro</h3><div class="price">$29<span>/mo</span></div><ul><li><span class="check">✓</span> Unlimited projects</li><li><span class="check">✓</span> Priority support</li><li><span class="check">✓</span> 100GB storage</li><li><span class="check">✓</span> Custom domain</li></ul></div>
    <div class="card"><h3>Enterprise</h3><div class="price">$99<span>/mo</span></div><ul><li><span class="check">✓</span> Everything in Pro</li><li><span class="check">✓</span> Dedicated support</li><li><span class="check">✓</span> 1TB storage</li><li><span class="check">✓</span> SLA guarantee</li></ul></div>
  </div>
</body>
</html>`;

  return (
    <ChatWorkspace>
      {/* ─── 左侧: Project List ─── */}
      <ChatColumn width={280}>
        <ProjectList
          projects={MOCK_PROJECTS}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
        />
      </ChatColumn>

      {/* ─── 中间: Chat ─── */}
      <ChatColumn>
        <ChatPanel
          messages={messages}
          models={MOCK_MODELS}
          activeModel={activeModel}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          onModelChange={setActiveModel}
          onRegenerate={handleRegenerate}
        />
      </ChatColumn>

      {/* ─── 右侧: Preview ─── */}
      <ChatColumn divider={false} width={440}>
        <PreviewPanel
          htmlContent={mockHtml}
          buildStatus="ready"
          consoleLogs={[
            { level: "info", message: "Build completed in 1.2s", timestamp: Date.now() - 5000 },
            { level: "log", message: "✓ Compiled successfully", timestamp: Date.now() - 4000 },
            { level: "warn", message: "React version mismatch detected", timestamp: Date.now() - 3000 },
          ]}
        />
      </ChatColumn>
    </ChatWorkspace>
  );
}
