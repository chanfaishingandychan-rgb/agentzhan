"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  placeholder?: string;
  initialKeyword?: string;
  buttonLabel?: string;
  className?: string;
};

export function SearchBar({
  placeholder = "今天想用 AI 做什么？",
  initialKeyword = "",
  buttonLabel = "开始搜索",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = keyword.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_48px_rgba(15,23,42,0.10)] sm:flex-row",
        className,
      )}
    >
      <Input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        className="h-12 border-transparent bg-transparent shadow-none focus:border-transparent focus:ring-0"
        placeholder={placeholder}
        aria-label="搜索提示词"
      />
      <Button type="submit" size="lg" className="shrink-0 rounded-xl">
        {buttonLabel}
      </Button>
    </form>
  );
}
