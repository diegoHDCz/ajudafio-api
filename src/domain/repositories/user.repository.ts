// src/domain/repositories/user-repository.ts
import { UserEntity } from '../entities/user'
import { Role } from '../entities/role'

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  listByRole(role: Role): Promise<UserEntity[]>
  save(user: UserEntity): Promise<void>
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>
  delete(id: string): Promise<void>
}
