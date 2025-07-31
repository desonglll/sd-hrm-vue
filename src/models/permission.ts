import type { Permission } from '@/models/user.ts'

export const permissionNameMap: Record<string, string> = {
  add_logentry: '添加日志条目',
  change_logentry: '修改日志条目',
  delete_logentry: '删除日志条目',
  view_logentry: '查看日志条目',

  add_group: '添加用户组',
  change_group: '修改用户组',
  delete_group: '删除用户组',
  view_group: '查看用户组',

  add_permission: '添加权限',
  change_permission: '修改权限',
  delete_permission: '删除权限',
  view_permission: '查看权限',

  add_contenttype: '添加内容类型',
  change_contenttype: '修改内容类型',
  delete_contenttype: '删除内容类型',
  view_contenttype: '查看内容类型',

  add_session: '添加会话',
  change_session: '修改会话',
  delete_session: '删除会话',
  view_session: '查看会话',

  add_user: '添加用户',
  can_add_user: '增加用户',
  can_change_user: '修改用户',
  can_delete_user: '删除用户',
  can_view_user: '查看用户',
  change_user: '修改用户',
  delete_user: '删除用户',
  view_user: '查看用户',
}

export function localizePermissions(perms: Permission[]) {
  return perms.map((p) => ({
    ...p,
    cn_name: permissionNameMap[p.codename] || p.name, // 多加 cn_name 字段
  }))
}
