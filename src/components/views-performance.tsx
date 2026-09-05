"use client";

import {
  BarChart3,
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  Database,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cutById,
  formatCount,
  formatDateTime,
  metricsForPost,
} from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function PerformanceView() {
  const { state } = useEngine();
  const posted = state.posts.filter((post) => post.status === "posted");
  const rows = posted.map((post) => ({
    ...post,
    title: cutById(state, post.cutId)?.title ?? "Untitled video",
    metrics: metricsForPost(state, post.id),
  }));
  const totals = rows.reduce(
    (acc, { metrics }) => ({
      views: acc.views + (metrics?.views ?? 0),
      likes: acc.likes + (metrics?.likes ?? 0),
      comments: acc.comments + (metrics?.comments ?? 0),
      saves: acc.saves + (metrics?.saves ?? 0),
    }),
    { views: 0, likes: 0, comments: 0, saves: 0 },
  );
  const comparison = rows
    .filter((row) => row.metrics)
    .sort((a, b) => b.metrics!.views - a.metrics!.views);
  const maxViews = Math.max(1, ...comparison.map((row) => row.metrics!.views));
  const metrics = [
    ["Views", totals.views, Eye, "Times watched"],
    ["Likes", totals.likes, Heart, "Audience reactions"],
    ["Comments", totals.comments, MessageCircle, "Conversations started"],
    ["Saves", totals.saves, Bookmark, "Saved for later"],
  ] as const;

  return (
    <div className="space-y-10">
      <section
        aria-label="Sample performance totals"
        className="grid grid-cols-2 overflow-hidden rounded-lg border border-border xl:grid-cols-4"
      >
        {metrics.map(([label, value, Icon]) => (
          <div
            key={label}
            className="border-border p-5 sm:p-6 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t xl:[&:nth-child(n+2)]:border-l xl:[&:nth-child(n+3)]:border-t-0"
          >
            <div className="mb-5 flex items-center gap-2 text-muted-foreground">
              <Icon aria-hidden="true" className="size-4" />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="tnum text-[32px] font-semibold leading-none tracking-tight">
              {formatCount(value)}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Sample total</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="gap-7 rounded-lg border border-zinc-200 bg-white p-6 ring-0 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                Views by video
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                Sample posts ranked by total views.
              </p>
            </div>
            <BarChart3
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-muted-foreground"
            />
          </div>
          {comparison.length ? (
            <div className="space-y-6">
              {comparison.map((row) => (
                <div key={row.id}>
                  <div className="mb-2.5 flex items-start justify-between gap-5 text-sm">
                    <span className="min-w-0 font-medium leading-relaxed text-zinc-700">
                      {row.title}
                    </span>
                    <span className="tnum shrink-0 font-semibold text-zinc-950">
                      {formatCount(row.metrics!.views)}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-2.5 overflow-hidden rounded-full bg-zinc-100"
                  >
                    <div
                      className="h-full rounded-full bg-zinc-700"
                      style={{
                        width: `${(row.metrics!.views / maxViews) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-5 text-sm text-zinc-500">
              Post results will appear here when they are available.
            </p>
          )}
          <p className="border-t border-zinc-100 pt-4 text-sm leading-relaxed text-zinc-500">
            Bars compare total views across these examples. They do not show
            growth over time.
          </p>
        </Card>

        <Card className="gap-6 rounded-lg border border-border bg-white p-6 ring-0 sm:p-7">
          <div className="flex items-center gap-2">
            <Database
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <h2 className="text-base font-semibold">Data coverage</h2>
          </div>
          <dl className="divide-y text-sm">
            <div className="flex justify-between gap-4 pb-4">
              <dt className="text-muted-foreground">Data source</dt>
              <dd className="font-medium">Sample dataset</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-muted-foreground">Posts with metrics</dt>
              <dd className="tnum font-medium">
                {comparison.length} of {rows.length}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-muted-foreground">TikTok account</dt>
              <dd className="font-medium">Not connected</dd>
            </div>
          </dl>
          <p className="text-sm leading-6 text-muted-foreground">
            Audience growth and historical trends require connected account
            insights. Current totals reflect sample post metrics only.
          </p>
        </Card>
      </div>

      <Card className="gap-0 rounded-lg border border-zinc-200 bg-white py-0 ring-0">
        <div className="border-b border-zinc-100 p-6 sm:px-7">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Post results
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            Sample numbers for each posted video.
          </p>
        </div>
        {!rows.length ? (
          <p className="p-7 text-sm text-zinc-500">
            No posted videos to show yet.
          </p>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/70 hover:bg-zinc-50/70">
                    <TableHead className="px-7 py-4 text-sm text-zinc-500">
                      Video
                    </TableHead>
                    {["Views", "Likes", "Comments", "Saves"].map((label) => (
                      <TableHead
                        key={label}
                        className="px-5 text-right text-sm text-zinc-500"
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-zinc-100 hover:bg-zinc-50/60"
                    >
                      <TableCell className="max-w-sm whitespace-normal px-7 py-5">
                        <p className="text-sm font-medium leading-6 text-zinc-800">
                          {row.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {formatDateTime(row.postedAt)}
                        </p>
                      </TableCell>
                      {(["views", "likes", "comments", "saves"] as const).map(
                        (key) => (
                          <TableCell
                            key={key}
                            className="tnum px-5 text-right text-sm text-zinc-700"
                          >
                            {row.metrics ? formatCount(row.metrics[key]) : "—"}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="divide-y divide-zinc-100 md:hidden">
              {rows.map((row) => (
                <article key={row.id} className="p-5">
                  <h3 className="text-sm font-medium leading-6 text-zinc-800">
                    {row.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatDateTime(row.postedAt)}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
                    {(["views", "likes", "comments", "saves"] as const).map(
                      (key) => (
                        <div key={key}>
                          <dt className="text-sm capitalize text-zinc-500">
                            {key}
                          </dt>
                          <dd className="tnum mt-1 text-base font-semibold text-zinc-800">
                            {row.metrics ? formatCount(row.metrics[key]) : "—"}
                          </dd>
                        </div>
                      ),
                    )}
                  </dl>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
