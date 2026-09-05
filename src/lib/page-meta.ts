export const siteTitle = "Ulyses";

export const routeMeta: Record<string, { title: string; description: string }> =
  {
    "/": {
      title: "Overview",
      description: "Track production, approvals, and publishing.",
    },
    "/library": {
      title: "Content library",
      description: "Manage source footage and production status.",
    },
    "/edit": {
      title: "Editing",
      description: "Prepare cuts and submit them for review.",
    },
    "/pick": {
      title: "Review",
      description: "Review edits and approve content for publishing.",
    },
    "/publishing": {
      title: "Publishing",
      description: "Manage approved posts, schedules, and blockers.",
    },
    "/performance": {
      title: "Performance",
      description: "Review results across published content.",
    },
  };

export const missingMeta = { title: "Missing", description: "Not here." };

export function metaForPath(path: string) {
  return routeMeta[path] ?? routeMeta["/"];
}
