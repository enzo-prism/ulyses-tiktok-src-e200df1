"use client";

import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
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
      <section
        aria-label="Sample totals"
        className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
      >
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["Views", totals.views, Eye],
              ["Likes", totals.likes, Heart],
              ["Comments", totals.comments, MessageCircle],
              ["Saves", totals.saves, Bookmark],
            ] as const
          ).map(([label, value, Icon], index) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-2.5 ${
                index % 2 === 1 ? "border-l border-border" : ""
              } ${index > 1 ? "border-t border-border xl:border-t-0" : ""} ${
                index > 0 ? "xl:border-l xl:border-border" : ""
              }`}
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-xl font-medium leading-none tnum">{formatCount(value)}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
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
