export const siteTitle = "Ulyses";

export const routeMeta: Record<string, { title: string; description: string }> =
  {
    "/": {
      title: "Your content, in motion.",
      description: "A little clarity for everything you're creating.",
    },
    "/library": {
      title: "Content library",
      description: "Great stories start with what you already have.",
    },
    "/edit": {
      title: "The editing room",
      description: "Turn your strongest moments into something worth watching.",
    },
    "/pick": {
      title: "Make the final cut",
      description: "Review the direction. Choose what moves forward.",
    },
    "/publishing": {
      title: "Ready for the feed",
      description: "Keep every approved post and planned date in one place.",
    },
    "/performance": {
      title: "See what resonates",
      description: "A clear view of how your content is performing.",
    },
  };

export const missingMeta = { title: "Missing", description: "Not here." };

export function metaForPath(path: string) {
  return routeMeta[path] ?? routeMeta["/"];
}
