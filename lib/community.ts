import { createServiceClient } from "@/lib/supabase/server";

export type CommunityQuestion = {
  id: string;
  name: string;
  topic: string;
  question: string;
  createdAt: string;
  country: string | null;
};

const fallbackQuestions: CommunityQuestion[] = [
  {
    id: "fallback-1",
    name: "AI 新手",
    topic: "模型选择",
    question: "ChatGPT、Claude、DeepSeek 日常办公应该怎样选择？",
    createdAt: new Date().toISOString(),
    country: null,
  },
  {
    id: "fallback-2",
    name: "电商用户",
    topic: "提示词",
    question: "做淘宝详情页卖点整理，有没有适合直接复制使用的 Prompt？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    country: null,
  },
  {
    id: "fallback-3",
    name: "小白用户",
    topic: "插件安装",
    question: "Codex 想接入 DeepSeek，需要先准备哪些资料？",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    country: null,
  },
];

type CommunityLogRow = {
  id: number | string;
  run_time?: string | null;
  created_at?: string | null;
  details?: {
    name?: unknown;
    topic?: unknown;
    question?: unknown;
    country?: unknown;
  } | null;
};

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function toCommunityQuestion(row: CommunityLogRow): CommunityQuestion | null {
  const details = row.details ?? {};
  const question = normalizeText(details.question, "");
  if (!question) return null;

  return {
    id: String(row.id),
    name: normalizeText(details.name, "匿名用户"),
    topic: normalizeText(details.topic, "AI交流"),
    question,
    createdAt: row.run_time || row.created_at || new Date().toISOString(),
    country: typeof details.country === "string" && details.country.trim() ? details.country.trim() : null,
  };
}

export async function getCommunityQuestions(limit = 30): Promise<{
  questions: CommunityQuestion[];
  storageMode: "supabase" | "fallback";
}> {
  const client = createServiceClient();
  if (!client) return { questions: fallbackQuestions, storageMode: "fallback" };

  const { data, error } = await client
    .from("ai_generation_logs")
    .select("id, run_time, created_at, details")
    .eq("summary", "community_question")
    .order("run_time", { ascending: false })
    .limit(limit);

  if (error || !data) return { questions: fallbackQuestions, storageMode: "fallback" };

  const questions = (data as CommunityLogRow[])
    .map(toCommunityQuestion)
    .filter((item): item is CommunityQuestion => Boolean(item));

  return {
    questions: questions.length > 0 ? questions : fallbackQuestions,
    storageMode: "supabase",
  };
}
