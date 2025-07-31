<script setup lang="ts">
import router from '@/router'
import { computed, onMounted } from 'vue'
import type { NavItem } from './NavBar.vue'
import { useRoute } from 'vue-router'
import type { SubMenuProps } from 'element-plus'

const route = useRoute()
const onSelect = (item: string) => {
  router.push(item)
}

const navItems: NavItem[] = [
  {
    name: 'user',
    title: '用户管理',
    link: '/manage/user',
    type: 'menu',
    children: [
      {
        name: 'list',
        title: '用户列表',
        link: '/manage/user/list',
      },
    ],
  },
]

const activeIndex = computed(() => {
  const currentPath = route.path

  // 遍历所有 navItems 的 children，匹配当前路径
  for (const nav of navItems) {
    if (nav.children) {
      for (const child of nav.children) {
        if (currentPath.startsWith(child.link)) {
          return child.link
        }
      }
    }
    // 如果没有 children，匹配父级链接
    if (currentPath.startsWith(nav.link)) {
      return nav.link
    }
  }

  return ''
})

onMounted(() => {})
</script>

<template>
  <el-menu :default-active="activeIndex" class="el-menu-vertical-demo h-full" @select="onSelect">
    <el-sub-menu v-for="nav in navItems" :index="nav.link">
      <template #title>
        <span>{{ nav.title }}</span>
      </template>
      <el-menu-item v-for="item in nav.children" :index="item.link">{{ item.title }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped></style>
