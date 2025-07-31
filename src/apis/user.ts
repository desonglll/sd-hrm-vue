import api from '@/apis/http.ts'

export async function getUserInfo() {
  try {
    return await api.get('/user/me/')
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getPermissionList() {
  try {
    return await api.get('/permissions/')
  } catch (e) {
    console.error(e)
    return null
  }
}
export async function getGroupList() {
  try {
    return await api.get('/groups/')
  } catch (e) {
    console.error(e)
    return null
  }
}
