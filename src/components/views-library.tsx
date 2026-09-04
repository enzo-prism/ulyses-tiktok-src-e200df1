"use client";

import { useMemo, useState } from "react";
import {
  CircleCheck,
  Clapperboard,
  Clock3,
  FolderOpen,
  MapPin,
  Scissors,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, type LibraryStatus, type SourceKind } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function LibraryView() {
  const { state, dispatch } = useEngine();
  const [source, setSource] = useState<SourceKind | "all">("all");
  const [status, setStatus] = useState<LibraryStatus | "all">("all");
  const [search, setSearch] = useState("");
  const items = useMemo(
    () =>
      state.assets.filter(
        (asset) =>
          (source === "all" || asset.sourceKind === source) &&
          (status === "all" || asset.status === status) &&
          `${asset.title} ${asset.location}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [source, state.assets, status, search],
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Your footage{" "}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {state.assets.length} assets
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Find the moments worth turning into something new.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search footage"
              placeholder="Search footage…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 pl-10"
            />
          </div>
          <Select
            value={source}
            onValueChange={(value) => setSource(value as SourceKind | "all")}
          >
            <SelectTrigger className="h-10 w-full sm:w-40" aria-label="Source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="tv">TV</SelectItem>
              <SelectItem value="interview">Interviews</SelectItem>
              <SelectItem value="library-clip">Library clips</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as LibraryStatus | "all")}
          >
            <SelectTrigger className="h-10 w-full sm:w-36" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="raw">Raw</SelectItem>
              <SelectItem value="in-edit">In edit</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((asset) => (
          <Card
            key={asset.id}
            className="gap-6 p-6 shadow-none transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clapperboard className="size-5" />
              </div>
              <StatusBadge value={asset.status} />
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold leading-relaxed">
                {asset.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge value={asset.sourceKind} />
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  {asset.duration}
                </span>
              </div>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {asset.location}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
              <span className="text-xs text-muted-foreground">
                {formatDate(asset.capturedAt)}
              </span>
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
              ) : asset.status === "in-edit" ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    dispatch({ type: "mark-asset-ready", assetId: asset.id })
                  }
                >
                  <CircleCheck />
                  Mark ready
                </Button>
              ) : (
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
              )}
            </div>
          </Card>
        ))}
      </div>
      {!items.length && (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <FolderOpen className="mx-auto mb-4 size-7 text-muted-foreground" />
          <h3 className="font-medium">No matching footage</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search or clear your filters.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              setSearch("");
              setSource("all");
              setStatus("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
