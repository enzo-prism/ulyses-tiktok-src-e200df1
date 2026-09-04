"use client";

import {
  Check,
  CircleCheck,
  Clock3,
  Clapperboard,
  MousePointerClick,
  Pause,
  Sparkles,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { assetById, pickColumns, type PickDecision } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function PickView() {
  const { state, dispatch } = useEngine();
  const columns = pickColumns(state);
  const setPick = (cutId: string, pick: PickDecision) => {
    dispatch({ type: "set-pick", cutId, pick });
    toast.message(
      pick === "approved"
        ? "Approved for TikTok"
        : pick === "hold"
          ? "Held"
          : pick === "selected"
            ? "Selected"
            : "Returned to ready",
    );
  };
  const board = [
    {
      key: "ready",
      title: "Ready to review",
      description: "Fresh cuts, ready for your eye.",
      items: columns.ready,
      icon: CircleCheck,
      color: "bg-slate-100 text-slate-600",
    },
    {
      key: "selected",
      title: "Your shortlist",
      description: "The ideas you want to take forward.",
      items: columns.selected,
      icon: MousePointerClick,
      color: "bg-violet-100 text-violet-700",
    },
    {
      key: "hold",
      title: "On hold",
      description: "Save these for another moment.",
      items: columns.hold,
      icon: Pause,
      color: "bg-amber-100 text-amber-700",
    },
  ] as const;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Choose what goes next
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shortlist an idea, hold it for later, or approve it for the posting
          queue.
        </p>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-3">
        {board.map((column) => (
          <section key={column.key} className="min-w-0 space-y-4">
            <div className="px-1">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-lg ${column.color}`}
                >
                  <column.icon className="size-4" />
                </span>
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {column.items.length}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {column.description}
              </p>
            </div>
            {column.items.length === 0 ? (
              <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                No cuts here yet.
              </div>
            ) : (
              column.items.map((cut) => {
                const asset = assetById(state, cut.assetId);
                return (
                  <Card key={cut.id} className="gap-5 p-5 shadow-none">
                    <div className="flex items-center justify-between gap-3">
                      <Clapperboard className="size-5 text-violet-500" />
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        {cut.duration}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold leading-relaxed">
                        {cut.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {asset?.title ?? "Source unavailable"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={cut.pick} />
                      {asset && <StatusBadge value={asset.sourceKind} />}
                    </div>
                    <div className="rounded-lg bg-muted/40 p-4">
                      <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Sparkles className="size-3.5" />
                        Opening hook
                      </p>
                      <p className="text-sm leading-relaxed">
                        {cut.hook || "No hook added yet."}
                      </p>
                    </div>
                    <div className="space-y-2 border-t border-border/70 pt-4">
                      <Button
                        className="w-full"
                        onClick={() => setPick(cut.id, "approved")}
                      >
                        <Check />
                        Approve for TikTok
                      </Button>
                      <div className="flex gap-2">
                        {cut.pick !== "selected" && (
                          <Button
                            className="flex-1"
                            size="sm"
                            variant="secondary"
                            onClick={() => setPick(cut.id, "selected")}
                          >
                            <MousePointerClick />
                            Select
                          </Button>
                        )}
                        {cut.pick !== "hold" ? (
                          <Button
                            className="flex-1"
                            size="sm"
                            variant="outline"
                            onClick={() => setPick(cut.id, "hold")}
                          >
                            <Pause />
                            Hold
                          </Button>
                        ) : (
                          <Button
                            className="flex-1"
                            size="sm"
                            variant="outline"
                            onClick={() => setPick(cut.id, "none")}
                          >
                            <Undo2 />
                            Return to ready
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
