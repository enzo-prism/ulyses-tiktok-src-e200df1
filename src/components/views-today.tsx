"use client";

import Link from "next/link";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cutById, dayKey, formatDateTime, pipelineCounts, weekDays, weekPosts } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function TodayView() {
  const { state } = useEngine();
  const week = weekPosts(state);
  const counts = pipelineCounts(state);
  const days = weekDays(state.meta.reportingWeek.start, state.meta.reportingWeek.end);

  return (
    <div className="space-y-6">
      <SampleAlert />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ["Raw footage", counts.raw, "/library"],
            ["Cuts in edit", counts.inProgressCuts, "/edit"],
            ["Waiting on a pick", counts.readyCuts, "/pick"],
            ["Blocked", counts.blocked, "/publishing"],
          ] as const
        ).map(([label, value, href]) => (
          <Link key={label} href={href}>
            <Card size="sm" className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl tnum">{value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">This week on TikTok</h2>
            <p className="text-xs text-muted-foreground">
              {state.meta.reportingWeek.label} · {state.meta.reportingWeek.start} → {state.meta.reportingWeek.end} PT
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusBadge value="posted" />
              <StatusBadge value="scheduled" />
              <StatusBadge value="open" />
              <StatusBadge value="blocked" />
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/pick">Open pick board</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => {
            const posted = week.posted.filter((post) => dayKey(post.postedAt) === day.iso);
            const scheduled = week.scheduled.filter((post) => dayKey(post.scheduledFor) === day.iso);
            return (
              <Card key={day.iso} size="sm">
                <CardHeader>
                  <CardDescription>{day.short}</CardDescription>
                  <CardTitle className="text-sm">{day.label.replace(/^\w+, /, "")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                  {posted.length === 0 && scheduled.length === 0 ? <StatusBadge value="open" /> : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {week.blocked.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {week.blocked.map((post) => (
              <div key={post.id} className="flex items-center gap-2 text-xs">
                <StatusBadge value="blocked" />
                <span>{cutById(state, post.cutId)?.title}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Went live</CardDescription>
            <CardTitle>Posted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {week.posted.map((post) => (
              <div key={post.id}>
                <p className="text-sm font-medium">{cutById(state, post.cutId)?.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(post.postedAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Next</CardDescription>
            <CardTitle>{week.nextUp ? cutById(state, week.nextUp.cutId)?.title : "Nothing queued"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
        <Card>
          <CardHeader>
            <CardDescription>Blocked</CardDescription>
            <CardTitle>{week.blocked.length} held</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {week.blocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocked TikToks.</p>
            ) : (
              week.blocked.map((post) => (
                <div key={post.id}>
                  <StatusBadge value="blocked" />
                  <p className="mt-2 text-sm font-medium">{cutById(state, post.cutId)?.title}</p>
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
