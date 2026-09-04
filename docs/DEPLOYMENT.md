# Deployment and release

## Target

- Repository: `enzo-prism/ulyses-tiktok-src-e200df1`
- Branch: `main`
- Vercel project: `ulyses-tiktok-engine`
- Vercel team: `enzo-design-prisms-projects`
- Production URL: https://ulyses-tiktok-engine.vercel.app

The source initially came from a temporary GitHub snapshot; the owner authorized maintaining and releasing the September 4 redesign here. The private Origin copy remains unreconciled. Do not delete this repository based on its historical filename.

## Important build configuration

The preceding deployment downloaded commit `faa4433eea44167ca99676a29ce01d169b74dc61` during installation. That bootstrap command would overwrite newly uploaded source. Keep the explicit commands in `vercel.json`:

```json
{
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build"
}
```

Deploy the complete checkout and committed lockfile. Do not restore the old curl/tar install command.

## Release sequence

1. Read project docs, fetch main and reconcile upstream changes. Do not force-push.
2. Run the README verification commands and check desktop/mobile behavior.
3. Confirm the Vercel account and existing project link. Link locally using `vercel link --project ulyses-tiktok-engine --scope enzo-design-prisms-projects` if necessary.
4. Commit source/docs and push `git push origin main`. Verify the remote commit.
5. With production deployment authorization, run `vercel deploy --prod --yes` from the linked checkout.
6. Confirm deployment is Ready, uses the intended commit/source, and owns the production alias.
7. Open the production URL and verify the new light design, route navigation and sample disclosures. Check the mobile layout and inspect runtime/browser errors.

A successful push is not proof of production deployment. A Ready build is not proof that the production alias shows the new version. Record both results.

## Release checks

Locally verify library search, source-to-edit movement, sample approval, post-copy editing, mobile navigation and calendar tests. Reset only disposable local test state afterward. Avoid mutating production sample state solely for verification.

Keep environment files, `.vercel`, runtime data, `.next` and `node_modules` out of version control and uploads. This release changes design and calendar correctness; it does not add live TikTok integration, authentication or durable shared storage.

## Rollback

Record the current and previous deployment IDs in the release record. Use `vercel inspect` to confirm the intended rollback target, then use the supported Vercel rollback workflow with explicit authorization. Verify the production alias afterward. Do not assume reverting GitHub main alone rolls back the running dashboard.

Previous production before this redesign: `dpl_2VbpHRyqLvxeKymFfSKweC3H2kjA` (source `faa4433eea44167ca99676a29ce01d169b74dc61`).
