import { defineStore } from 'pinia'
import { deleteAuthToken } from '@/apis/auth.ts'
import api from '@/apis/http.ts'
import type { User } from '@/models/user.ts'
import { useAuthStore } from '@/stores/auth.ts'
import type { AxiosError } from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: null as User[] | null,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    searchBox: '',
    sortParam: '',
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

    async deleteUserById(id: number): Promise<boolean> {
      const authState = useAuthStore()
      try {
        const res = await api.delete(`api/users/${id}/`)
        if (res) {
          await this.fetchUserList()
          return true
        }
        return false
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.delete(`api/users/${id}/`)
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
        const res = await api.get(`api/users/${id}/`)
        if (res) {
          return res.data
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get(`api/users/${id}/`)
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
    async fetchUserList(extraParams: Record<string, any> = {}) {
      const authState = useAuthStore()
      const params = {
        page: this.currentPage,
        page_size: this.pageSize,
        username__icontains: this.searchBox,
        ordering: this.sortParam,
        ...extraParams,
      }
      try {
        const res = await api.get('api/users/', {
          params: params,
        })
        if (res) {
          this.users = res.data.results
          this.count = res.data.count
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get('api/users/', {
              params: params,
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
        const res = await api.post(`/api/users/`, user, {
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
            const res = await api.post(`/api/users/`, user, {
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

    async resetPassword(id: number, newPassword: string) {
      const authState = useAuthStore()
      try {
        const res = await api.post(`/api/reset_password/`, {
          id: id,
          new_password: newPassword,
        })
        if (res) {
          return res.data
        }
      } catch (err: any) {
        err = err as AxiosError
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.post(`/api/reset_password/`, {
              id: id,
              new_password: newPassword,
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
        const res = await api.put(`api/users/${id}/`, user, {
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
            const res = await api.put(`api/users/${id}/`, user, {
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
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      deleteAuthToken()
    },
  },
})
