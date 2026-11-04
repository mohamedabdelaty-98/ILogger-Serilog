import { defineConfig } from 'vitepress'
import { Buffer } from 'node:buffer'

const [owner, repository] = process.env.GITHUB_REPOSITORY?.split('/') ?? []
const base = process.env.DOCS_BASE_PATH ?? (process.env.GITHUB_ACTIONS && repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/')
const siteUrl = process.env.DOCS_SITE_URL ?? (owner ? `https://${owner}.github.io` : undefined)

export default defineConfig({
  lang: 'en-US',
  title: 'Serilog & .NET Logging Guide',
  description: 'Understand structured logging, build reliable observability, and implement production-ready logging in .NET.',
  base,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: siteUrl ? { hostname: siteUrl } : undefined,
  transformHead({ pageData }) {
    if (!siteUrl) return []
    const route = pageData.relativePath === 'index.md' ? '' : pageData.relativePath.replace(/\.md$/, '')
    const pageUrl = new URL(`${base}${route}`, siteUrl).href
    return [
      { tag: 'link', attrs: { rel: 'canonical', href: pageUrl } },
      { tag: 'meta', attrs: { property: 'og:url', content: pageUrl } },
      { tag: 'meta', attrs: { property: 'og:title', content: pageData.frontmatter.title ?? 'Serilog & .NET Logging Guide' } },
      { tag: 'meta', attrs: { property: 'og:description', content: pageData.frontmatter.description ?? 'A practical guide to structured logging and Serilog in .NET.' } },
      { tag: 'meta', attrs: { property: 'og:image', content: new URL(`${base}social-card.svg`, siteUrl).href } }
    ]
  },
  head: [
    ['meta', { name: 'theme-color', content: '#f6f8fb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]
  ],
  markdown: {
    lineNumbers: true,
    config(md) {
      const originalFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        const token = tokens[index]
        if (token.info.trim() === 'mermaid') {
          const encoded = Buffer.from(token.content, 'utf8').toString('base64')
          return `<MermaidDiagram encoded="${encoded}" />\n`
        }
        return originalFence ? originalFence(tokens, index, options, env, self) : self.renderToken(tokens, index, options)
      }
    }
  },
  themeConfig: {
    siteTitle: 'Serilog & .NET Logging',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Quick reference', link: '/reference' },
      { text: 'Sources', link: '/sources' }
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous chapter', next: 'Next chapter' },
    sidebar: [
      { text: 'Getting started', collapsed: false, items: [
        { text: 'Introduction to logging', link: '/guide/introduction' },
        { text: 'What is Serilog?', link: '/guide/serilog' },
        { text: 'Structured logging', link: '/guide/structured-logging' },
        { text: 'Architecture', link: '/guide/architecture' },
        { text: 'Getting started', link: '/guide/getting-started' }
      ]},
      { text: 'Configuration', collapsed: true, items: [
        { text: 'Configuration basics', link: '/guide/configuration' },
        { text: 'Levels and overrides', link: '/guide/configuration#logging-levels' },
        { text: 'Logger vs sink filtering', link: '/guide/configuration#logger-minimum-versus-sink-minimum' },
        { text: 'appsettings.json', link: '/guide/configuration#code-and-appsettings-configuration' },
        { text: 'Logger lifecycle', link: '/guide/configuration#logger-lifecycle' }
      ]},
      { text: 'Writing events', collapsed: true, items: [
        { text: 'Writing log events', link: '/guide/events' },
        { text: 'Message templates', link: '/guide/events#templates-and-named-values' },
        { text: 'Exception logging', link: '/guide/events#exceptions-and-avoiding-duplicates' },
        { text: 'Best practices', link: '/guide/events#good-and-poor-examples' }
      ]},
      { text: 'Structured data', collapsed: true, items: [
        { text: 'Structured properties', link: '/guide/structured-logging' },
        { text: 'Destructuring', link: '/guide/structured-logging#structured-logging-and-structured-data' }
      ]},
      { text: 'Enrichers and context', collapsed: true, items: [
        { text: 'Enrichers', link: '/guide/enrichers' },
        { text: 'LogContext', link: '/guide/enrichers#enrichers-and-context' },
        { text: 'Thread and trace IDs', link: '/guide/enrichers#enrichers-and-context' }
      ]},
      { text: 'Sinks', collapsed: true, items: [
        { text: 'Destinations', link: '/guide/sinks' },
        { text: 'Multiple sinks', link: '/guide/sinks#multiple-sink-routing' },
        { text: 'Filtering', link: '/guide/configuration#logger-minimum-versus-sink-minimum' }
      ]},
      { text: 'SQL Server', collapsed: true, items: [
        { text: 'MSSQL sink', link: '/guide/sql-server' },
        { text: 'Columns and JSON', link: '/guide/sql-server#json-versus-columns' },
        { text: 'Batching and operations', link: '/guide/sql-server#batching' },
        { text: 'SQL queries', link: '/guide/sql-server#sql-schema' }
      ]},
      { text: 'Implementation', collapsed: true, items: [
        { text: 'ASP.NET Core example', link: '/guide/implementation' },
        { text: 'Order API flow', link: '/guide/implementation#aspnet-core-request-and-event-flow' }
      ]},
      { text: 'Production', collapsed: true, items: [
        { text: 'Team standards', link: '/guide/production' },
        { text: 'Troubleshooting', link: '/guide/troubleshooting' }
      ]},
      { text: 'Reference', collapsed: true, items: [
        { text: 'Quick reference', link: '/reference' },
        { text: 'API reference', link: '/api-reference' },
        { text: 'Frequently asked questions', link: '/faq' },
        { text: 'Knowledge check', link: '/knowledge-check' },
        { text: 'Official references', link: '/sources' }
      ]}
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/serilog/serilog' }],
    footer: {
      message: 'Technical learning resource. Confirm package-version details before production use.',
      copyright: 'Original explanations with links to official Serilog references.'
    }
  }
})
