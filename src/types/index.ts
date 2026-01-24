import { UserRole, ResourceType } from '@prisma/client'

export type { UserRole, ResourceType }

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
}
