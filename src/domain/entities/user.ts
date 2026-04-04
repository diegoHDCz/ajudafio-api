// src/domain/entities/user.ts
import { Role } from './role'

export interface UserEntity {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean

  // Seus campos customizados
  username?: string
  fullName?: string
  role: Role
  identificationNumber?: string
  identificationType?: 'cpf' | 'cnpj'

  createdAt: Date
  updatedAt: Date
}
