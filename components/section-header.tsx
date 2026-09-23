import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-8", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <span className="h-px w-5 bg-emerald-600" aria-hidden="true" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold text-neutral-950 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}
