// src/domain/entities/user.ts
import { Role } from './role'

export interface UserEntity {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean
  telephone?: string
  telephonWhatsapp: boolean
  secondTelephone?: string | null
  secondTelephonWhatsapp: boolean
  linkedin?: string | null
  instagram?: string | null
  facebook?: string | null

  role: Role
  identificationNumber?: string
  identificationType?: 'cpf' | 'cnpj'

  createdAt: Date
  updatedAt: Date
}
