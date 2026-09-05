"use client";

import {
  EditView,
  LibraryView,
  PerformanceView,
  PickView,
  PublishingView,
  TodayView,
} from "@/components/views";

export function Console({ route }: { route: string }) {
  const view =
    route === "/" ? (
      <TodayView />
    ) : route === "/library" ? (
      <LibraryView />
    ) : route === "/edit" ? (
      <EditView />
    ) : route === "/pick" ? (
      <PickView />
    ) : route === "/publishing" ? (
      <PublishingView />
    ) : route === "/performance" ? (
      <PerformanceView />
    ) : (
      <TodayView />
    );

  return view;
}
