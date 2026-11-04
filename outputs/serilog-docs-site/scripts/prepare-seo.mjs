import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const owner = process.env.GITHUB_REPOSITORY?.split('/')[0]
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const siteUrl = process.env.DOCS_SITE_URL ?? (owner ? `https://${owner}.github.io` : '')
const base = process.env.DOCS_BASE_PATH ?? (process.env.GITHUB_ACTIONS && repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/')
const sitemap = siteUrl ? `Sitemap: ${new URL(`${base}sitemap.xml`, siteUrl).href}\n` : ''
const path = 'docs/public/robots.txt'
await mkdir(dirname(path), { recursive: true })
await writeFile(path, `User-agent: *\nAllow: /\n${sitemap}`)
