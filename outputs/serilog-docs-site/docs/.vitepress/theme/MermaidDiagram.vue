<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ encoded: string }>()
const target = ref<HTMLElement>()
const fallback = ref<HTMLElement>()
const source = ref('')

onMounted(async () => {
  if (!target.value) return
  try {
    source.value = window.atob(props.encoded)
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default' })
    const id = `diagram-${Math.random().toString(36).slice(2)}`
    const { svg } = await mermaid.render(id, source.value)
    target.value.innerHTML = svg
    target.value.setAttribute('role', 'img')
    target.value.setAttribute('aria-label', 'Diagram illustrating the logging flow described in the surrounding text')
    if (fallback.value) fallback.value.hidden = true
  } catch (error) {
    console.error('Could not render Mermaid diagram', error)
  }
})
</script>

<template>
  <div class="mermaid-frame">
    <div ref="target" class="mermaid-output"></div>
    <details ref="fallback" class="mermaid-fallback">
      <summary>View diagram source</summary>
      <pre><code>{{ source }}</code></pre>
    </details>
  </div>
</template>
