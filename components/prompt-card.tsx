import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptItem } from "@/lib/prompts";

export function PromptCard({ prompt, compact = false }: { prompt: PromptItem; compact?: boolean }) {
  return (
    <Card as="article" className="group flex h-full flex-col">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="violet">{prompt.category.name}</Badge>
          <Badge variant="muted">{prompt.difficulty}</Badge>
          <Badge variant="blue">{prompt.model}</Badge>
          {prompt.tier === "vip" && <Badge variant="premium">VIP</Badge>}
        </div>
        <CardTitle className="pt-2">
          <Link href={`/prompt/${prompt.slug}`} className="transition hover:text-violet-600 line-clamp-2">
            {prompt.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm leading-6 text-slate-500 line-clamp-3">{prompt.summary}</p>
        {!compact ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {prompt.tags.slice(0, 4).map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link href={`/prompt/${prompt.slug}`} className="text-sm font-semibold text-violet-600">
          查看完整提示詞 &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
