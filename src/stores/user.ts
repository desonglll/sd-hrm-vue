import { defineStore } from 'pinia'
import { deleteAuthToken } from '@/apis/auth.ts'
import { getUserInfo } from '@/apis/user.ts'
import api from '@/apis/http.ts'
import type { User } from '@/models/user.ts'
import { useAuthStore } from '@/stores/auth.ts'
import type { AxiosError } from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    users: null as User[] | null,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    searchBox: '',
  }),
  persist: true,
  actions: {
    async login(username: string, password: string) {
      const authState = useAuthStore()
      try {
        const response = await api.post('/api/token/', { username, password })
        const { access, refresh } = response.data
        console.log('Login success')
        authState.setTokens(access, refresh)
      } catch (error: any) {
        console.error('Login failed:', error)
      }
    },

    async fetchUserInfo() {
      const authState = useAuthStore()
      try {
        const res = await getUserInfo()
        if (res) {
          this.user = res.data
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await getUserInfo()
            this.user = res?.data
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },

    async deleteUserById(id: number): Promise<boolean> {
      const authState = useAuthStore()
      try {
        const res = await api.delete(`users/${id}/`)
        if (res) {
          await this.fetchUserList()
          return true
        }
        return false
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.delete(`users/${id}/`)
            if (res) {
              await this.fetchUserList()
              return true
            }
            return false
          } else {
            this.logout()
            return false
          }
        } else {
          throw err
        }
      }
    },
    async getUserById(id: number) {
      const authState = useAuthStore()
      try {
        const res = await api.get(`users/${id}/`)
        if (res) {
          return res.data
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get(`users/${id}/`)
            if (res) {
              return res.data
            }
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },
    async fetchUserList() {
      const authState = useAuthStore()
      try {
        const res = await api.get('/users/', {
          params: {
            username__icontains: this.searchBox,
            page: this.currentPage,
            page_size: this.pageSize,
          },
        })
        if (res) {
          this.users = res.data.results
          this.count = res.data.count
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get('/users/', {
              params: {
                page: this.currentPage,
                page_size: this.pageSize,
              },
            })
            if (res) {
              this.users = res.data.results
              this.count = res.data.count
            }
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },

    async createUser(user: any) {
      const authState = useAuthStore()

      try {
        const res = await api.post(`/users/`, user, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (res) {
          return res.data
        }
      } catch (err: any) {
        err = err as AxiosError
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.post(`/users/`, user, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            if (res) {
              return res.data
            }
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },

    async updateUser(id: number, user: any) {
      const authState = useAuthStore()
      try {
        const res = await api.put(`/users/${id}/`, user, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (res) {
          return res.data
        }
      } catch (err: any) {
        err = err as AxiosError
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.put(`/users/${id}/`, user, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            if (res) {
              return res.data
            }
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      deleteAuthToken()
    },
  },
})
