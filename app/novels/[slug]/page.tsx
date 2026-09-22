import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NovelCover } from "@/app/novels/novel-cover";
import { getAllNovels, getNovelBySlug } from "@/lib/novels";
import { siteConfig } from "@/lib/site";

type NovelPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNovels().map((novel) => ({ slug: novel.slug }));
}

export async function generateMetadata({ params }: NovelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  if (!novel) return {};

  return {
    title: novel.title,
    description: novel.description,
    alternates: {
      canonical: `/novels/${slug}`,
    },
    openGraph: {
      title: `${novel.title} - Agent站 AI小说`,
      description: novel.description,
      url: `${siteConfig.url}/novels/${slug}`,
      locale: "zh_CN",
      type: "article",
    },
  };
}

export default async function NovelPage({ params }: NovelPageProps) {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  if (!novel) notFound();

  const firstChapter = novel.chapters[0];

  return (
    <main className="bg-[#fbfaf8]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/novels" className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
            返回 AI小说
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
            <NovelCover novel={novel} />
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {novel.status}
                </span>
                {novel.genre.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950">
                {novel.title}
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-500">{novel.subtitle}</p>
              <p className="mt-5 text-base leading-8 text-slate-600">{novel.description}</p>
              <div className="mt-6 text-sm text-slate-500">
                作者：{novel.author} · 更新：{novel.updatedAt} · {novel.chapters.length} 章
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[15rem_1fr] lg:px-8">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-bold text-slate-950">目录</div>
          <div className="mt-4 space-y-2">
            {novel.chapters.map((chapter) => (
              <a
                key={chapter.slug}
                href={`#${chapter.slug}`}
                className="block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                {chapter.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {firstChapter ? (
              <div className="space-y-12">
                {novel.chapters.map((chapter) => (
                  <section key={chapter.slug} id={chapter.slug} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">{chapter.title}</h2>
                    {chapter.summary ? (
                      <p className="mt-3 text-sm leading-7 text-slate-500">{chapter.summary}</p>
                    ) : null}
                    <div className="mt-6 space-y-5 text-[1.05rem] leading-9 text-slate-800">
                      {chapter.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
                这本小说已经建立作品页，章节正文待上传。
              </div>
            )}
          </article>

          <section className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm font-semibold text-violet-700">AI 创作资源</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              想用 AI 写小说、文案或工作内容？
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Agent站整理了免费的 AI 工作包，也有适合新手的教程和可下载 Prompt 包。读完故事后，可以顺手拿一套模板，试着把自己的想法变成作品或工作流程。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/free-ai-pack"
                className="inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                免费领取 AI 工作包
              </Link>
              <Link
                href="/guides/ai-novel-writing-with-chatgpt"
                className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-6 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:bg-violet-50"
              >
                看 AI 小说写作教程
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
