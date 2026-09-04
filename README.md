# Ulyses Content Studio

A light, responsive dashboard for the Ulyses / Influencer Press content workflow.

**Production:** https://ulyses-tiktok-engine.vercel.app

## Run locally

```sh
npm ci
npm run dev
```

The local app runs at http://localhost:43127. For a production-mode preview, run `npm run build` followed by `npm run start`.

## Workspace

| Route | Purpose |
| --- | --- |
| `/` | Pipeline counts, sample weekly calendar, upcoming posts and blockers |
| `/library` | Search and filter source footage records |
| `/edit` | Review cuts being edited and move them into review |
| `/pick` | Select, hold or approve sample content |
| `/publishing` | Edit captions, record schedules and track posting status |
| `/performance` | Sample post metrics and view comparisons |

## Verify changes

```sh
npm run build
node scripts/check-calendar.cjs
TZ=UTC node scripts/check-calendar.cjs
TZ=America/Los_Angeles node scripts/check-calendar.cjs
git diff --check
```

The build includes TypeScript validation. The calendar checks cover Pacific date grouping, week boundaries and daylight saving transitions. The inherited `npm run lint` command does not yet have an ESLint configuration; do not report it as a passing release check.

## Current limits

- All content and analytics are explicitly labeled samples. TikTok is not connected.
- Publishing controls record workflow state; they do not publish or schedule posts on TikTok.
- State loads from browser-local storage. This is not a shared, authenticated client approval system.
- The storage endpoint attempts a local file write, which is not durable storage on Vercel. Private client footage and real approvals should not be introduced without the separate persistence/access-control work.
- Media records do not include playable source files or versioned video approvals.

## Project documentation

- [Design system and screen guidance](docs/DESIGN.md)
- [Deployment, verification and rollback](docs/DEPLOYMENT.md)
- [Change history](CHANGELOG.md)
- [Historical source notice](DELETE_ME.md)

## Source lineage

This release is maintained in `enzo-prism/ulyses-tiktok-src-e200df1` on `main`. The September 4 redesign started from `faa4433eea44167ca99676a29ce01d169b74dc61`, verified as the exact source of the preceding production deployment.

A historical note referred to a private Origin repository that was inaccessible during this release. Reconcile that copy before any future Origin-driven deployment. Pushing GitHub main and updating Vercel production are separate actions in the current release workflow.
