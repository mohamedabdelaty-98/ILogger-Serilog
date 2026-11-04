<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { page } = useData()
const labels: Record<string, string> = {
  guide: 'Guide', introduction: 'Introduction to logging', serilog: 'What is Serilog?',
  architecture: 'Architecture', 'getting-started': 'Getting started', configuration: 'Configuration',
  events: 'Writing log events', 'structured-logging': 'Structured logging', enrichers: 'Enrichers and context',
  sinks: 'Sinks and destinations', 'sql-server': 'SQL Server sink', implementation: 'ASP.NET Core implementation',
  production: 'Production standard', troubleshooting: 'Troubleshooting', reference: 'Quick reference',
  'knowledge-check': 'Knowledge check', sources: 'Official references', 'api-reference': 'API reference', faq: 'FAQ'
}
const crumbs = computed(() => {
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  const segments = path.split('/').filter(Boolean)
  if (!segments.length) return []
  const items = [{ label: 'Home', href: '/' }]
  if (segments[0] === 'guide') items.push({ label: 'Guide', href: '/guide/introduction' })
  const key = segments.at(-1) ?? ''
  items.push({ label: page.value.title || labels[key] || key, href: path })
  return items.filter((item, index) => index === 0 || item.label !== items[index - 1]?.label)
})
</script>

<template>
  <nav v-if="crumbs.length" class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li v-for="(item, index) in crumbs" :key="item.href">
        <a v-if="index < crumbs.length - 1" :href="item.href">{{ item.label }}</a>
        <span v-else aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
