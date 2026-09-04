# Change history

## 2026-09-04 — Content Studio redesign

- Replaced the dense dark interface with a light workspace, generous spacing, Geist typography, Lucide icons and soft violet accents.
- Refined all six screens: overview, library, editing, review, publishing and analytics.
- Added library search/filter presentation, responsive review cards, mobile publishing tabs and mobile analytics cards.
- Centralized the persistent demo notice and retained explicit sample metrics/no TikTok connection disclosures.
- Improved mobile navigation and keyboard focus/skip-link behavior.
- Corrected Pacific calendar grouping for UTC evening timestamps and added DST/week-boundary regression checks.
- Updated the publishing sheet to read current post state and disabled schedule/post actions while blocked.
- Committed a dependency lockfile and replaced the legacy source-downloading install command with `npm ci`.
- Documented design, release procedure, source lineage and remaining prototype limitations.

Validation: production build including TypeScript, 13 date cases plus schedule/posted week-boundary checks, desktop/mobile visual review and local workflow checks. Production status is recorded separately after deployment verification.
