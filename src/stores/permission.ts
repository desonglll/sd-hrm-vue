import { defineStore } from 'pinia'
import { getPermissionList } from '@/apis/user.ts'
import type { Permission } from '@/models/user.ts'
import { useAuthStore } from '@/stores/auth.ts'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    count: 0,
    permissions: null as Permission[] | null,
  }),
  persist: true,
  actions: {
    async fetchPermissionList() {
      const authState = useAuthStore()
      try {
        const res = await getPermissionList()
        if (res) {
          this.permissions = res.data.results
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await getPermissionList()
            this.permissions = res?.data.results
          } else {
            authState.logout()
          }
        } else {
          throw err
        }
      }
    },
  },
})
