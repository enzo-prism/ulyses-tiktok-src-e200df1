"use client";

import {
  BarChart3,
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  Users,
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
    <div className="space-y-7">
      <section
        aria-label="Sample performance totals"
        className="grid grid-cols-2 gap-4 xl:grid-cols-4"
      >
        {metrics.map(([label, value, Icon, description]) => (
          <Card
            key={label}
            className="gap-5 rounded-2xl border border-slate-200 bg-white p-5 ring-0 sm:p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">
                {label}
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </div>
            <div>
              <p className="tnum text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {formatCount(value)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {description} · Sample
              </p>
            </div>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="gap-7 rounded-2xl border border-slate-200 bg-white p-6 ring-0 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                Views by video
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                A side-by-side look at the sample posts.
              </p>
            </div>
            <BarChart3
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-violet-500"
            />
          </div>
          {comparison.length ? (
            <div className="space-y-6">
              {comparison.map((row) => (
                <div key={row.id}>
                  <div className="mb-2.5 flex items-start justify-between gap-5 text-sm">
                    <span className="min-w-0 font-medium leading-relaxed text-slate-700">
                      {row.title}
                    </span>
                    <span className="tnum shrink-0 font-semibold text-slate-950">
                      {formatCount(row.metrics!.views)}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-2.5 overflow-hidden rounded-full bg-violet-50"
                  >
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${(row.metrics!.views / maxViews) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-5 text-sm text-slate-500">
              Post results will appear here when they are available.
            </p>
          )}
          <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-500">
            Bars compare total views across these examples. They do not show
            growth over time.
          </p>
        </Card>

        <Card className="justify-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 ring-0 sm:p-7">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Users aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              The bigger picture
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Your audience growth is not connected yet. Once we have your
              account insights, we can establish a starting point and see how
              your audience changes.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Start with the right questions
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Which topics keep people watching? Which messages lead to a save,
              a follow, or a conversation?
            </p>
          </div>
        </Card>
      </div>

      <Card className="gap-0 rounded-2xl border border-slate-200 bg-white py-0 ring-0">
        <div className="border-b border-slate-100 p-6 sm:px-7">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Post results
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Sample numbers for each posted video.
          </p>
        </div>
        {!rows.length ? (
          <p className="p-7 text-sm text-slate-500">
            No posted videos to show yet.
          </p>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                    <TableHead className="px-7 py-4 text-sm text-slate-500">
                      Video
                    </TableHead>
                    {["Views", "Likes", "Comments", "Saves"].map((label) => (
                      <TableHead
                        key={label}
                        className="px-5 text-right text-sm text-slate-500"
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
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="max-w-sm whitespace-normal px-7 py-5">
                        <p className="text-sm font-medium leading-6 text-slate-800">
                          {row.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDateTime(row.postedAt)}
                        </p>
                      </TableCell>
                      {(["views", "likes", "comments", "saves"] as const).map(
                        (key) => (
                          <TableCell
                            key={key}
                            className="tnum px-5 text-right text-sm text-slate-700"
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
            <div className="divide-y divide-slate-100 md:hidden">
              {rows.map((row) => (
                <article key={row.id} className="p-5">
                  <h3 className="text-sm font-medium leading-6 text-slate-800">
                    {row.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(row.postedAt)}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
                    {(["views", "likes", "comments", "saves"] as const).map(
                      (key) => (
                        <div key={key}>
                          <dt className="text-sm capitalize text-slate-500">
                            {key}
                          </dt>
                          <dd className="tnum mt-1 text-base font-semibold text-slate-800">
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
