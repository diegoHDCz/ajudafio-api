import { eq } from 'drizzle-orm'
import { AvailabilityEntity } from '../../domain/entities/availability'
import { AvailabilityRepository } from '../../domain/repositories/availability.repository'
import { db } from '../db/drizzle'
import { availabilities } from '../db/schema'

export type NewAvailability = typeof availabilities.$inferInsert

export class DrizzleAvailabilityRepository implements AvailabilityRepository {
  async findByProfessionalId(
    professionalId: string,
  ): Promise<AvailabilityEntity[]> {
    const row = await db
      .select()
      .from(availabilities)
      .where(eq(availabilities.professionalId, professionalId))
    return row.map((r) => new AvailabilityEntity(r))
  }
  async save(availability: AvailabilityEntity): Promise<void> {
    const item = availability.toRepository()
    await db.insert(availabilities).values({
      id: item.id,
      professionalId: item.professionalId,
      dayOfWeek: item.dayOfWeek,
      startHour: item.startHour,
      endHour: item.endHour,
      shift: item.shift,
    })
  }

  async update(
    id: string,
    data: Partial<AvailabilityEntity>,
  ): Promise<AvailabilityEntity> {
    const updateData = {
      ...(data.professionalId && { professionalId: data.professionalId }),
      ...(data.dayOfWeek && { dayOfWeek: data.dayOfWeek as any }),
      ...(data.startHour !== undefined && { startHour: data.startHour }),
      ...(data.endHour !== undefined && { endHour: data.endHour }),
      ...(data.shift !== undefined && { shift: data.shift as any }),
    }

    const [updated] = await db
      .update(availabilities)
      .set(updateData)
      .where(eq(availabilities.id, id))
      .returning()

    if (!updated) {
      throw new Error('Availability not found')
    }

    return new AvailabilityEntity(updated)
  }

  async delete(id: string): Promise<void> {
    await db.delete(availabilities).where(eq(availabilities.id, id))
  }
  async saveAll(request: AvailabilityEntity[]): Promise<void> {
    const values = request.map((availability) => availability.toRepository())
    await db.insert(availabilities).values(values)
  }
}
