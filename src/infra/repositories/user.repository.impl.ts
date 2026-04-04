import { UserEntity } from '../../domain/entities/user'
import { InferSelectModel } from 'drizzle-orm'
import { users } from '../db/schema'
import { db } from '../db/drizzle'
import { eq } from 'drizzle-orm'
import { UserRepository } from '../../domain/repositories/user.repository'
import { Role } from '../../domain/entities/role'

export type User = InferSelectModel<typeof users>
export class DrizzleUserRepository implements UserRepository {
  async save(user: UserEntity): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      identificationNumber: user.identificationNumber,
      identificationType: user.identificationType,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id))
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id))
    return row ? this.mapToEntity(row) : null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [row] = await db.select().from(users).where(eq(users.email, email))
    return row ? this.mapToEntity(row) : null
  }

  async listByRole(role: Role): Promise<UserEntity[]> {
    const rows = await db.select().from(users).where(eq(users.role, role))
    return rows.map(this.mapToEntity)
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
    return this.mapToEntity(updated)
  }

  private mapToEntity(row: any): UserEntity {
    return {
      ...row,
      role: Role.create(row.role),
    }
  }
}
