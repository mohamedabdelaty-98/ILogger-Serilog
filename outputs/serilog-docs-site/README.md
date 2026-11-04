# Serilog & .NET Logging Guide

A standalone VitePress website for learning Serilog, structured logging, sink selection, enrichment, and SQL Server logging. The examples are generic and contain no company-specific code or credentials.

## Contents

- `docs/index.md` — public site landing page
- `docs/guide/` — guided chapters
- `docs/reference.md` — API and configuration cheat sheet
- `docs/api-reference.md` — common APIs and package boundaries
- `docs/faq.md` — common questions
- `docs/knowledge-check.md` — questions with explained answers
- `docs/sources.md` — official references

## Requirements

- Node.js 20 or newer (the deployment workflow uses Node 22)
- npm

## Run locally

From this directory:

```sh
npm ci
npm run docs:dev
```

Open the local URL printed by VitePress. Search is built in and runs locally against the generated documentation index. Mermaid diagrams render in the browser, with source available as a fallback.

## Build and preview

```sh
npm run docs:build
npm run docs:preview
```

The static production site is written to `docs/.vitepress/dist`. The build creates a sitemap when a site hostname is known and writes a matching sitemap declaration to `robots.txt`.

## Publish with GitHub Pages

The workflow at `.github/workflows/docs.yml` builds the VitePress site and deploys it to GitHub Pages after pushes to `main` or `master` that touch the docs or build files. To publish:

1. Add this site's files to the GitHub repository you want to use. Keep the workflow under `.github/workflows/docs.yml` at the repository root and the VitePress source in `docs/`.
2. Push the files and `package-lock.json` to the repository's `main` or `master` branch.
3. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Watch the **Actions** tab until **Deploy documentation to GitHub Pages** completes. The workflow output contains the published URL.

VitePress sets the base path to `/<repository>/` for project Pages sites and `/` for `<owner>.github.io` repositories. If you use a custom domain, set `DOCS_SITE_URL` in the workflow to that canonical origin and adjust the `base` logic if needed. GitHub Pages sites are publicly accessible; review content before publishing.

## Content and package-version policy

Serilog core, ASP.NET Core integration, sinks, and enrichers are independently versioned. The SQL Server examples use the official MSSQL sink API shapes reviewed for this guide but still require checking against the package version and schema used by your service. See `docs/sources.md` for primary references.

## Accessibility and usability

VitePress supplies responsive documentation navigation, keyboard-operable menus/search, heading outline, copyable syntax-highlighted code blocks, dark/light mode, and previous/next navigation. Mermaid diagrams have adjacent explanation and a collapsible source fallback. Tables are scrollable on narrow screens.
