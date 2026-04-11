// src/domain/entities/user.ts
import { Role } from './role'

export interface UserEntity {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  telephone: string | null
  telephonWhatsapp: boolean
  secondTelephone: string | null
  secondTelephonWhatsapp: boolean
  linkedin: string | null
  instagram: string | null
  facebook: string | null

  role: Role
  identificationNumber: string | null
  identificationType?: 'cpf' | 'cnpj'

  createdAt: Date
  updatedAt: Date
}
