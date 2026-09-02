"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumn,
  Clapperboard,
  Layers3,
  LayoutGrid,
  MoreHorizontal,
  RotateCcw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEngine } from "@/lib/store";
import { metaForPath } from "@/lib/page-meta";

const nav = [
  { href: "/", label: "Week", icon: CalendarDays },
  { href: "/library", label: "Library", icon: Layers3 },
  { href: "/edit", label: "Edit", icon: Clapperboard },
  { href: "/pick", label: "Picks", icon: LayoutGrid },
  { href: "/publishing", label: "Post", icon: Send },
  { href: "/performance", label: "Stats", icon: ChartNoAxesColumn },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, reset, error, clearError } = useEngine();
  const identity = state.meta.identity;
  const page = metaForPath(pathname);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar size="sm">
              <AvatarFallback>UO</AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium">{identity.name.split(" ")[0]}</p>
              <p className="truncate text-xs text-muted-foreground">{identity.handle}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>TikTok engine</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {identity.studio}
            <span className="mx-1">·</span>
            {identity.city}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{page.title}</p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{page.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Workspace menu">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sample workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  reset();
                  toast.message("Sample library restored");
                }}
              >
                <RotateCcw />
                Restore sample library
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {error ? (
          <div className="border-b px-4 py-2 text-sm text-destructive">
            {error}{" "}
            <Button variant="link" size="xs" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        ) : null}

        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </>
  );
}
