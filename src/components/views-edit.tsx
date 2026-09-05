"use client";

import { CircleCheck, Clock3, Scissors, TextQuote } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assetById, type Cut } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function EditView() {
  const { state, dispatch } = useEngine();
  const inProgress = state.cuts.filter((cut) => cut.status === "in-progress");
  const ready = state.cuts.filter(
    (cut) => cut.status === "ready-to-review" && cut.pick !== "approved",
  );
  const cards = (cuts: Cut[]) =>
    cuts.length ? (
      <div className="grid gap-5 lg:grid-cols-2">
        {cuts.map((cut) => {
          const asset = assetById(state, cut.assetId);
          return (
            <Card key={cut.id} className="gap-6 p-6 shadow-none">
              <div className="flex items-start justify-between gap-3">
                <div className="flex shrink-0 self-start items-center text-muted-foreground">
                  <Scissors className="size-5" />
                </div>
                <StatusBadge value={cut.status} />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-relaxed">
                  {cut.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {asset?.title ?? "Source unavailable"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <TextQuote className="size-3.5" />
                  Opening hook
                </p>
                <p className="text-sm leading-relaxed">
                  {cut.hook || "No opening hook added."}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
                <div className="flex items-center gap-3">
                  {asset && <StatusBadge value={asset.sourceKind} />}
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {cut.duration}
                  </span>
                </div>
                {cut.status === "in-progress" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch({ type: "mark-cut-ready", cutId: cut.id });
                      toast.message("Ready to review");
                    }}
                  >
                    <CircleCheck />
                    Ready to review
                  </Button>
                ) : (
                  <StatusBadge value={cut.pick} />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    ) : (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <CircleCheck className="mx-auto mb-4 size-7 text-muted-foreground" />
        <h3 className="font-medium">This queue is clear</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Cuts will appear here as they move through the editing process.
        </p>
      </div>
    );

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Editing queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage cuts in progress and submit completed edits for review.
        </p>
      </div>
      <Tabs defaultValue="in-progress" className="gap-6">
        <TabsList className="h-auto! w-full justify-start gap-1 p-1 sm:w-fit">
          <TabsTrigger value="in-progress" className="px-3 py-2.5">
            <Scissors />
            In progress{" "}
            <span className="ml-1 text-xs text-muted-foreground">
              {inProgress.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="ready" className="px-3 py-2.5">
            <CircleCheck />
            Ready to review{" "}
            <span className="ml-1 text-xs text-muted-foreground">
              {ready.length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress">{cards(inProgress)}</TabsContent>
        <TabsContent value="ready">{cards(ready)}</TabsContent>
      </Tabs>
    </div>
  );
}
