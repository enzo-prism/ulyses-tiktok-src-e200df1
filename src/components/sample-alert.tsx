import { FlaskConical } from "lucide-react";

export function SampleAlert({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      aria-label="Sample workspace notice"
      className="mb-9 flex items-start gap-3 rounded-xl border border-violet-100/80 bg-violet-50/40 px-4 py-3 text-xs leading-5 text-slate-600"
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0 text-violet-500" />
      <p>
        <span className="font-semibold text-violet-800">Demo workspace</span>
        <span className="mx-2 text-violet-200">/</span>
        {compact
          ? "Sample content and results. TikTok is not connected."
          : "Explore the workflow with sample content and results. TikTok is not connected."}
      </p>
    </aside>
  );
}
