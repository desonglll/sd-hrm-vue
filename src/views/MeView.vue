<script setup lang="ts">
import { useUserStore } from '@/stores/user.ts'
import { onMounted, ref } from 'vue'
import type { User } from '@/models/user.ts'
import UserForm from '@/components/user/UserForm.vue'
import { useAuthStore } from '@/stores/auth.ts'

const authState = useAuthStore()
const user = ref<User | null>(null)
onMounted(async () => {
  await authState.fetchUserInfo()
  user.value = authState.loggedInUser
})
</script>

<template>
  <el-container class="w-full flex place-items-center place-content-center">
    <div class="w-[50%] py-2" v-if="user">
      <UserForm :user="user" />
    </div>
  </el-container>
</template>

<style scoped></style>
