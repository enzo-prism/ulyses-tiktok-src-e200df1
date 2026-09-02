import type { LucideIcon } from "lucide-react";
import {
  Ban,
  Check,
  Circle,
  CircleCheck,
  CircleDashed,
  Clapperboard,
  Clock,
  Film,
  Mic,
  MousePointerClick,
  Pause,
  Scissors,
  Tv,
} from "lucide-react";
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

export const statusIcons: Record<string, LucideIcon> = {
  posted: CircleCheck,
  scheduled: Clock,
  open: CircleDashed,
  blocked: Ban,
  raw: Film,
  "in-edit": Scissors,
  "in-progress": Scissors,
  ready: CircleCheck,
  "ready-to-review": CircleCheck,
  none: Circle,
  selected: MousePointerClick,
  approved: Check,
  hold: Pause,
  tv: Tv,
  interview: Mic,
  "library-clip": Clapperboard,
};

export function StatusBadge({ value }: { value: string }) {
  const Icon = statusIcons[value];
  return (
    <Badge variant={variants[value] ?? "outline"}>
      {Icon ? <Icon /> : null}
      {labels[value] ?? value}
    </Badge>
  );
}
