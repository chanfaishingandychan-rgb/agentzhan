"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CommunityQuestion } from "@/lib/community";

const topics = ["模型选择", "提示词", "插件安装", "工作流", "网站运营", "AI工具", "其他问题"];

type CommunityBoardProps = {
  initialQuestions: CommunityQuestion[];
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

export function CommunityBoard({ initialQuestions }: CommunityBoardProps) {
  const [questions, setQuestions] = useState(initialQuestions);
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

      if (data.question) {
        setQuestions((current) => [data.question, ...current].slice(0, 30));
      }
      setQuestion("");
      setStatus("success");
      setMessage("已发布，其他人现在可以看到你的问题。");
    } catch {
      setStatus("error");
      setMessage("网络不稳定，请稍后再试。");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={submitQuestion} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          AI交流區
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">留下你的 AI 问题</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          可以问模型选择、提示词写法、插件安装、网站运营或工作流问题。不要公开 API Key、密码或验证码。
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
              <span>发布后会显示在最新问题列表</span>
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
            {status === "sending" ? "提交中..." : "发布问题"}
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
              最新问题
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">大家正在讨论什么</h2>
          </div>
          <div className="text-sm text-slate-400">最多显示 30 条</div>
        </div>

        <div className="mt-6 space-y-4">
          {questions.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                  {item.topic}
                </span>
                <span className="text-xs text-slate-400">{formatTime(item.createdAt)}</span>
                {item.country ? <span className="text-xs text-slate-400">{item.country}</span> : null}
              </div>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-900">{item.question}</p>
              <div className="mt-3 text-xs text-slate-500">来自：{item.name}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
