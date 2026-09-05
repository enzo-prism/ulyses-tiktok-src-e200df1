"use client";

import { useState } from "react";
import {
  Ban,
  CalendarClock,
  Check,
  CircleCheck,
  Clapperboard,
  PanelRight,
  Save,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  cutById,
  formatDateTime,
  publishingGroups,
  type Post,
} from "@/lib/engine";
import { useEngine } from "@/lib/store";

function PostSheet({
  post,
  open,
  onOpenChange,
}: {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, dispatch } = useEngine();
  if (!post) return null;
  const cut = cutById(state, post.cutId);
  const scheduledDate = post.scheduledFor ? new Date(post.scheduledFor) : null;
  const localSchedule =
    scheduledDate && !Number.isNaN(scheduledDate.getTime())
      ? new Date(
          scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60_000,
        )
          .toISOString()
          .slice(0, 16)
      : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="p-6">
          <SheetTitle>{cut?.title ?? "TikTok"}</SheetTitle>
          <SheetDescription>
            Hook, caption, schedule, and the public URL. This engine does not
            publish.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-7 px-6 pb-8">
          <StatusBadge value={post.status} />
          {post.blockedReason ? (
            <p className="text-sm text-destructive">{post.blockedReason}</p>
          ) : null}
          <form
            className="space-y-5"
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
              <Input
                id={`${post.id}-hook`}
                name="hook"
                defaultValue={post.hook}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${post.id}-caption`}>Caption</Label>
              <Textarea
                id={`${post.id}-caption`}
                name="caption"
                defaultValue={post.caption}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${post.id}-url`}>Public TikTok URL</Label>
              <Input
                id={`${post.id}-url`}
                name="publicUrl"
                defaultValue={post.publicUrl ?? ""}
                placeholder="https://www.tiktok.com/@ulyses/video/…"
              />
            </div>
            <Button type="submit" variant="secondary">
              <Save />
              Save copy
            </Button>
          </form>
          <form
            className="space-y-3 border-t pt-6"
            onSubmit={(event) => {
              event.preventDefault();
              const value = String(
                new FormData(event.currentTarget).get("scheduledFor") ?? "",
              );
              if (value) {
                dispatch({
                  type: "schedule",
                  postId: post.id,
                  scheduledFor: new Date(value).toISOString(),
                });
                toast.message("Schedule saved to this workspace");
              }
            }}
          >
            <Label htmlFor={`${post.id}-when`}>
              Schedule (your device time)
            </Label>
            <Input
              id={`${post.id}-when`}
              name="scheduledFor"
              type="datetime-local"
              defaultValue={localSchedule}
            />
            <Button
              type="submit"
              disabled={post.status === "posted" || post.status === "blocked"}
            >
              <CalendarClock />
              Save schedule
            </Button>
          </form>
          <form
            className="space-y-3 border-t pt-6"
            onSubmit={(event) => {
              event.preventDefault();
              const liveUrl = String(
                new FormData(event.currentTarget).get("liveUrl") ??
                  post.publicUrl ??
                  "",
              );
              dispatch({
                type: "mark-posted",
                postId: post.id,
                publicUrl: liveUrl,
              });
              toast.message("Marked posted");
            }}
          >
            <Label htmlFor={`${post.id}-live`}>Mark posted</Label>
            <Input
              id={`${post.id}-live`}
              name="liveUrl"
              defaultValue={post.publicUrl ?? ""}
              placeholder="Live public URL"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={post.status === "posted" || post.status === "blocked"}
            >
              <CircleCheck />
              Mark posted
            </Button>
          </form>
          {post.status === "blocked" ? (
            <Button
              variant="outline"
              onClick={() =>
                dispatch({ type: "unblock-post", postId: post.id })
              }
            >
              <Unlock />
              Unblock
            </Button>
          ) : post.status !== "posted" ? (
            <Button
              variant="ghost"
              onClick={() =>
                dispatch({
                  type: "block-post",
                  postId: post.id,
                  reason: "Held by the operator until the reason is cleared.",
                })
              }
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
    {
      key: "scheduled",
      title: "Scheduled",
      items: groups.scheduled,
      icon: CalendarClock,
    },
    { key: "posted", title: "Posted", items: groups.posted, icon: CircleCheck },
    { key: "blocked", title: "Blocked", items: groups.blocked, icon: Ban },
  ] as const;

  const activePost = active
    ? (state.posts.find((post) => post.id === active.id) ?? null)
    : null;
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Publishing queue
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Prepare captions and track your posts. Publishing happens in TikTok.
        </p>
      </div>
      <Tabs defaultValue="approved" className="gap-6">
        <TabsList className="grid h-auto! w-full grid-cols-2 gap-1 p-1 sm:flex sm:w-fit">
          {columns.map((column) => (
            <TabsTrigger
              key={column.key}
              value={column.key}
              className="px-4 py-2.5"
            >
              <column.icon />
              {column.title}
              <span className="ml-1 text-xs text-muted-foreground">
                {column.items.length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {columns.map((column) => (
          <TabsContent key={column.key} value={column.key}>
            {column.items.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <column.icon className="mx-auto mb-4 size-7 text-muted-foreground" />
                <h3 className="font-medium">
                  No {column.title.toLowerCase()} posts
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your posts will appear here as they move through the queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {column.items.map((post) => (
                  <Card
                    key={post.id}
                    className="flex-col gap-5 p-6 shadow-none sm:flex-row sm:items-center"
                  >
                    <div className="flex shrink-0 self-start items-center text-muted-foreground">
                      <Clapperboard className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold leading-relaxed">
                        {cutById(state, post.cutId)?.title ?? "Untitled cut"}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {post.hook || "Add a hook in the post details."}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <StatusBadge value={post.status} />
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarClock className="size-3.5" />
                          {post.status === "posted"
                            ? formatDateTime(post.postedAt)
                            : post.scheduledFor
                              ? formatDateTime(post.scheduledFor)
                              : "No date set"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="shrink-0"
                      onClick={() => setActive(post)}
                    >
                      <PanelRight />
                      Post details
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <PostSheet
        post={activePost}
        open={Boolean(activePost)}
        onOpenChange={(open) => !open && setActive(null)}
      />
    </div>
  );
}
