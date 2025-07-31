import axios from 'axios'
import { useUserStore } from '@/stores/user.ts'
import { useAuthStore } from '@/stores/auth.ts'

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccess = await authStore.tryRefreshToken()
      if (newAccess) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
        return api(originalRequest)
      } else {
        authStore.logout()
      }
    }

    return Promise.reject(error)
  },
)

export default api
