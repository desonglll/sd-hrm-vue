<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
</script>
<template>
  <el-container class="flex flex-row h-full overflow-hidden">
    <el-splitter>
      <el-splitter-panel collapsible size="20%">
        <el-aside width="w-full" class="overflow-y-auto h-full bg-gray-100">
          <SideBar />
        </el-aside>
      </el-splitter-panel>
      <el-splitter-panel>
        <el-main class="flex-1 h-full overflow-auto">
          <RouterView />
        </el-main>
      </el-splitter-panel>
    </el-splitter>
  </el-container>
</template>

<style scoped></style>
