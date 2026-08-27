"use client";

import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cutById, formatCompact, formatCount, formatDateTime, metricsForPost } from "@/lib/engine";
import { useEngine } from "@/lib/store";

export function PerformanceView() {
  const { state } = useEngine();
  const posted = state.posts.filter((post) => post.status === "posted");
  const totals = posted.reduce(
    (acc, post) => {
      const row = metricsForPost(state, post.id);
      if (!row) return acc;
      return {
        views: acc.views + row.views,
        likes: acc.likes + row.likes,
        comments: acc.comments + row.comments,
        saves: acc.saves + row.saves,
      };
    },
    { views: 0, likes: 0, comments: 0, saves: 0 },
  );

  return (
    <div className="space-y-4">
      <SampleAlert />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {(
          [
            ["Sample views", totals.views],
            ["Sample likes", totals.likes],
            ["Sample comments", totals.comments],
            ["Sample saves", totals.saves],
          ] as const
        ).map(([label, value]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="tnum">{formatCount(value)}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posted TikTok</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Saves</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No posted TikToks in the sample week.
                </TableCell>
              </TableRow>
            ) : null}
            {posted.map((post) => {
              const metrics = metricsForPost(state, post.id);
              return (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge value="posted" />
                      <span className="font-medium">{cutById(state, post.cutId)?.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(post.postedAt)}</div>
                  </TableCell>
                  <TableCell className="text-right tnum">{metrics ? formatCompact(metrics.views) : "—"}</TableCell>
                  <TableCell className="text-right tnum">{metrics ? formatCompact(metrics.likes) : "—"}</TableCell>
                  <TableCell className="text-right tnum">{metrics ? formatCompact(metrics.comments) : "—"}</TableCell>
                  <TableCell className="text-right tnum">{metrics ? formatCompact(metrics.saves) : "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
