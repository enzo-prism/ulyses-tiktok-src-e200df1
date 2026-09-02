"use client";

import { useState } from "react";
import { Ban, BanOff, CalendarClock, Check, CircleCheck, PanelRight, Save } from "lucide-react";
import { toast } from "sonner";
import { SampleAlert } from "@/components/sample-alert";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cutById, formatDateTime, publishingGroups, type Post } from "@/lib/engine";
import { useEngine } from "@/lib/store";

function PostSheet({ post, open, onOpenChange }: { post: Post | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { state, dispatch } = useEngine();
  if (!post) return null;
  const cut = cutById(state, post.cutId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{cut?.title ?? "TikTok"}</SheetTitle>
          <SheetDescription>Hook, caption, schedule, and the public URL. This engine does not publish.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <StatusBadge value={post.status} />
          {post.blockedReason ? <p className="text-sm text-destructive">{post.blockedReason}</p> : null}
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              dispatch({
                type: "update-post",
                postId: post.id,
                hook: String(form.get("hook") ?? ""),
                caption: String(form.get("caption") ?? ""),
                publicUrl: String(form.get("publicUrl") ?? ""),
              });
              toast.message("Copy saved");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor={`${post.id}-hook`}>Hook</Label>
              <Input id={`${post.id}-hook`} name="hook" defaultValue={post.hook} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${post.id}-caption`}>Caption</Label>
              <Textarea id={`${post.id}-caption`} name="caption" defaultValue={post.caption} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${post.id}-url`}>Public TikTok URL</Label>
              <Input id={`${post.id}-url`} name="publicUrl" defaultValue={post.publicUrl ?? ""} placeholder="https://www.tiktok.com/@ulyses/video/…" />
            </div>
            <Button type="submit" variant="secondary">
              <Save />
              Save copy
            </Button>
          </form>
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              const value = String(new FormData(event.currentTarget).get("scheduledFor") ?? "");
              if (value) {
                dispatch({ type: "schedule", postId: post.id, scheduledFor: new Date(value).toISOString() });
                toast.message("Scheduled");
              }
            }}
          >
            <Label htmlFor={`${post.id}-when`}>Schedule (Pacific)</Label>
            <Input id={`${post.id}-when`} name="scheduledFor" type="datetime-local" defaultValue={post.scheduledFor?.slice(0, 16)} />
            <Button type="submit" disabled={post.status === "posted"}>
              <CalendarClock />
              Schedule
            </Button>
          </form>
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              const liveUrl = String(new FormData(event.currentTarget).get("liveUrl") ?? post.publicUrl ?? "");
              dispatch({ type: "mark-posted", postId: post.id, publicUrl: liveUrl });
              toast.message("Marked posted");
            }}
          >
            <Label htmlFor={`${post.id}-live`}>Mark posted</Label>
            <Input id={`${post.id}-live`} name="liveUrl" defaultValue={post.publicUrl ?? ""} placeholder="Live public URL" />
            <Button type="submit" variant="outline" disabled={post.status === "posted"}>
              <CircleCheck />
              Mark posted
            </Button>
          </form>
          {post.status === "blocked" ? (
            <Button variant="outline" onClick={() => dispatch({ type: "unblock-post", postId: post.id })}>
              <BanOff />
              Unblock
            </Button>
          ) : post.status !== "posted" ? (
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: "block-post", postId: post.id, reason: "Held by the operator until the reason is cleared." })}
            >
              <Ban />
              Block
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function PublishingView() {
  const { state } = useEngine();
  const groups = publishingGroups(state);
  const [active, setActive] = useState<Post | null>(null);
  const columns = [
    { key: "approved", title: "Approved", items: groups.approved, icon: Check },
    { key: "scheduled", title: "Scheduled", items: groups.scheduled, icon: CalendarClock },
    { key: "posted", title: "Posted", items: groups.posted, icon: CircleCheck },
    { key: "blocked", title: "Blocked", items: groups.blocked, icon: Ban },
  ] as const;

  return (
    <div className="space-y-4">
      <SampleAlert compact />
      <Tabs defaultValue="approved">
        <TabsList>
          {columns.map((column) => (
            <TabsTrigger key={column.key} value={column.key}>
              <column.icon />
              {column.title} ({column.items.length})
            </TabsTrigger>
          ))}
        </TabsList>
        {columns.map((column) => (
          <TabsContent key={column.key} value={column.key}>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cut</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {column.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">No {column.title.toLowerCase()} TikToks.</TableCell>
                    </TableRow>
                  ) : (
                    column.items.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="font-medium">{cutById(state, post.cutId)?.title}</div>
                          <div className="line-clamp-1 text-xs text-muted-foreground">{post.hook}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={post.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {post.status === "posted" ? formatDateTime(post.postedAt) : post.scheduledFor ? formatDateTime(post.scheduledFor) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => setActive(post)}>
                            <PanelRight />
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <PostSheet post={active} open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)} />
    </div>
  );
}
