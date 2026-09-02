"use client";

import { CircleCheck, Scissors } from "lucide-react";
import { toast } from "sonner";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assetById, type Cut } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function EditView() {
  const { state, dispatch } = useEngine();
  const inProgress = state.cuts.filter((cut) => cut.status === "in-progress");
  const ready = state.cuts.filter((cut) => cut.status === "ready-to-review" && cut.pick !== "approved");

  const rows = (cuts: Cut[]) =>
    cuts.map((cut) => {
      const asset = assetById(state, cut.assetId);
      return (
        <TableRow key={cut.id}>
          <TableCell>
            <div className="font-medium">{cut.title}</div>
            <div className="text-xs text-muted-foreground">{cut.hook || "Hook still needs a line."}</div>
          </TableCell>
          <TableCell>{asset ? <StatusBadge value={asset.sourceKind} /> : null}</TableCell>
          <TableCell>
            <StatusBadge value={cut.status} />
          </TableCell>
          <TableCell className="text-right tnum">{cut.duration}</TableCell>
          <TableCell className="text-right">
            {cut.status === "in-progress" ? (
              <Button
                size="sm"
                onClick={() => {
                  dispatch({ type: "mark-cut-ready", cutId: cut.id });
                  toast.message("Ready to review");
                }}
              >
                <CircleCheck />
                Mark ready to review
              </Button>
            ) : (
              <StatusBadge value={cut.pick} />
            )}
          </TableCell>
        </TableRow>
      );
    });

  return (
    <div className="space-y-4">
      <SampleAlert compact />
      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            <Scissors />
            In progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            <CircleCheck />
            Ready to review ({ready.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cut</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>{inProgress.length ? rows(inProgress) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">Edit bay is clear.</TableCell>
                </TableRow>
              )}</TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="ready">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cut</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>{ready.length ? rows(ready) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">Nothing waiting on a pick.</TableCell>
                </TableRow>
              )}</TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
