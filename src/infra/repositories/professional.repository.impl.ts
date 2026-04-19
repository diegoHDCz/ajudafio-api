import { ProfessionalEntity } from '../../domain/entities/professional/professional'
import { ProfessionalRepository } from '../../domain/repositories/professional.repository'
import { eq, InferSelectModel } from 'drizzle-orm'
import { db } from '../db/drizzle'
import {
  address,
  availabilities,
  professionals,
  reviews,
  users,
} from '../db/schema'
import { ListProfessionalDto } from '../../service/professional/dto/list-professional.dto'
import {
  ProfessionalDetailsDTO,
  ProfessionalQueryResult,
} from '../../service/professional/dto/professional-details.dto'

export type Professional = InferSelectModel<typeof professionals>

export type ProfessionalSelectRow = {
  professionals: InferSelectModel<typeof professionals>
  users: InferSelectModel<typeof users> | null
  addresses: InferSelectModel<typeof address> | null
}

export type ProfessionalDetailsRow = {
  professionals: InferSelectModel<typeof professionals>
  users: InferSelectModel<typeof users> | null
  reviews: InferSelectModel<typeof reviews> | null
  addresses: InferSelectModel<typeof address> | null
}

export class DrizzleProfessionalRepository implements ProfessionalRepository {
  async findById(id: string): Promise<ProfessionalDetailsDTO | null> {
    const result = await db.query.professionals.findFirst({
      where: eq(professionals.id, id),
      with: {
        user: {
          with: {
            address: true,
          },
        },
        reviews: {
          limit: 3,
          orderBy: (rev, { desc }) => [desc(reviews.createdAt)],
        },
        availabilities: true,
      },
    })

    if (!result) return null

    return ProfessionalDetailsDTO.fromQueryResult(
      result as ProfessionalQueryResult,
    )
  }

  async findAll(): Promise<ListProfessionalDto[]> {
    const rows = await db
      .select()
      .from(professionals)
      .leftJoin(users, eq(professionals.userId, users.id))
      .leftJoin(address, eq(users.id, address.userId))

    return rows.map(
      (row) => new ListProfessionalDto(row as ProfessionalSelectRow),
    )
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
