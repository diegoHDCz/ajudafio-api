import { InferSelectModel } from 'drizzle-orm'
import { AvailabilityEntity } from '../entities/availability'
import { availabilities } from '../../infra/db/schema'

export type Availability = InferSelectModel<typeof availabilities>

export interface AvailabilityRepository {
  findByProfessionalId(professionalId: string): Promise<AvailabilityEntity[]>
  save(availability: AvailabilityEntity): Promise<void>
  update(
    id: string,
    data: Partial<AvailabilityEntity>,
  ): Promise<AvailabilityEntity>
  delete(id: string): Promise<void>
  saveAll(availabilities: AvailabilityEntity[]): Promise<void>
}
