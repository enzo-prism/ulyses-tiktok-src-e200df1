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
    <Badge variant="outline" className={`status-badge status-${value}`}>
      {Icon ? <Icon /> : null}
      {labels[value] ?? value}
    </Badge>
  );
}
