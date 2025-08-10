<script setup lang="ts">
import { defaultUser, type User } from '@/models/user.ts'
import { backendUrl } from '@/apis/http.ts'
import dayjs from 'dayjs'
import { onMounted, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import { usePermissionStore } from '@/stores/permission.ts'
import { useGroupStore } from '@/stores/group.ts'
import { localizePermissions } from '@/models/permission.ts'
import { useUserStore } from '@/stores/user.ts'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.ts'

const permissionState = usePermissionStore()
const groupState = useGroupStore()
const userState = useUserStore()
const authState = useAuthStore()

const localizedPermissions = ref()

onMounted(async () => {
  await permissionState.fetchPermissionList()
  await groupState.fetchGroupList()
  if (permissionState.permissions) {
    localizedPermissions.value = localizePermissions(permissionState.permissions)
  }
  avatarPreviewUrl.value = user.photo
})

const props = defineProps<{ user?: User }>()

const user = reactive<User>(props.user ?? defaultUser())

const avatarFile = ref<File | null>(null)
const avatarPreviewUrl = ref<string | null>(null)

const handleAvatarChange = (file: any) => {
  avatarFile.value = file.raw

  const reader = new FileReader()
  reader.onload = () => {
    avatarPreviewUrl.value = reader.result as string
  }
  reader.readAsDataURL(file.raw)
}
const onSubmit = async () => {
  console.log(user)
  const data = new FormData()
  if (user.username && user.username.trim() !== '') {
    data.append('username', user.username.trim())
  }

  if (user.phone && user.phone.trim() !== '') {
    data.append('phone', user.phone.trim())
  }

  if (user.id_number && user.id_number.trim() !== '') {
    data.append('id_number', user.id_number.trim())
  }

  // last_login 可以为空字符串，后端处理空串逻辑
  if (user.last_login && user.last_login.trim() !== '') {
    data.append('last_login', dayjs(user.last_login).toISOString())
  }

  // 数组非空且长度大于0才append
  if (Array.isArray(user.user_permissions) && user.user_permissions.length > 0) {
    user.user_permissions.forEach((perm) => {
      data.append('user_permissions', String(perm))
    })
  }

  if (Array.isArray(user.groups) && user.groups.length > 0) {
    user.groups.forEach((group) => {
      data.append('groups', String(group))
    })
  }
  // 布尔值直接判断是否是 boolean，确保传入字符串 true/false
  data.append('is_superuser', String(user.is_superuser))
  data.append('is_active', String(user.is_active))
  data.append('is_staff', String(user.is_staff))
  // 文件存在且是 File 类型
  if (avatarFile.value instanceof File) {
    data.append('photo', avatarFile.value)
  }

  try {
    if (user.id == 0) {
      // 🔵 创建新用户
      const newUser = await userState.createUser(data)
      await userState.resetPassword(newUser.id, '12345678')
      ElMessage.success('创建成功')
      router.back()
    } else {
      // 🟢 更新已有用户
      await userState.updateUser(user.id, data)
      ElMessage.success('更新成功')
      router.back()
    }
  } catch (err: any) {
    const e = err as AxiosError
    console.error('提交失败', e.response)
    ElMessage.error('提交失败: ' + JSON.stringify(e.response))
  }
}

const filterMethod = (query: any, item: any) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}
</script>

<template>
  <el-button @click="router.back()">返回</el-button>
  <el-form :model="user" :label-width="120">
    <div class="flex flex-row justify-center items-center m-5">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAvatarChange"
      >
        <img
          v-if="avatarPreviewUrl"
          :src="avatarPreviewUrl"
          class="avatar h-200"
          :alt="user.username"
        />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <el-button
        class="m-5"
        type="danger"
        @click="
          () => {
            avatarPreviewUrl = null
            avatarFile = null
          }
        "
        >清除头像
      </el-button>
    </div>
    <el-form-item label="用户名">
      <el-input v-model="user.username" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="user.phone" />
    </el-form-item>
    <el-form-item label="身份证号">
      <el-input v-model="user.id_number" />
    </el-form-item>
    <el-form-item label="上次登陆时间">
      <el-date-picker
        v-model="user.last_login"
        type="datetime"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="是否为超级管理员" v-if="authState.loggedInUser?.is_superuser">
      <el-switch v-model="user.is_superuser" />
    </el-form-item>
    <el-form-item label="是否活跃" v-if="authState.loggedInUser?.is_superuser">
      <el-switch v-model="user.is_active" />
    </el-form-item>
    <el-form-item label="是否可以登陆网站" v-if="authState.loggedInUser?.is_superuser">
      <el-switch v-model="user.is_staff" />
    </el-form-item>
    <el-form-item label="用户权限" v-if="authState.loggedInUser?.is_superuser">
      <el-transfer
        :titles="['所有权限', '已有权限']"
        v-model="user.user_permissions"
        filterable
        :filter-method="filterMethod"
        :data="
          localizedPermissions?.map((item: any) => {
            return {
              key: item.id,
              label: item.cn_name || item.name, // 用本地化的中文名cn_name，没有则用原名
              disabled: false,
            }
          }) || []
        "
      >
        <template #default="{ option }">
          <span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="option.label"
              placement="top-start"
            >
              {{ option.label }}
            </el-tooltip>
          </span>
        </template>
      </el-transfer>
    </el-form-item>
    <el-form-item label="用户组" v-if="authState.loggedInUser?.is_superuser">
      <el-transfer
        :titles="['所有组', '已在组']"
        v-model="user.groups"
        filterable
        :filter-method="filterMethod"
        :data="
          groupState.groups?.map((item) => {
            return {
              key: item.id,
              label: item.name,
              disabled: false,
            }
          })
        "
      >
        <template #default="{ option }">
          <span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="option.label"
              placement="top-start"
            >
              {{ option.label }}
            </el-tooltip>
          </span>
        </template>
      </el-transfer>
    </el-form-item>
    <el-form-item>
      <el-button v-if="user.id !== 0" type="primary" @click="onSubmit">更新</el-button>
      <el-button v-else type="primary" @click="onSubmit">创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
  <!--  </div>-->
</template>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
