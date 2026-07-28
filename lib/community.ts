import { createServiceClient } from "@/lib/supabase/server";

export type CommunityReply = {
  id: string;
  threadId: string;
  name: string;
  reply: string;
  createdAt: string;
  country: string | null;
};

export type CommunityThread = {
  id: string;
  name: string;
  topic: string;
  question: string;
  createdAt: string;
  country: string | null;
  replies: CommunityReply[];
};

const fallbackThreads: CommunityThread[] = [
  {
    id: "fallback-1",
    name: "AI 新手",
    topic: "模型选择",
    question: "ChatGPT、Claude、DeepSeek 日常办公应该怎样选择？",
    createdAt: new Date().toISOString(),
    country: null,
    replies: [
      {
        id: "fallback-reply-1",
        threadId: "fallback-1",
        name: "Agent站",
        reply: "如果你是日常办公，可以先用 ChatGPT；长文整理用 Claude；中文推理和性价比可以试 DeepSeek。",
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        country: null,
      },
    ],
  },
  {
    id: "fallback-2",
    name: "电商用户",
    topic: "提示词",
    question: "做淘宝详情页卖点整理，有没有适合直接复制使用的 Prompt？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    country: null,
    replies: [],
  },
  {
    id: "fallback-3",
    name: "小白用户",
    topic: "插件安装",
    question: "Codex 想接入 DeepSeek，需要先准备哪些资料？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    country: null,
    replies: [],
  },
];

type CommunityLogRow = {
  id: number | string;
  summary?: string | null;
  run_time?: string | null;
  created_at?: string | null;
  details?: {
    name?: unknown;
    topic?: unknown;
    question?: unknown;
    reply?: unknown;
    threadId?: unknown;
    country?: unknown;
  } | null;
};

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeCountry(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 2).toUpperCase() : null;
}

export function toCommunityThread(row: CommunityLogRow): CommunityThread | null {
  const details = row.details ?? {};
  const question = normalizeText(details.question, "");
  if (!question) return null;

  return {
    id: String(row.id),
    name: normalizeText(details.name, "匿名用户"),
    topic: normalizeText(details.topic, "AI討論"),
    question,
    createdAt: row.run_time || row.created_at || new Date().toISOString(),
    country: normalizeCountry(details.country),
    replies: [],
  };
}

export function toCommunityReply(row: CommunityLogRow): CommunityReply | null {
  const details = row.details ?? {};
  const threadId = normalizeText(details.threadId, "");
  const reply = normalizeText(details.reply, "");
  if (!threadId || !reply) return null;

  return {
    id: String(row.id),
    threadId,
    name: normalizeText(details.name, "匿名用户"),
    reply,
    createdAt: row.run_time || row.created_at || new Date().toISOString(),
    country: normalizeCountry(details.country),
  };
}

export async function getCommunityThreads(limit = 30): Promise<{
  threads: CommunityThread[];
  storageMode: "supabase" | "fallback";
}> {
  const client = createServiceClient();
  if (!client) return { threads: fallbackThreads, storageMode: "fallback" };

  const { data, error } = await client
    .from("ai_generation_logs")
    .select("id, summary, run_time, created_at, details")
    .in("summary", ["community_question", "community_reply"])
    .order("run_time", { ascending: false })
    .limit(Math.max(limit * 8, 120));

  if (error || !data) return { threads: fallbackThreads, storageMode: "fallback" };

  const rows = data as CommunityLogRow[];
  const threadMap = new Map<string, CommunityThread>();
  const replies: CommunityReply[] = [];

  for (const row of rows) {
    if (row.summary === "community_question") {
      const thread = toCommunityThread(row);
      if (thread) threadMap.set(thread.id, thread);
    }
    if (row.summary === "community_reply") {
      const reply = toCommunityReply(row);
      if (reply) replies.push(reply);
    }
  }

  for (const reply of replies) {
    const thread = threadMap.get(reply.threadId);
    if (thread) thread.replies.push(reply);
  }

  const threads = Array.from(threadMap.values())
    .map((thread) => ({
      ...thread,
      replies: thread.replies.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return {
    threads: threads.length > 0 ? threads : fallbackThreads,
    storageMode: "supabase",
  };
}
