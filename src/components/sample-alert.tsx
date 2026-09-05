import { Info } from "lucide-react";

export function SampleAlert({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      aria-label="Sample workspace notice"
      className="mb-9 flex items-start gap-3 rounded-md border border-border bg-zinc-50 px-4 py-3 text-xs leading-5 text-slate-600"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>
        <span className="font-semibold text-foreground">Demo workspace</span>
        <span className="mx-2 text-zinc-300">/</span>
        {compact
          ? "Sample content and results. TikTok is not connected."
          : "Sample content and results. TikTok is not connected."}
      </p>
    </aside>
  );
}
