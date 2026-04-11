import { ProfessionalEntity } from '../../domain/entities/professional/professional'
import { ProfessionalRepository } from '../../domain/repositories/professional.repository'
import { eq, InferSelectModel } from 'drizzle-orm'
import { db } from '../db/drizzle'
import { professionals } from '../db/schema'

export type Professional = InferSelectModel<typeof professionals>

export class DrizzleProfessionalRepository implements ProfessionalRepository {
  async findById(id: string): Promise<ProfessionalEntity | null> {
    const [row]: Professional[] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.id, id))

    if (!row) return null

    return new ProfessionalEntity(row)
  }

  async findAll(): Promise<ProfessionalEntity[]> {
    const rows: Professional[] = await db.select().from(professionals)

    return rows.map((row) => new ProfessionalEntity(row as any))
  }

  async save(professional: ProfessionalEntity): Promise<void> {
    await db.insert(professionals).values({
      id: professional.id,
      userId: professional.userId,
      licenseNumber: professional.licenseNumber,
      category: professional.category,
      yearsOfExperience: professional.yearsOfExperience,
      verified: professional.verified,
      resume: professional.resume,
      metadata: professional.metadata,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    })
  }

  async update(
    id: string,
    data: Partial<ProfessionalEntity>,
  ): Promise<ProfessionalEntity> {
    // Aqui o 'returning()' entrega um array de 'Professional'
    const [updatedRow]: Professional[] = await db
      .update(professionals)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(professionals.id, id))
      .returning()

    if (!updatedRow) {
      throw new Error(`Professional with id ${id} not found.`)
    }

    return new ProfessionalEntity(updatedRow as any)
  }

  async delete(id: string): Promise<void> {
    await db.delete(professionals).where(eq(professionals.id, id))
  }
}
