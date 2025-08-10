import { defineStore } from 'pinia'
import { deleteAuthToken, refreshToken, setAuthToken } from '@/apis/auth.ts'
import api from '@/apis/http.ts'
import type { User } from '@/models/user.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedInUser: null as User | null,
    accessToken: localStorage.getItem('access') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    isLoggedIn: false,
  }),
  persist: true,
  actions: {
    init() {
      if (this.accessToken) {
        setAuthToken(this.accessToken)
      }
    },
    async login(username: string, password: string) {
      try {
        const response = await api.post('/api/token/', { username, password })
        const { access, refresh } = response.data
        console.log('Login success')
        this.setTokens(access, refresh)
      } catch (error: any) {
        console.error('Login failed:', error)
      }
    },
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.isLoggedIn = true
      localStorage.setItem('access', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      const result = setAuthToken(accessToken)
      if (result) {
        console.log('Bearer set')
      } else {
        console.log('Bearer set failed')
      }
    },
    async fetchUserInfo() {
      const authState = useAuthStore()
      try {
        const res = await api.get('/api/user/me/')
        if (res) {
          this.loggedInUser = res.data
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          const newAccess = await authState.tryRefreshToken()
          if (newAccess) {
            const res = await api.get('/api/user/me/')
            this.loggedInUser = res.data
          } else {
            this.logout()
          }
        } else {
          throw err
        }
      }
    },
    async tryRefreshToken() {
      try {
        const res = await refreshToken(this.refreshToken)
        if (res) {
          this.setTokens(res.data.access, this.refreshToken)
          return res.data.access
        } else {
          return null
        }
      } catch {
        return null
      }
    },

    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.isLoggedIn = false
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      deleteAuthToken()
    },
  },
})
