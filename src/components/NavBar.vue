<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()

export interface NavItem {
  name: string
  title: string
  link: string
  type: string
  children: [{ name: string; title: string; link: string }] | []
}

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
const navItems: NavItem[] = [
  { name: 'index', title: '首页', link: '/home', type: 'menu', children: [] },
  { name: 'manage', title: '管理', link: '/manage', type: 'menu', children: [] },
  { name: 'me', title: '我的', link: '/me', type: 'menu', children: [] },
  { name: 'about', title: '关于', link: '/about', type: 'menu', children: [] },
  { name: 'logout', title: '登出', link: '/logout', type: 'menu', children: [] },
]

const handleSelect = (value: string) => {
  router.push(value)
}

onMounted(async () => {})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 bg-white shadow z-50">
    <el-menu mode="horizontal" @select="handleSelect" :default-active="activeIndex">
      <el-menu-item v-for="item in navItems" v-bind:key="item.name" v-bind:index="item.link"
        >{{ item.title }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped></style>
