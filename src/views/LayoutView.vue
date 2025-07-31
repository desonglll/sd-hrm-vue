<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <el-container class="h-screen">
    <el-header class="h-16 !p-0">
      <NavBar />
    </el-header>

    <el-main class="!p-0">
        <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped></style>
