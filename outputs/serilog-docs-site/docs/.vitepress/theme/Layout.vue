<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Breadcrumbs from './Breadcrumbs.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumbs />
    </template>
  </Layout>
</template>
