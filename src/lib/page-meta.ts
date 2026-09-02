export const siteTitle = "Ulyses";

export const routeMeta: Record<string, { title: string; description: string }> = {
  "/": { title: "Week", description: "This week's TikToks." },
  "/library": { title: "Library", description: "Cuts." },
  "/edit": { title: "Edit", description: "In progress." },
  "/pick": { title: "Picks", description: "Choose the cut." },
  "/publishing": { title: "Post", description: "Schedule and mark posted." },
  "/performance": { title: "Stats", description: "Sample metrics." },
};

export function metaForPath(path: string) {
  return routeMeta[path] ?? routeMeta["/"];
}
