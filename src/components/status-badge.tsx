import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  raw: "Raw",
  "in-edit": "In edit",
  ready: "Ready",
  "in-progress": "In progress",
  "ready-to-review": "Ready to review",
  none: "Unpicked",
  selected: "Selected",
  approved: "Approved",
  hold: "Hold",
  scheduled: "Scheduled",
  posted: "Posted",
  blocked: "Blocked",
  open: "Open",
  tv: "TV",
  interview: "Interview",
  "library-clip": "Library clip",
};

const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  posted: "default",
  approved: "default",
  ready: "default",
  scheduled: "secondary",
  selected: "secondary",
  "in-edit": "secondary",
  "in-progress": "secondary",
  blocked: "destructive",
  open: "outline",
  raw: "outline",
  hold: "outline",
  none: "outline",
  "ready-to-review": "outline",
  tv: "outline",
  interview: "outline",
  "library-clip": "outline",
};

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={variants[value] ?? "outline"}>{labels[value] ?? value}</Badge>;
}
