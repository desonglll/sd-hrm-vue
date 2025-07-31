export interface User {
  id: number
  last_login: string
  is_superuser: boolean
  username: string
  phone: string | null
  id_number: string | null
  photo: string | null
  is_active: boolean
  is_staff: boolean
  groups: number[]
  user_permissions: number[]
}
export function defaultUser(): User {
  return {
    id: 0,
    last_login: '',
    is_superuser: false,
    username: '',
    phone: null,
    id_number: null,
    photo: null,
    is_active: false,
    is_staff: false,
    groups: [],
    user_permissions: [],
  }
}
export interface Group {
  id: number
  name: string
  permissions: number[]
}
export interface Permission {
  id: number
  name: string
  codename: string
  content_type: number
}

export interface ContentType {
  id: number
  app_label: string
  model: string
}
