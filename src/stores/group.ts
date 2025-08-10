import { defineStore } from 'pinia'
import type { Group } from '@/models/user.ts'
import api from '@/apis/http.ts'
import { useAuthStore } from '@/stores/auth.ts'

export const useGroupStore = defineStore('group', {
  state: () => ({
    count: 0,
    groups: null as Group[] | null,
  }),
  persist: true,
  actions: {
    async fetchGroupList() {
      const authState = useAuthStore()
      try {
        const res = await api.get('api/groups/')
        if (res) {
          this.groups = res.data.results
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get('api/groups/')
            this.groups = res.data.results
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
