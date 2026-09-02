"use client";

import Link from "next/link";
import { Ban, CalendarDays, CircleCheck, Clock, Film, LayoutGrid, Scissors } from "lucide-react";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cutById, dayKey, formatDateTime, pipelineCounts, weekDays, weekPosts } from "@/lib/engine";
import { useEngine } from "@/lib/store";

const pipeline = [
  { label: "Raw", href: "/library", icon: Film, key: "raw" as const },
  { label: "Edit", href: "/edit", icon: Scissors, key: "inProgressCuts" as const },
  { label: "Pick", href: "/pick", icon: LayoutGrid, key: "readyCuts" as const },
  { label: "Blocked", href: "/publishing", icon: Ban, key: "blocked" as const },
] as const;

export function TodayView() {
  const { state } = useEngine();
  const week = weekPosts(state);
  const counts = pipelineCounts(state);
  const days = weekDays(state.meta.reportingWeek.start, state.meta.reportingWeek.end);

  return (
    <div className="space-y-10">
      <SampleAlert />

      <section aria-label="Pipeline counts" className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {pipeline.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-muted/40 ${
                index % 2 === 1 ? "border-l border-border" : ""
              } ${index > 1 ? "border-t border-border sm:border-t-0" : ""} ${
                index > 0 ? "sm:border-l sm:border-border" : ""
              }`}
            >
              <item.icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-xl font-medium leading-none tnum">{counts[item.key]}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2" aria-label="This week">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-1.5 text-sm font-medium">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              This week
            </h2>
            <p className="text-xs text-muted-foreground">
              {state.meta.reportingWeek.label} · {state.meta.reportingWeek.start} → {state.meta.reportingWeek.end} PT
            </p>
            <div className="flex flex-wrap gap-1">
              <StatusBadge value="posted" />
              <StatusBadge value="scheduled" />
              <StatusBadge value="open" />
              <StatusBadge value="blocked" />
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/pick">
              <LayoutGrid />
              Open pick board
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => {
            const posted = week.posted.filter((post) => dayKey(post.postedAt) === day.iso);
            const scheduled = week.scheduled.filter((post) => dayKey(post.scheduledFor) === day.iso);
            const empty = posted.length === 0 && scheduled.length === 0;
            return (
              <Card key={day.iso} size="sm" className="gap-2">
                <CardHeader className="gap-0.5">
                  <CardDescription>{day.short}</CardDescription>
                  <CardTitle className="text-sm">{day.label.replace(/^\w+, /, "")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {posted.map((post) => (
                    <div key={post.id} className="space-y-1">
                      <StatusBadge value="posted" />
                      <p className="text-xs leading-4">{cutById(state, post.cutId)?.title}</p>
                    </div>
                  ))}
                  {scheduled.map((post) => (
                    <div key={post.id} className="space-y-1">
                      <StatusBadge value="scheduled" />
                      <p className="text-xs leading-4">{cutById(state, post.cutId)?.title}</p>
                    </div>
                  ))}
                  {empty ? <StatusBadge value="open" /> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-2 lg:grid-cols-2" aria-label="Posted">
        <Card>
          <CardHeader className="gap-1">
            <CardDescription className="flex items-center gap-1.5">
              <CircleCheck className="size-3.5" />
              Posted
            </CardDescription>
            <CardTitle>Went live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {week.posted.map((post) => (
              <div key={post.id}>
                <p className="text-sm font-medium">{cutById(state, post.cutId)?.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(post.postedAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="gap-1">
            <CardDescription className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Next
            </CardDescription>
            <CardTitle>{week.nextUp ? cutById(state, week.nextUp.cutId)?.title : "Nothing queued"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {week.nextUp ? (
              <>
                <StatusBadge value={week.nextUp.status} />
                <p className="text-sm text-muted-foreground">{week.nextUp.hook}</p>
                <p className="text-xs text-muted-foreground">
                  {week.nextUp.scheduledFor ? formatDateTime(week.nextUp.scheduledFor) : "Approved, not scheduled."}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Joint-pick the next cut.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-label="Blocked">
        <Card>
          <CardHeader className="gap-1">
            <CardDescription className="flex items-center gap-1.5">
              <Ban className="size-3.5" />
              Blocked
            </CardDescription>
            <CardTitle>{week.blocked.length} held</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {week.blocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocked TikToks.</p>
            ) : (
              week.blocked.map((post) => (
                <div key={post.id}>
                  <StatusBadge value="blocked" />
                  <p className="mt-1 text-sm font-medium">{cutById(state, post.cutId)?.title}</p>
                  <p className="text-sm text-muted-foreground">{post.blockedReason}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
