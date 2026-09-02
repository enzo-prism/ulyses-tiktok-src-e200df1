import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { missingMeta } from "@/lib/page-meta";

export const metadata: Metadata = missingMeta;

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-3 px-6 text-center">
      <p className="text-sm text-muted-foreground">Ulyses · TikTok only</p>
      <h1 className="text-2xl font-medium">That surface is not in this engine</h1>
      <p className="text-sm text-muted-foreground">
        Library, edit, pick, publishing, and performance for @ulyses. There are no other clients or platforms.
      </p>
      <Link href="/" className={buttonVariants()}>
        Back to week
      </Link>
    </div>
  );
}
