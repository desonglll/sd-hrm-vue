<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import { defaultUser, type User } from '@/models/user.ts'
import UserForm from '@/components/user/UserForm.vue'

const route = useRoute()
const id = Number(route.params.id)
const userState = useUserStore()
const user = ref<User | null>(null)

onMounted(async () => {
  user.value = await userState.getUserById(id)
})
</script>

<template>
  <div class="w-full flex place-content-center place-items-center">
    <div class="w-[50%]">
    <UserForm :user="user" v-if="user" />
    </div>
  </div>
</template>

<style scoped></style>
