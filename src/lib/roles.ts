export const Role = {
  ADMIN: 'ADMIN',
  PARENT: 'PARENT',
} as const

export type Role = (typeof Role)[keyof typeof Role]
