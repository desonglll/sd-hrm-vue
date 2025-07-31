<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.ts'
import router from '@/router'

const userStore = reactive(useUserStore())
const cancel = () => {
  ElMessage('This is a message.')
}
const form = reactive({
  username: '',
  password: '',
})

const onSubmit = async () => {
  console.log('submit!')

  const { username, password } = form
  await userStore.login(username, password)
  await router.push({ path: '/' })
}
</script>

<template>
  <el-form :model="form">
    <el-form-item label="用户名">
      <el-input v-model="form.username" />
    </el-form-item>

    <el-form-item label="密码">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登陆</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
