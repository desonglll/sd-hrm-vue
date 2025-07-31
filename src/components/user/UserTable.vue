<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import type { User } from '@/models/user'
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  sizeList: ['small', '', 'large'] as const,
})
const userState = useUserStore()
const dialogVisible = ref(false)
const deleteTargetUser = ref<User | null>(null)
const multipleSelection = ref<User[]>([])

onMounted(async () => {
  await userState.fetchUserList()
})

const handleCurrentChange = async (page: number) => {
  userState.currentPage = page
  await userState.fetchUserList()
}

const handlePrevClick = async (page: number) => {
  userState.currentPage = page
  await userState.fetchUserList()
}

const handleNextClick = async (page: number) => {
  userState.currentPage = page
  await userState.fetchUserList()
}

const searchClick = async () => {
  userState.currentPage = 1
  await userState.fetchUserList()
}
const handleEdit = (index: number, row: User) => {
  router.push('/manage/user/detail/' + row.id)
}
const handleDelete = async () => {
  if (!deleteTargetUser.value) return

  const result = await userState.deleteUserById(deleteTargetUser.value.id)
  if (result) {
    ElMessage.success(`删除用户 ${deleteTargetUser.value.username} 成功`)
    await userState.fetchUserList()
  }
  dialogVisible.value = false
  deleteTargetUser.value = null
}

const navigateToCreate = () => {
  router.push('/manage/user/new')
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗？')
    .then(() => {
      done()
    })
    .catch(() => {})
}
const confirmDelete = (row: User) => {
  deleteTargetUser.value = row
  dialogVisible.value = true
}

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
  console.log(multipleSelection.value)
}
</script>

<template>
  <el-container class="h-full flex flex-col">
    <el-header class="!h-auto py-2 flex items-center">
      <el-input
        v-model="userState.searchBox"
        style="width: 240px"
        placeholder="请输入用户名"
        :prefix-icon="Search"
        @keyup.enter="searchClick"
      />
      <el-button type="primary" class="ml-2" @click="searchClick">搜索</el-button>
      <el-button type="" class="ml-2" @click="navigateToCreate">新增用户</el-button>
    </el-header>
    <el-main class="flex-1 overflow-auto">
      <el-table
        :data="userState.users"
        border
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" align="center" :width="50" />
        <el-table-column prop="photo" label="头像" width="80" align="center">
          <template #default="scope">
            <el-avatar
              shape="square"
              fit="cover"
              v-if="scope.row.photo"
              :size="40"
              :src="scope.row.photo"
            />
            <el-avatar shape="square" fit="cover" v-else :size="40" :src="state.squareUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column
          prop="last_login"
          label="上次登陆时间"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{
              scope.row.last_login
                ? dayjs(scope.row.last_login).format('YYYY年MM月DD日 HH:mm:ss')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="is_superuser" label="是否为超级用户" align="center" :width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.is_superuser">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="是否激活" align="center" :width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.is_active">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_staff" label="是否为员工" align="center" :width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.is_staff">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Operations" :width="160" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="!h-auto py-2 flex items-center justify-center">
      <el-pagination
        v-model:current-page="userState.currentPage"
        :page-size="userState.pageSize"
        :total="userState.count"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </el-footer>
  </el-container>
  <el-dialog v-model="dialogVisible" title="确认删除" width="500" :before-close="handleClose">
    <span
      >确定要删除用户 <b>{{ deleteTargetUser?.username }}</b> 吗？</span
    >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDelete">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
