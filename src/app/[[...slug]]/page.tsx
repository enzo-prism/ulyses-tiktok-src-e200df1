import { notFound, redirect } from "next/navigation";
import { Console } from "@/components/console";

const routes = new Set(["", "library", "edit", "pick", "publishing", "performance"]);

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
  return <Console route={leaf ? `/${leaf}` : "/"} />;
}
