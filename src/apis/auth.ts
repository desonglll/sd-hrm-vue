import api from '@/apis/http.ts'

export function setAuthToken(token: string): boolean {
  /**
   * true is set auth token successful.
   *
   * false is auth token not valid
   */
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return true
  } else {
    return false
  }
}

export function deleteAuthToken() {
  console.log("Clear Bearer")
  delete api.defaults.headers.common['Authorization']
}

export async function refreshToken(refresh: string) {
  /**
   * true is refresh successful.
   *
   * false is refresh token doesn't exist.
   */
  if (refresh) {
    try {
      const response = await api.post('/api/token/refresh/', { refresh })
      localStorage.setItem('access', response.data.access)
      setAuthToken(response.data.access)
      return response
    } catch (e) {
      console.error('Refresh failed:', e)
      return null
    }
  } else {
    return null
  }
}
