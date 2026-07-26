"use client";

import { useRouter, usePathname } from "next/navigation";

export function ClearFiltersLink() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <button
      type="button"
      onClick={() => router.push(pathname)}
      className="text-sm text-violet-600 hover:text-violet-700"
    >
      清除全部筛选
    </button>
  );
}
