"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumn,
  ChevronRight,
  Clapperboard,
  Layers3,
  LayoutGrid,
  MoreHorizontal,
  RotateCcw,
  Send,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { SampleAlert } from "@/components/sample-alert";
import { useEngine } from "@/lib/store";
import { metaForPath } from "@/lib/page-meta";

const nav = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/library", label: "Library", icon: Layers3 },
  { href: "/edit", label: "Editing", icon: Clapperboard },
  { href: "/pick", label: "Review", icon: ClipboardCheck },
  { href: "/publishing", label: "Publishing", icon: Send },
  { href: "/performance", label: "Analytics", icon: ChartNoAxesColumn },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, reset, error, clearError } = useEngine();
  const { isMobile, setOpenMobile } = useSidebar();
  const page = metaForPath(pathname);
  const current = nav.find((item) => item.href === pathname);
  const reviewCount = state.cuts.filter(
    (c) => c.status === "ready-to-review" && c.pick !== "approved",
  ).length;
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar collapsible="icon" className="workspace-sidebar">
        <SidebarHeader className="px-5 pb-7 pt-8 group-data-[collapsible=icon]:px-2">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Ulyses workspace home"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-white">
              <Layers3 className="size-5" />
            </span>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-base font-semibold tracking-tight">
                Ulyses Osuna
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Content operations
              </p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-4 group-data-[collapsible=icon]:px-2">
            <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {nav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="h-11 rounded-md px-3 text-sm font-medium"
                    >
                      <Link
                        href={item.href}
                        prefetch={true}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <item.icon className="size-[18px]" strokeWidth={1.7} />
                        <span>{item.label}</span>
                        {item.href === "/pick" && reviewCount > 0 ? (
                          <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                            {reviewCount}
                          </span>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-6 border-t p-5 group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-white text-xs font-semibold">
              UO
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">Ulyses Osuna</p>
              <p className="text-xs text-muted-foreground">Influencer Press</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0 bg-white">
        <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-border/70 px-5 md:px-10">
          <SidebarTrigger className="text-muted-foreground" />
          <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Workspace</span>
            <ChevronRight className="hidden size-3 sm:inline" />
            <span className="font-medium text-foreground">
              {current?.label ?? "Workspace"}
            </span>
          </div>
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            TikTok
          </span>
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
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1480px] flex-1 px-5 pb-14 pt-9 md:px-10 md:pt-12 xl:px-12"
        >
          <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.035em] md:text-[30px]">
                {page.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-[15px]">
                {page.description}
              </p>
            </div>
            {pathname === "/" ? (
              <Button asChild className="mt-2 h-11 gap-2 rounded-md px-5">
                <Link href="/pick">
                  <ClipboardCheck className="size-4" />
                  Review queue
                </Link>
              </Button>
            ) : null}
          </div>
          <SampleAlert />
          {error ? (
            <div
              role="alert"
              className="mb-6 rounded-md bg-red-50 p-4 text-sm text-destructive"
            >
              {error}{" "}
              <Button variant="link" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          ) : null}
          {children}
          <footer className="mt-14 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">Prism</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Sample workspace · Pacific time
            </span>
          </footer>
        </main>
      </SidebarInset>
    </>
  );
}
