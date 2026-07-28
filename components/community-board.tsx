"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CommunityReply, CommunityThread } from "@/lib/community";

const topics = ["模型选择", "提示词", "插件安装", "工作流", "网站运营", "AI工具", "其他问题"];

type CommunityBoardProps = {
  initialThreads: CommunityThread[];
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function CommunityBoard({ initialThreads }: CommunityBoardProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [question, setQuestion] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const remaining = useMemo(() => 500 - question.length, [question.length]);

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/community/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, topic, question, website }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "提交失败，请稍后再试。");
        return;
      }

      if (data.thread) {
        setThreads((current) => [data.thread, ...current].slice(0, 30));
      }
      setQuestion("");
      setStatus("success");
      setMessage("已发布，其他人可以在这个问题下面继续回应。");
    } catch {
      setStatus("error");
      setMessage("网络不稳定，请稍后再试。");
    }
  }

  function addReply(threadId: string, reply: CommunityReply) {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, replies: [...thread.replies, reply] } : thread,
      ),
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
      <form onSubmit={submitQuestion} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:self-start">
        <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          发布新话题
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">开一个公开讨论</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          先提出一个清楚问题，其他人可以在同一条问题下面继续回应。不要公开 API Key、密码或验证码。
        </p>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="community-name">
              昵称
            </label>
            <Input
              id="community-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={24}
              placeholder="不填则显示匿名用户"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="community-topic">
              分类
            </label>
            <select
              id="community-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="community-question">
              问题内容
            </label>
            <textarea
              id="community-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
              required
              minLength={6}
              maxLength={500}
              rows={7}
              placeholder="例如：我是小红书新号，想用 AI 做每日内容选题，应该先准备什么资料？"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>问题会公开显示</span>
              <span>{remaining}</span>
            </div>
          </div>

          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <Button type="submit" size="lg" disabled={status === "sending" || question.trim().length < 6} className="rounded-full">
            {status === "sending" ? "发布中..." : "发布讨论"}
          </Button>

          {message ? (
            <div
              className={`rounded-2xl border p-3 text-sm ${
                status === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {message}
            </div>
          ) : null}
        </div>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              公开讨论
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">大家正在讨论什么</h2>
          </div>
          <div className="text-sm text-slate-400">问题和回应公开显示</div>
        </div>

        <div className="mt-6 space-y-5">
          {threads.map((thread) => (
            <article key={thread.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70">
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                    {thread.topic}
                  </span>
                  <span className="text-xs text-slate-400">{formatTime(thread.createdAt)}</span>
                  {thread.country ? <span className="text-xs text-slate-400">{thread.country}</span> : null}
                </div>
                <p className="mt-3 text-base font-semibold leading-8 text-slate-950">{thread.question}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>楼主：{thread.name}</span>
                  <span>{thread.replies.length} 个回应</span>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white p-5">
                <div className="space-y-3">
                  {thread.replies.length > 0 ? (
                    thread.replies.map((reply) => (
                      <div key={reply.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-slate-600">{reply.name}</span>
                          <span>{formatTime(reply.createdAt)}</span>
                          {reply.country ? <span>{reply.country}</span> : null}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{reply.reply}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
                      暂时未有回应，可以做第一个回应的人。
                    </div>
                  )}
                </div>

                <ReplyForm threadId={thread.id} onReply={addReply} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReplyForm({
  threadId,
  onReply,
}: {
  threadId: string;
  onReply: (threadId: string, reply: CommunityReply) => void;
}) {
  const [name, setName] = useState("");
  const [reply, setReply] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/community/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, name, reply, website }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "回应失败，请稍后再试。");
        return;
      }

      if (data.reply) {
        onReply(threadId, data.reply);
      }
      setReply("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("网络不稳定，请稍后再试。");
    }
  }

  return (
    <form onSubmit={submitReply} className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={24}
          placeholder="昵称"
          className="h-11 rounded-xl text-sm"
        />
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex gap-2">
          <input
            value={reply}
            onChange={(event) => setReply(event.target.value.slice(0, 500))}
            required
            minLength={2}
            maxLength={500}
            placeholder="公开回应这个问题..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <Button type="submit" size="md" disabled={status === "sending" || reply.trim().length < 2} className="shrink-0 rounded-xl px-4">
            {status === "sending" ? "发送中" : "回应"}
          </Button>
        </div>
      </div>
      {message ? <div className="mt-3 text-sm text-rose-600">{message}</div> : null}
    </form>
  );
}
