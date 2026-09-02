import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Console } from "@/components/console";
import { metaForPath } from "@/lib/page-meta";

const routes = new Set(["", "library", "edit", "pick", "publishing", "performance"]);

function pathFromSlug(slug?: string[]) {
  const leaf = slug?.[0] ?? "";
  return leaf ? `/${leaf}` : "/";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug && slug.length > 1) return metaForPath("/");
  const leaf = slug?.[0] ?? "";
  if (leaf === "posted") return metaForPath("/");
  if (!routes.has(leaf)) return metaForPath("/");
  return metaForPath(pathFromSlug(slug));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (slug && slug.length > 1) notFound();
  const leaf = slug?.[0] ?? "";
  if (leaf === "posted") redirect("/");
  if (!routes.has(leaf)) notFound();
  return <Console route={pathFromSlug(slug)} />;
}
