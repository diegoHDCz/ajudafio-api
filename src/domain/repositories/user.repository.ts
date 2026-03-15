import { Role } from '../entities/role'
import { User } from '../entities/user'

export interface UserDTO {
  id: string
  email: string
  createdAt: Date | null
  authId?: string | null
  role?: Role | null
}

export interface UserRepository {
  create(user: User): Promise<void>
  findById(id: string): Promise<UserDTO | null>
  findByEmail(email: string): Promise<UserDTO | null>
}
