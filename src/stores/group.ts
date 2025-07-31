import { defineStore } from 'pinia'
import { getGroupList } from '@/apis/user.ts'
import type { Group } from '@/models/user.ts'
import { useUserStore } from '@/stores/user.ts'

export const useGroupStore = defineStore('group', {
  state: () => ({
    count: 0,
    groups: null as Group[] | null,
  }),
  persist: true,
  actions: {
    async fetchGroupList() {
      const userState = useUserStore()
      try {
        const res = await getGroupList()
        if (res) {
          this.groups = res.data.results
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await userState.tryRefreshToken()
          if (newAccess) {
            const res = await getGroupList()
            this.groups = res?.data.results
          } else {
            userState.logout()
          }
        } else {
          throw err
        }
      }
    },
  },
})
