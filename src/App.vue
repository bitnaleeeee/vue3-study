<script setup>
import { RouterView } from "vue-router";
import CommonHeader from "./components/CommonHeader";
</script>

<template>
  <CommonHeader />
  <RouterView class="content" />
</template>

<style scoped>
.content {
  min-height: 70vh;
}
</style>
