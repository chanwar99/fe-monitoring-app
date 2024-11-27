<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterView />
    <notifications group="default" position="top left" />
  </div>
</template>

<style scoped></style>
