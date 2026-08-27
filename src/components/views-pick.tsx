"use client";

import { toast } from "sonner";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { assetById, pickColumns, type PickDecision } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function PickView() {
  const { state, dispatch } = useEngine();
  const columns = pickColumns(state);
  const setPick = (cutId: string, pick: PickDecision) => {
    dispatch({ type: "set-pick", cutId, pick });
    toast.message(pick === "approved" ? "Approved for TikTok" : pick === "hold" ? "Held" : pick === "selected" ? "Selected" : "Returned to ready");
  };
  const board = [
    { key: "ready", title: "Ready", items: columns.ready },
    { key: "selected", title: "Selected", items: columns.selected },
    { key: "hold", title: "Hold", items: columns.hold },
  ] as const;

  return (
    <div className="space-y-4">
      <SampleAlert compact />
      <div className="grid gap-3 xl:grid-cols-3">
        {board.map((column) => (
          <div key={column.key} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium">{column.title}</h2>
              <span className="text-xs text-muted-foreground tnum">{column.items.length}</span>
            </div>
            {column.items.length === 0 ? (
              <Card size="sm">
                <CardContent className="text-sm text-muted-foreground">No {column.title.toLowerCase()} cuts.</CardContent>
              </Card>
            ) : (
              column.items.map((cut) => {
                const asset = assetById(state, cut.assetId);
                return (
                  <Card key={cut.id} size="sm">
                    <CardHeader>
                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge value={cut.pick} />
                        {asset ? <StatusBadge value={asset.sourceKind} /> : null}
                      </div>
                      <CardTitle>{cut.title}</CardTitle>
                      <CardDescription>{cut.hook}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {cut.pick !== "selected" ? (
                        <Button size="sm" variant="secondary" onClick={() => setPick(cut.id, "selected")}>
                          Select
                        </Button>
                      ) : null}
                      <Button size="sm" onClick={() => setPick(cut.id, "approved")}>
                        Approve for TikTok
                      </Button>
                      {cut.pick !== "hold" ? (
                        <Button size="sm" variant="outline" onClick={() => setPick(cut.id, "hold")}>
                          Hold
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => setPick(cut.id, "none")}>
                          Return to ready
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
