<script setup lang="ts">
import { onMounted } from 'vue'
import router from '@/router'
import { useUserStore } from '@/stores/user.ts'
import { useAuthStore } from '@/stores/auth.ts'

onMounted(() => {
  const authState = useAuthStore()
  if (authState.isLoggedIn) {
    authState.logout()
  }
  router.push('/login') // 直接跳转
})
</script>

<template>
  <div>正在登出...</div>
</template>
