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

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} 小时前`;

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getThreadScore(thread: CommunityThread) {
  return Math.max(1, thread.replies.length * 3 + thread.question.length % 11);
}

function getThreadPages(thread: CommunityThread) {
  return Math.max(1, Math.ceil((thread.replies.length + 1) / 20));
}

export function CommunityBoard({ initialThreads }: CommunityBoardProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [openThreadId, setOpenThreadId] = useState(initialThreads[0]?.id ?? "");
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"latest" | "hot">("latest");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [question, setQuestion] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const remaining = useMemo(() => 500 - question.length, [question.length]);
  const sortedThreads = useMemo(() => {
    const copy = [...threads];
    if (activeTab === "hot") {
      copy.sort((a, b) => getThreadScore(b) + b.replies.length * 4 - (getThreadScore(a) + a.replies.length * 4));
      return copy;
    }
    copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return copy;
  }, [activeTab, threads]);

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
        setOpenThreadId(data.thread.id);
      }
      setQuestion("");
      setStatus("success");
      setMessage("已发表，其他人可以在这个主题下面继续回应。");
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
    <div className="mx-auto w-full pb-20 md:pb-0">
      <section className="overflow-hidden border-y border-slate-200 bg-white md:rounded-2xl md:border md:shadow-sm">
        <div className="grid grid-cols-2 border-b border-slate-200 bg-white text-center text-base font-semibold text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab("latest")}
            className={`relative h-[52px] py-4 transition ${activeTab === "latest" ? "text-slate-950" : "hover:text-slate-600"}`}
          >
            最新
            {activeTab === "latest" ? <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hot")}
            className={`relative h-[52px] py-4 transition ${activeTab === "hot" ? "text-slate-950" : "hover:text-slate-600"}`}
          >
            热门
            {activeTab === "hot" ? <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" /> : null}
          </button>
        </div>

        {!composerOpen ? (
          <div className="flex items-center justify-between gap-3 border-b border-yellow-200 bg-yellow-50 px-5 py-3 lg:px-8">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-950">想开一个新讨论？</div>
              <div className="mt-0.5 text-xs text-slate-500">不是回应旧问题，而是发布一个新的问题主题。</div>
            </div>
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="shrink-0 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-300"
            >
              + 发新问题
            </button>
          </div>
        ) : null}

        {composerOpen ? (
          <ForumComposer
            name={name}
            setName={setName}
            topic={topic}
            setTopic={setTopic}
            question={question}
            setQuestion={setQuestion}
            website={website}
            setWebsite={setWebsite}
            status={status}
            message={message}
            remaining={remaining}
            onSubmit={submitQuestion}
            onClose={() => setComposerOpen(false)}
          />
        ) : null}

        <div className="divide-y divide-slate-100">
          {sortedThreads.map((thread) => {
            const lastReply = thread.replies.at(-1);
            const lastActivity = lastReply?.createdAt ?? thread.createdAt;
            const opened = openThreadId === thread.id;
            const pages = getThreadPages(thread);
            return (
              <article key={thread.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => setOpenThreadId(opened ? "" : thread.id)}
                  className="grid w-full grid-cols-[1fr_auto] gap-3 px-5 py-4 text-left transition hover:bg-yellow-50/40 lg:px-8"
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2 text-sm">
                      <span className="text-yellow-500" aria-hidden="true">
                        {activeTab === "hot" || thread.replies.length > 0 ? "⚡" : "●"}
                      </span>
                      <span className="truncate font-semibold text-sky-700">{thread.name}</span>
                      <span className="shrink-0 text-slate-400">{formatTime(thread.createdAt)}</span>
                      <span className="shrink-0 text-slate-400">👍 {getThreadScore(thread)}</span>
                    </div>
                    <h3 className="mt-2 text-[17px] font-medium leading-7 text-slate-900 lg:text-xl lg:leading-8">
                      {thread.question}
                    </h3>
                  </div>

                  <div className="flex min-w-[74px] flex-col items-end justify-between gap-2">
                    <div className="text-sm text-slate-400">
                      {pages} 页 <span aria-hidden="true">⌄</span>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      {thread.topic}
                    </span>
                  </div>
                </button>

                {opened ? (
                  <div className="border-t border-slate-100 bg-slate-50">
                    <div className="grid grid-cols-[76px_1fr] gap-3 px-5 py-4 lg:grid-cols-[120px_1fr] lg:px-8">
                      <div className="text-sm">
                        <div className="font-semibold text-sky-700">{thread.name}</div>
                        <div className="mt-1 text-xs text-slate-400">楼主</div>
                      </div>
                      <div className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-800 shadow-sm lg:text-base lg:leading-8">
                        {thread.question}
                        <div className="mt-3 text-xs text-slate-400">{formatTime(thread.createdAt)}</div>
                      </div>
                    </div>

                    {thread.replies.length > 0 ? (
                      thread.replies.map((reply, index) => (
                        <div key={reply.id} className="grid grid-cols-[76px_1fr] gap-3 border-t border-slate-100 px-5 py-4 lg:grid-cols-[120px_1fr] lg:px-8">
                          <div className="text-sm">
                            <div className="font-semibold text-sky-700">{reply.name}</div>
                            <div className="mt-1 text-xs text-slate-400">#{index + 2}</div>
                          </div>
                          <div className="rounded-xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm lg:text-base lg:leading-8">
                            {reply.reply}
                            <div className="mt-3 text-xs text-slate-400">{formatTime(reply.createdAt)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-400 lg:px-8">
                        暂时未有回应，可以做第一个回应的人。
                      </div>
                    )}

                    <div className="border-t border-slate-100 px-5 py-4 lg:px-8">
                      <ReplyForm threadId={thread.id} onReply={addReply} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-5 pb-3 text-xs text-slate-400">
                    <span>{thread.replies.length} 个回应</span>
                    <span>最后更新 {formatTime(lastActivity)}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 grid h-16 grid-cols-4 border-t border-yellow-300 bg-yellow-400 text-slate-950 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] md:hidden">
        <a href="/community" className="flex items-center justify-center text-3xl" aria-label="菜单">
          ≡
        </a>
        <button type="button" onClick={() => window.location.reload()} className="flex items-center justify-center text-2xl" aria-label="重新整理">
          ↻
        </button>
        <button type="button" onClick={() => setComposerOpen((value) => !value)} className="flex items-center justify-center text-4xl" aria-label="发表主题">
          +
        </button>
        <a href="/consulting#wechat" className="flex items-center justify-center text-2xl" aria-label="设置">
          ⚙
        </a>
      </div>
    </div>
  );
}

function ForumComposer({
  name,
  setName,
  topic,
  setTopic,
  question,
  setQuestion,
  website,
  setWebsite,
  status,
  message,
  remaining,
  onSubmit,
  onClose,
}: {
  name: string;
  setName: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  question: string;
  setQuestion: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  status: "idle" | "sending" | "success" | "error";
  message: string;
  remaining: number;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="border-b border-slate-200 bg-yellow-50/60 px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-yellow-700">发表主题</div>
          <div className="mt-1 text-xs text-slate-500">问题会公开显示，请不要公开 API Key、密码或验证码。</div>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
          收起
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[160px_160px_1fr]">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={24}
          placeholder="昵称"
          className="h-11 rounded-xl text-sm"
        />
        <select
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
        >
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
        required
        minLength={6}
        maxLength={500}
        rows={4}
        placeholder="例如：请问大家，我是 AI 新手，应该从哪里入手学习 AI？"
        className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{message}</span>
        <span>{remaining}</span>
      </div>
      <Button type="submit" size="lg" disabled={status === "sending" || question.trim().length < 6} className="mt-4 w-full rounded-xl bg-yellow-400 text-slate-950 hover:bg-yellow-300">
        {status === "sending" ? "发表中..." : "发表主题"}
      </Button>
    </form>
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
    <form onSubmit={submitReply} className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="grid gap-2 sm:grid-cols-[128px_1fr_auto]">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={24}
          placeholder="昵称"
          className="h-10 rounded-lg text-sm"
        />
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <input
          value={reply}
          onChange={(event) => setReply(event.target.value.slice(0, 500))}
          required
          minLength={2}
          maxLength={500}
          placeholder="公开回应这个问题..."
          className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
        />
        <Button type="submit" size="sm" disabled={status === "sending" || reply.trim().length < 2} className="rounded-lg bg-yellow-400 text-slate-950 hover:bg-yellow-300">
          {status === "sending" ? "发送中" : "回应"}
        </Button>
      </div>
      {message ? <div className="mt-2 text-sm text-rose-600">{message}</div> : null}
    </form>
  );
}
