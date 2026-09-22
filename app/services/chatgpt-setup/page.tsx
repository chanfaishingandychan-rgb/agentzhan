import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { buildFaqSchema, buildServiceSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "ChatGPT 安装与基础设置协助",
  description:
    "面向 AI 新手的 ChatGPT 安装、登录检查、中文设置和基础使用协助。先确认设备与需求，不代买账号、不索取密码。",
  keywords: ["ChatGPT安装", "ChatGPT设置", "GPT安装协助", "ChatGPT新手教学", "AI工具安装"],
  alternates: {
    canonical: "/services/chatgpt-setup",
  },
  openGraph: {
    title: "ChatGPT 安装与基础设置协助 - Agent站",
    description: "协助 AI 新手完成官方 ChatGPT 安装、基础设置和首次使用。",
    url: `${siteConfig.url}/services/chatgpt-setup`,
    type: "website",
  },
};

const deliverables = [
  {
    title: "安装与入口确认",
    description: "按你的手机或电脑，确认正确的官方入口、安装方式和基本运行情况。",
  },
  {
    title: "登录与基础设置",
    description: "陪你完成登录检查、语言与常用选项设置，并说明免费版和付费版的差别。",
  },
  {
    title: "第一次实际使用",
    description: "用一个真实任务示范怎样提问、追问和修改结果，让你安装后马上会用。",
  },
  {
    title: "新手提示词清单",
    description: "提供办公、写作、资料整理等常用提示词，方便之后自己继续练习。",
  },
];

const processSteps = [
  ["先发设备资料", "告诉我使用 iPhone、Android、Mac 或 Windows，以及目前卡在哪一步。"],
  ["确认能否协助", "先判断问题属于安装、账号、网络还是使用方法，再说明可做范围和费用。"],
  ["完成安装与教学", "按确认好的方式完成设置，并用一个实际任务检查你是否已经会用。"],
];

const faqItems = [
  {
    question: "你会帮我购买或注册 ChatGPT 账号吗？",
    answer: "不会代买、出租或接管账号。服务只协助官方安装、登录检查、基础设置和使用教学。",
  },
  {
    question: "需要把密码交给你吗？",
    answer: "不需要。密码和验证码应由你自己输入，不要通过微信或其他方式发送给任何人。",
  },
  {
    question: "所有手机和电脑都一定可以安装吗？",
    answer: "不保证。设备系统、账号地区和网络环境都会影响结果，所以会先免费确认基本情况，再决定是否需要服务。",
  },
  {
    question: "安装后会教我怎样使用吗？",
    answer: "会。完成设置后会用一个真实任务示范基本提问、追问和修改方法，避免装好以后仍然不会用。",
  },
];

export default function ChatGptSetupServicePage() {
  const serviceSchema = buildServiceSchema({
    name: "Agent站 ChatGPT 安装与基础设置协助",
    description: "为 AI 新手提供官方 ChatGPT 安装、登录检查、基础设置和首次使用教学。",
    url: `${siteConfig.url}/services/chatgpt-setup`,
    serviceType: ["ChatGPT 安装协助", "ChatGPT 基础设置", "AI 新手教学"],
  });
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="violet">AI 新手服务</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              ChatGPT 安装与基础设置协助
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              不知道该下载哪个、登录后怎样设置，或者安装好仍然不会用？先把设备和问题发来，我会先判断能否协助，再说明做法和费用。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#wechat-contact"
                className="inline-flex h-12 items-center rounded-full bg-slate-950 px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                微信说明你的设备
              </a>
              <Link
                href="/guides/chatgpt-beginner-workflow"
                className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
              >
                先看免费新手教程
              </Link>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              安全说明：不代买账号、不出租账号、不索取密码或验证码，也不提供绕过平台规则的服务。
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-violet-50/60 p-6 sm:p-8">
            <div className="text-sm font-semibold text-violet-700">联系前准备</div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">发来这 3 项，判断会更快</h2>
            <div className="mt-6 grid gap-4">
              {["设备：iPhone / Android / Mac / Windows", "问题：下载、登录、设置，还是不会使用", "截图：隐藏账号、密码和验证码后再发送"].map(
                (item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-7 text-slate-700">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge variant="blue">服务内容</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">不是只帮你装好，还要让你会用</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <Badge variant="success">处理流程</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">先判断，再决定是否需要付费</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              有些问题看一张截图就能说明，不一定需要付费服务。确认确实需要协助后，才会讲清楚范围、方式和费用。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-violet-700">步骤 {index + 1}</div>
                <h3 className="mt-3 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="wechat-contact" className="scroll-mt-24 border-y border-slate-200 bg-slate-950 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 px-4 sm:px-6 md:grid-cols-[auto_1fr] md:items-center lg:px-8">
          <div className="w-fit rounded-2xl bg-white p-3">
            <Image src="/wechat-qr.jpg" alt="Agent站 ChatGPT 安装协助微信二维码" width={200} height={200} className="h-48 w-48" />
          </div>
          <div>
            <Badge variant="violet">微信咨询</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">先发设备和问题，不要发密码</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              加微信后说明「ChatGPT 安装」，再写上设备型号和目前卡住的步骤。请把截图中的账号、密码、验证码和付款资料遮住。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="blue">常见问题</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">联系前先看这里</h2>
          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-950">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
