---
title: Official references
description: Primary documentation links for Serilog, sinks, ASP.NET Core integration, and this site's website framework.
---

# Official references

Content in this site is explained in original wording and expanded with examples. Use these primary sources to verify exact behavior and package-version details.

## Serilog references

1. [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics) — logger creation, sinks, levels, overrides, configuration providers.
2. [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events) — message templates, values, formatting, and event-writing APIs.
3. [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data) — scalar values, sequences, structures, destructuring, and stringification.
4. [Provided Sinks](https://github.com/serilog/serilog/wiki/Provided-Sinks) — catalog of sink packages, including community-maintained projects.
5. [Serilog MSSQL sink](https://github.com/serilog-mssql/serilog-sinks-mssqlserver) — SQL Server/Azure SQL sink options, columns, batching, and query examples.
6. [Serilog.AspNetCore](https://github.com/serilog/serilog-aspnetcore) — ASP.NET Core host integration and request logging middleware.

## Website platform

- [VitePress](https://vitepress.dev/guide/what-is-vitepress) — static generator for Markdown documentation.
- [VitePress Markdown extensions](https://vitepress.dev/guide/markdown) — code blocks, links, and anchors.
- [VitePress deployment](https://vitepress.dev/guide/deploy) — base paths and static hosting.
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) — branch or workflow deployment.
- [Mermaid](https://mermaid.js.org/intro/) — text-based diagrams.

## Version note

Serilog core, framework integrations, sinks, and enrichers are separately versioned. Review the README and release notes for the installed versions. Configuration argument names, supported target frameworks, defaults, and hosting lifecycle APIs can change over time. The SQL examples specifically reflect the official MSSQL sink repository reviewed for this guide; validate schema and configuration before production use.
