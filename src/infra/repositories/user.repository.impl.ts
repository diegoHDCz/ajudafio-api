import {
  UserRepository,
  UserDTO,
} from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'
import { Professional } from '../../domain/entities/professional'
import { db } from '../db/drizzle'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Role } from '../../domain/entities/role'

export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<void> {
    const values: any = {
      id: user.id,
      email: user.email,
      auth_id: user.authId,
      createdAt: user.createdAt,
      username: user.username,
      role: user.role,
    }

    // Adicionar campos específicos do Professional se for um Professional
    if (user.role === 'health_professional') {
      const professional = user as Professional
      values.licenseNumber = professional.licenseNumber
      values.specialty = professional.specialty
      values.yearsOfExperience = professional.yearsOfExperience
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
      authId: row.auth_id,
      role: Role.create(row.role),
      ...(row.role === 'health_professional' &&
        row.licenseNumber && {
          licenseNumber: row.licenseNumber,
          specialty: row.specialty || undefined,
          yearsOfExperience: row.yearsOfExperience || undefined,
        }),
    }
  }
}
