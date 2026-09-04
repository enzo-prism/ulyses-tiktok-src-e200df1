# Design guidance

## Direction

A calm content workspace: white surfaces, generous spacing, clear typography, consistent Lucide icons and restrained violet accents. Light mode is intentionally forced for the current design.

## Foundations

- Geist sans for interface text; tabular numbers for counts and metrics.
- White content surface, near-white sidebar, dark charcoal text, violet primary actions.
- Core tokens live in `src/app/globals.css`; primary is `#7054d6`, foreground `#202331`, border `#eceef2`.
- Use 24–32px group spacing and ample page margins. Separate sections through spacing before adding containers.
- Lucide icons should explain navigation, source type or status. Avoid decorative imagery that could be mistaken for real client footage.
- Status badges include text/icons as well as color: emerald for approved/posted, violet for selected/scheduled, blue for editing and amber for held/blocked.
- Buttons have visible focus styles; the shell includes a skip link and active navigation semantics. Preserve reduced-motion support.

## Screen ownership

`app-shell.tsx` owns navigation, page heading, the shared sample notice and footer. `page-meta.ts` owns route copy. Each `views-*.tsx` component owns the contents of its screen.

- Overview: actionable pipeline counts and a clearly labeled historical sample week. Raw footage count is not the total library size.
- Library: searchable/filterable source records and clear empty states.
- Editing: readable hooks, source context and review actions.
- Review: separate ready, shortlisted and held cuts; preserve every action.
- Publishing: responsive queue and editable details sheet. Always state that publishing happens outside this app.
- Analytics: sample totals, proportional comparisons and post-level results. Do not invent trends or imply audience growth is connected.

## Responsive behavior

The desktop sidebar collapses to an off-canvas menu on mobile, and closes after navigation. Metric groups use two columns on small screens. Review columns stack; publishing tabs wrap into a two-column group. Analytics uses mobile post cards instead of forcing a wide table into a narrow viewport.

Check at desktop and approximately 390px mobile widths. Test content with long hooks and empty lists. Do not hide the sample notice to make a screenshot look cleaner.

## Date behavior

The sample calendar retains the source fixture week of August 24–30, 2026; it is not presented as the current live reporting period. Publishing inputs use the device's local time, explicitly labeled. Stored timestamps are grouped into calendar days in America/Los_Angeles, including evening UTC boundaries and DST.
