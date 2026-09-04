# Ulyses content studio

Light, responsive dashboard for the Ulyses / Influencer Press content workflow.

## Development

- `npm ci`
- `npm run dev` (port 43127)
- `npm run build` (production build and TypeScript)
- `node scripts/check-calendar.cjs` (Pacific date grouping and DST regression checks)

The workspace uses explicitly labeled sample data. TikTok is not connected; publishing controls track workflow state, not actual publication. Existing browser-local persistence remains a prototype limitation.

## Source and release

This checkout was recovered from the exact production source commit `faa4433eea44167ca99676a29ce01d169b74dc61` of `enzo-prism/ulyses-tiktok-src-e200df1` on September 4, 2026. The historical `DELETE_ME.md` refers to a private Origin source, but that source was not accessible during this redesign. Reconcile it before future Origin-driven releases.

The Vercel project is `ulyses-tiktok-engine`. Its old install command fetched the historical snapshot, overwriting uploaded files. This checkout explicitly sets `installCommand: npm ci` and `buildCommand: npm run build` to build the included source and lockfile.

Keep `.vercel`, environment files, local runtime state, dependencies, and build output out of version control and deployment uploads.
