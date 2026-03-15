import {
  UserRepository,
  UserDTO,
} from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'
import { db } from '../db/drizzle'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Role } from '../../domain/entities/role'

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      auth_id: user.authId,
      createdAt: user.createdAt,
      username: user.username,
      role: user.role,
    })
  }

  async findById(id: string): Promise<UserDTO | null> {
    const result = await db.select().from(users).where(eq(users.id, id))

    if (!result.length) return null

    const row = result[0]

    return {
      id: row.id,
      email: row.email,
      createdAt: row.createdAt,
    }
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const result = await db.select().from(users).where(eq(users.email, email))
    if (!result.length) return null

    const row = result[0]

    return {
      id: row.id,
      email: row.email,
      createdAt: row.createdAt,
      authId: row.auth_id,
      role: Role.create(row.role),
    }
  }
}
