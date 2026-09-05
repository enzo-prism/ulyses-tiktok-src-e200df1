"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  Film,
  Layers3,
  MessageSquare,
  Scissors,
  ClipboardCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  cutById,
  dayKey,
  formatDateTime,
  pipelineCounts,
  weekDays,
  weekPosts,
} from "@/lib/engine";
import { useEngine } from "@/lib/store";

const pipeline = [
  {
    label: "Raw footage",
    href: "/library",
    icon: Layers3,
    key: "raw" as const,
  },
  {
    label: "In editing",
    href: "/edit",
    icon: Scissors,
    key: "inProgressCuts" as const,
  },
  {
    label: "Awaiting review",
    href: "/pick",
    icon: ClipboardCheck,
    key: "readyCuts" as const,
  },
  {
    label: "Blocked",
    href: "/publishing",
    icon: MessageSquare,
    key: "blocked" as const,
  },
];

export function TodayView() {
  const { state } = useEngine();
  const week = weekPosts(state);
  const counts = pipelineCounts(state);
  const days = weekDays(
    state.meta.reportingWeek.start,
    state.meta.reportingWeek.end,
  );
  return (
    <div className="space-y-10">
      <section
        aria-label="Pipeline counts"
        className="grid grid-cols-2 overflow-hidden rounded-lg border border-border xl:grid-cols-4"
      >
        {pipeline.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group border-border p-5 transition-colors hover:bg-zinc-50 sm:p-6 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t xl:[&:nth-child(n+2)]:border-l xl:[&:nth-child(n+3)]:border-t-0"
          >
            <div className="mb-5 flex items-center gap-2 text-muted-foreground">
              <item.icon className="size-4" strokeWidth={1.7} />
              <h2 className="text-xs font-medium">{item.label}</h2>
            </div>
            <p className="tnum text-[32px] font-semibold leading-none tracking-tight">
              {counts[item.key]}
            </p>
          </Link>
        ))}
      </section>

      {week.blocked.length > 0 ? (
        <section
          aria-label="Needs your input"
          className="flex flex-col gap-5 rounded-lg border border-border bg-zinc-50 p-6 sm:flex-row sm:items-start"
        >
          <span className="flex shrink-0 self-start items-center justify-center pt-0.5 text-amber-700">
            <MessageSquare className="size-5" strokeWidth={1.6} />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">Blocked content</h2>
            {week.blocked.map((post) => (
              <div key={post.id} className="mt-2">
                <p className="text-sm font-medium">
                  {cutById(state, post.cutId)?.title}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {post.blockedReason}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/publishing">
              Review blockers
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </section>
      ) : null}

      <section aria-label="Content calendar" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Publishing calendar
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Sample schedule · {state.meta.reportingWeek.label},{" "}
              {state.meta.reportingWeek.start.slice(0, 4)}
            </p>
          </div>
          <Link
            href="/publishing"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary"
          >
            <CalendarDays className="size-4" />
            Manage schedule
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((day, index) => {
              const posts = [
                ...week.posted.filter(
                  (post) => dayKey(post.postedAt) === day.iso,
                ),
                ...week.scheduled.filter(
                  (post) => dayKey(post.scheduledFor) === day.iso,
                ),
              ];
              return (
                <div
                  key={day.iso}
                  className={`min-w-0 border-b border-border p-3.5 last:border-b-0 lg:min-h-[205px] lg:border-b-0 ${index > 0 ? "lg:border-l" : ""}`}
                >
                  <div className="mb-5 flex items-baseline justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {day.short}
                    </span>
                    <span className="tnum text-sm font-semibold">
                      {Number(day.iso.slice(-2))}
                    </span>
                  </div>
                  {posts.length ? (
                    posts.map((post) => (
                      <Link
                        key={post.id}
                        href="/publishing"
                        className="mb-2 block rounded-md border border-border bg-zinc-50 p-2.5 transition-colors hover:bg-zinc-100"
                      >
                        <span
                          className={`mb-2 flex items-center gap-1 text-[10px] font-medium ${post.status === "posted" ? "text-emerald-700" : "text-zinc-600"}`}
                        >
                          {post.status === "posted" ? (
                            <Check className="size-3" />
                          ) : (
                            <Clock3 className="size-3" />
                          )}
                          {post.status === "posted" ? "Posted" : "Scheduled"}
                        </span>
                        <p className="text-xs font-medium leading-5">
                          {cutById(state, post.cutId)?.title}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="py-3 text-center text-[11px] text-slate-400 lg:pt-7">
                      No posts
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-slate-50/40 px-5 py-3">
            <p className="text-[11px] text-muted-foreground">
              All times Pacific · Sample schedule
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Posted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-zinc-400" />
                Scheduled
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <section
          aria-label="Next scheduled post"
          className="rounded-lg border border-border p-6 sm:p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold">Next scheduled post</h2>
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
          {week.nextUp ? (
            <>
              <div className="mb-5 flex items-start gap-4">
                <span className="flex shrink-0 items-center justify-center pt-1 text-muted-foreground">
                  <Film className="size-6" strokeWidth={1.5} />
                </span>
                <div>
                  <StatusBadge value={week.nextUp.status} />
                  <h3 className="mt-2 text-lg font-medium leading-6 tracking-tight">
                    {cutById(state, week.nextUp.cutId)?.title}
                  </h3>
                </div>
              </div>
              <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                {week.nextUp.hook}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  {week.nextUp.scheduledFor
                    ? formatDateTime(week.nextUp.scheduledFor)
                    : "Ready to schedule"}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/publishing">
                    View post
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No approved posts are scheduled.
            </p>
          )}
        </section>
        <section
          aria-label="Recently posted"
          className="rounded-lg border border-border p-6 sm:p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recently posted</h2>
            <span className="text-xs text-muted-foreground">Sample posts</span>
          </div>
          <div className="divide-y">
            {week.posted.length ? (
              week.posted.map((post) => (
                <div
                  className="flex items-start gap-3 py-4 first:pt-0"
                  key={post.id}
                >
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center text-muted-foreground">
                    <CircleCheck className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-6">
                      {cutById(state, post.cutId)?.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(post.postedAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Posted content will appear here.
              </p>
            )}
          </div>
          <Link
            href="/performance"
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary"
          >
            View performance
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
