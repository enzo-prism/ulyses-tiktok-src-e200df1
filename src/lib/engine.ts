import seed from "@/data/seed.json";

export type SourceKind = "tv" | "interview" | "library-clip";
export type LibraryStatus = "raw" | "in-edit" | "ready";
export type CutStatus = "in-progress" | "ready-to-review";
export type PickDecision = "none" | "selected" | "approved" | "hold";
export type PublishStatus = "approved" | "scheduled" | "posted" | "blocked";

export interface Asset {
  id: string;
  title: string;
  sourceKind: SourceKind;
  sourceLabel: string;
  duration: string;
  capturedAt: string;
  location: string;
  notes: string;
  status: LibraryStatus;
}

export interface Cut {
  id: string;
  assetId: string;
  title: string;
  hook: string;
  duration: string;
  editor: string;
  status: CutStatus;
  pick: PickDecision;
  note?: string;
}

export interface Post {
  id: string;
  cutId: string;
  caption: string;
  hook: string;
  status: PublishStatus;
  scheduledFor?: string;
  postedAt?: string;
  publicUrl?: string;
  blockedReason?: string;
}

export interface SampleMetrics {
  postId: string;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  sampleAsOf: string;
}

export interface EngineState {
  meta: {
    identity: {
      name: "Ulyses Osuna";
      studio: "Influencer Press";
      city: "Kennewick, WA";
      platform: "TikTok";
      handle: "@ulyses";
    };
    reportingWeek: {
      start: string;
      end: string;
      timezone: "America/Los_Angeles";
      label: string;
    };
    dataKind: "sample";
    sampleNote: string;
    persistenceNote: string;
  };
  assets: Asset[];
  cuts: Cut[];
  posts: Post[];
  metrics: SampleMetrics[];
}

export type EngineAction =
  | { type: "send-to-edit"; assetId: string }
  | { type: "mark-asset-ready"; assetId: string }
  | { type: "mark-cut-ready"; cutId: string }
  | { type: "set-pick"; cutId: string; pick: PickDecision }
  | { type: "schedule"; postId: string; scheduledFor: string }
  | { type: "mark-posted"; postId: string; publicUrl?: string; postedAt?: string }
  | { type: "update-post"; postId: string; caption?: string; hook?: string; publicUrl?: string }
  | { type: "block-post"; postId: string; reason: string }
  | { type: "unblock-post"; postId: string }
  | { type: "reset" };

export const SEED_STATE = seed as EngineState;
export const STORAGE_KEY = "ulyses-tiktok-engine-v1";

const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const dateOnly = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "short",
  month: "short",
  day: "numeric",
});
const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fullNumber = new Intl.NumberFormat("en-US");

export function formatDate(value?: string) {
  if (!value) return "—";
  return dateOnly.format(new Date(value.length === 10 ? `${value}T12:00:00-07:00` : value));
}

export function formatDateTime(value?: string) {
  if (!value) return "—";
  return `${dateTime.format(new Date(value))} PT`;
}

export function formatCompact(value: number) {
  return compactNumber.format(value);
}

export function formatCount(value: number) {
  return fullNumber.format(value);
}

export function weekDays(start: string, end: string) {
  const days: { iso: string; label: string; short: string }[] = [];
  const cursor = new Date(`${start}T12:00:00-07:00`);
  const last = new Date(`${end}T12:00:00-07:00`);
  while (cursor <= last) {
    days.push({
      iso: cursor.toISOString().slice(0, 10),
      label: dateOnly.format(cursor),
      short: cursor.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "short",
      }),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function dayKey(value?: string) {
  return value?.slice(0, 10);
}

function cloneState(state: EngineState): EngineState {
  return structuredClone(state);
}

function nowIso() {
  return new Date().toISOString();
}

function slugId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function findAsset(state: EngineState, assetId: string) {
  const asset = state.assets.find((item) => item.id === assetId);
  if (!asset) throw new Error(`Unknown asset: ${assetId}`);
  return asset;
}

function findCut(state: EngineState, cutId: string) {
  const cut = state.cuts.find((item) => item.id === cutId);
  if (!cut) throw new Error(`Unknown cut: ${cutId}`);
  return cut;
}

function findPost(state: EngineState, postId: string) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) throw new Error(`Unknown post: ${postId}`);
  return post;
}

function cutsForAsset(state: EngineState, assetId: string) {
  return state.cuts.filter((cut) => cut.assetId === assetId);
}

function ensureDraftCut(state: EngineState, asset: Asset) {
  const existing = cutsForAsset(state, asset.id);
  if (existing.length > 0) return existing[0];
  state.cuts.unshift({
    id: slugId("cut"),
    assetId: asset.id,
    title: asset.title,
    hook: "",
    duration: "0:30",
    editor: "Prism",
    status: "in-progress",
    pick: "none",
    note: "Opened from the library.",
  });
  return state.cuts[0];
}

function ensurePostForCut(state: EngineState, cut: Cut) {
  const existing = state.posts.find((post) => post.cutId === cut.id);
  if (existing) return existing;
  state.posts.unshift({
    id: slugId("post"),
    cutId: cut.id,
    caption: "",
    hook: cut.hook,
    status: "approved",
  });
  return state.posts[0];
}

function refreshAssetStatus(state: EngineState, assetId: string) {
  const asset = findAsset(state, assetId);
  const related = cutsForAsset(state, assetId);
  if (
    related.some((cut) =>
      state.posts.some((post) => post.cutId === cut.id && post.status === "posted"),
    ) ||
    related.some((cut) => cut.pick === "approved" || cut.status === "ready-to-review")
  ) {
    asset.status = "ready";
    return;
  }
  if (related.some((cut) => cut.status === "in-progress")) asset.status = "in-edit";
}

export function applyAction(state: EngineState, action: EngineAction): EngineState {
  if (action.type === "reset") return cloneState(SEED_STATE);
  const next = cloneState(state);
  switch (action.type) {
    case "send-to-edit": {
      const asset = findAsset(next, action.assetId);
      asset.status = "in-edit";
      ensureDraftCut(next, asset);
      return next;
    }
    case "mark-asset-ready":
      findAsset(next, action.assetId).status = "ready";
      return next;
    case "mark-cut-ready": {
      const cut = findCut(next, action.cutId);
      cut.status = "ready-to-review";
      refreshAssetStatus(next, cut.assetId);
      return next;
    }
    case "set-pick": {
      const cut = findCut(next, action.cutId);
      if (cut.status !== "ready-to-review") throw new Error("Only ready-to-review cuts can be picked.");
      cut.pick = action.pick;
      if (action.pick === "approved") ensurePostForCut(next, cut);
      refreshAssetStatus(next, cut.assetId);
      return next;
    }
    case "schedule": {
      const post = findPost(next, action.postId);
      if (post.status === "posted") throw new Error("Posted TikToks stay posted.");
      if (post.status === "blocked") throw new Error("Unblock this TikTok before scheduling.");
      post.status = "scheduled";
      post.scheduledFor = action.scheduledFor;
      return next;
    }
    case "mark-posted": {
      const post = findPost(next, action.postId);
      if (post.status === "blocked") throw new Error("Unblock this TikTok before marking it posted.");
      post.status = "posted";
      post.postedAt = action.postedAt ?? nowIso();
      if (action.publicUrl !== undefined) post.publicUrl = action.publicUrl;
      return next;
    }
    case "update-post": {
      const post = findPost(next, action.postId);
      if (action.caption !== undefined) post.caption = action.caption;
      if (action.hook !== undefined) post.hook = action.hook;
      if (action.publicUrl !== undefined) post.publicUrl = action.publicUrl;
      return next;
    }
    case "block-post": {
      const post = findPost(next, action.postId);
      if (post.status === "posted") throw new Error("A live TikTok cannot be blocked from this board.");
      post.status = "blocked";
      post.blockedReason = action.reason;
      return next;
    }
    case "unblock-post": {
      const post = findPost(next, action.postId);
      post.status = post.scheduledFor ? "scheduled" : "approved";
      post.blockedReason = undefined;
      return next;
    }
    default: {
      const _never: never = action;
      return _never;
    }
  }
}

export function weekPosts(state: EngineState) {
  const start = state.meta.reportingWeek.start;
  const end = state.meta.reportingWeek.end;
  const inWeek = (iso?: string) => Boolean(iso && iso.slice(0, 10) >= start && iso.slice(0, 10) <= end);
  const posted = state.posts
    .filter((post) => post.status === "posted" && inWeek(post.postedAt))
    .sort((a, b) => (a.postedAt ?? "").localeCompare(b.postedAt ?? ""));
  const scheduled = state.posts
    .filter((post) => post.status === "scheduled" && inWeek(post.scheduledFor))
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
  return {
    posted,
    scheduled,
    blocked: state.posts.filter((post) => post.status === "blocked"),
    nextUp: scheduled[0] ?? state.posts.find((post) => post.status === "approved") ?? null,
  };
}

export function pipelineCounts(state: EngineState) {
  return {
    raw: state.assets.filter((asset) => asset.status === "raw").length,
    inProgressCuts: state.cuts.filter((cut) => cut.status === "in-progress").length,
    readyCuts: state.cuts.filter((cut) => cut.status === "ready-to-review" && cut.pick !== "approved").length,
    blocked: state.posts.filter((post) => post.status === "blocked").length,
  };
}

export function assetById(state: EngineState, id: string) {
  return state.assets.find((asset) => asset.id === id);
}

export function cutById(state: EngineState, id: string) {
  return state.cuts.find((cut) => cut.id === id);
}

export function metricsForPost(state: EngineState, postId: string) {
  return state.metrics.find((row) => row.postId === postId);
}

export function pickColumns(state: EngineState) {
  const board = state.cuts.filter((cut) => cut.status === "ready-to-review" && cut.pick !== "approved");
  return {
    ready: board.filter((cut) => cut.pick === "none"),
    selected: board.filter((cut) => cut.pick === "selected"),
    hold: board.filter((cut) => cut.pick === "hold"),
  };
}

export function publishingGroups(state: EngineState) {
  const by = (status: PublishStatus) => state.posts.filter((post) => post.status === status);
  return { approved: by("approved"), scheduled: by("scheduled"), posted: by("posted"), blocked: by("blocked") };
}
