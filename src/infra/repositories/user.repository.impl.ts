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
    const values: any = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      authId: user.authId,
      created_at: user.createdAt,
      username: user.username,
      role: user.role,
    }

      await db.insert(users).values(values)

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
      authId: row.authId,
      role: Role.create(row.role),
    }
  }

  async updateUserById(userId: string, updates: Partial<User>): Promise<void> {
    const updateData: any = {}
    if (updates.email) updateData.email = updates.email
    if (updates.username) updateData.username = updates.username
    if (updates.authId) updateData.auth_id = updates.authId
    if (updates.role) updateData.role = updates.role

    await db.update(users).set(updateData).where(eq(users.id, userId))
  }
}
