"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Clapperboard, Scissors } from "lucide-react";
import { toast } from "sonner";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, type LibraryStatus, type SourceKind } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function LibraryView() {
  const { state, dispatch } = useEngine();
  const [source, setSource] = useState<SourceKind | "all">("all");
  const [status, setStatus] = useState<LibraryStatus | "all">("all");
  const items = useMemo(
    () =>
      state.assets.filter(
        (asset) => (source === "all" || asset.sourceKind === source) && (status === "all" || asset.status === status),
      ),
    [source, state.assets, status],
  );

  return (
    <div className="space-y-4">
      <SampleAlert compact />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={source} onValueChange={(value) => setSource(value as SourceKind | "all")}>
          <SelectTrigger className="sm:w-48" aria-label="Source">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="tv">TV</SelectItem>
            <SelectItem value="interview">Interviews</SelectItem>
            <SelectItem value="library-clip">Library clips</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as LibraryStatus | "all")}>
          <SelectTrigger className="sm:w-44" aria-label="Status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="raw">Raw</SelectItem>
            <SelectItem value="in-edit">In edit</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Captured</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No footage matches these filters.
                </TableCell>
              </TableRow>
            ) : null}
            {items.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="font-medium">{asset.title}</div>
                  <div className="text-xs text-muted-foreground">{asset.location}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge value={asset.sourceKind} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={asset.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(asset.capturedAt)}</TableCell>
                <TableCell className="text-right tnum">{asset.duration}</TableCell>
                <TableCell className="text-right">
                  {asset.status === "raw" ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        dispatch({ type: "send-to-edit", assetId: asset.id });
                        toast.message("Sent to edit");
                      }}
                    >
                      <Scissors />
                      Send to edit
                    </Button>
                  ) : null}
                  {asset.status === "in-edit" ? (
                    <Button size="sm" variant="secondary" onClick={() => dispatch({ type: "mark-asset-ready", assetId: asset.id })}>
                      <CircleCheck />
                      Mark ready
                    </Button>
                  ) : null}
                  {asset.status === "ready" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        dispatch({ type: "send-to-edit", assetId: asset.id });
                        toast.message("Opened another cut");
                      }}
                    >
                      <Clapperboard />
                      Open another cut
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
