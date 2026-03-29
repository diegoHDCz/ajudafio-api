import { ProfessionalRepository } from '../../domain/repositories/professional.repository'
import { Professional } from '../../domain/entities/professional/professional'
import { ProfessionalLocation } from '../../domain/entities/professional/professional-location'
import { ProfessionalService } from '../../domain/entities/professional/professional-service'
import { ProfessionalAvailability } from '../../domain/entities/professional/professional-availability'
import { db } from '../db/drizzle'
import {
  users,
  professional_locations,
  professional_services,
  professional_availabilities,
} from '../db/schema'
import { eq } from 'drizzle-orm'

export class ProfessionalRepositoryImpl implements ProfessionalRepository {
  // Professional methods
  async findById(id: string): Promise<Professional | null> {
    const result = await db.select().from(users).where(eq(users.id, id))

    if (!result.length) return null

    const row = result[0]

    if (row.role !== 'health_professional') return null

    return new Professional(
      row.id,
      row.email,
      row.auth_id,
      row.created_at,
      row.username,
      row.license_number || '',
      row.specialty || '',
      row.years_of_experience || 0,
    )
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return this.findById(userId)
  }

  async findAll(): Promise<Professional[]> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.role, 'health_professional'))

    return results.map(
      (row) =>
        new Professional(
          row.id,
          row.email,
          row.auth_id,
          row.created_at,
          row.username,
          row.license_number || '',
          row.specialty || '',
          row.years_of_experience || 0,
        ),
    )
  }

  async create(professional: Professional): Promise<void> {
    await db.insert(users).values({
      id: professional.id,
      email: professional.email,
      auth_id: professional.authId,
      created_at: professional.createdAt,
      username: professional.username,
      role: professional.role,
      license_number: professional.licenseNumber,
      specialty: professional.specialty,
      years_of_experience: professional.yearsOfExperience,
    })
  }

  async update(professional: Professional): Promise<void> {
    await db
      .update(users)
      .set({
        email: professional.email,
        username: professional.username,
        license_number: professional.licenseNumber,
        specialty: professional.specialty,
        years_of_experience: professional.yearsOfExperience,
      })
      .where(eq(users.id, professional.id))
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id))
  }

  // ProfessionalLocation methods
  async findLocationsByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalLocation[]> {
    const results = await db
      .select()
      .from(professional_locations)
      .where(eq(professional_locations.professional_id, professionalId))

    return results.map(
      (row) =>
        new ProfessionalLocation(
          row.id,
          row.professional_id,
          row.city,
          row.state,
          row.type as 'home' | 'hospital' | 'nursing_home',
        ),
    )
  }

  async createLocation(location: ProfessionalLocation): Promise<void> {
    await db.insert(professional_locations).values({
      id: location.id,
      professional_id: location.professionalId,
      city: location.city,
      state: location.state,
      type: location.type,
    })
  }

  async updateLocation(location: ProfessionalLocation): Promise<void> {
    await db
      .update(professional_locations)
      .set({
        city: location.city,
        state: location.state,
        type: location.type,
      })
      .where(eq(professional_locations.id, location.id))
  }

  async deleteLocation(locationId: string): Promise<void> {
    await db
      .delete(professional_locations)
      .where(eq(professional_locations.id, locationId))
  }

  // ProfessionalService methods
  async findServicesByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalService[]> {
    const results = await db
      .select()
      .from(professional_services)
      .where(eq(professional_services.professional_id, professionalId))

    return results.map(
      (row) =>
        new ProfessionalService(row.id, row.professional_id, row.service_type),
    )
  }

  async createService(service: ProfessionalService): Promise<void> {
    await db.insert(professional_services).values({
      id: service.id,
      professional_id: service.professionalId,
      service_type: service.serviceType,
    })
  }

  async updateService(service: ProfessionalService): Promise<void> {
    await db
      .update(professional_services)
      .set({
        service_type: service.serviceType,
      })
      .where(eq(professional_services.id, service.id))
  }

  async deleteService(serviceId: string): Promise<void> {
    await db
      .delete(professional_services)
      .where(eq(professional_services.id, serviceId))
  }

  // ProfessionalAvailability methods
  async findAvailabilitiesByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalAvailability[]> {
    const results = await db
      .select()
      .from(professional_availabilities)
      .where(eq(professional_availabilities.professional_id, professionalId))

    return results.map(
      (row) =>
        new ProfessionalAvailability(
          row.id,
          row.professional_id,
          row.day_of_week,
          row.start_hour,
          row.end_hour,
          row.shift as 'day' | 'night',
        ),
    )
  }

  async createAvailability(
    availability: ProfessionalAvailability,
  ): Promise<void> {
    await db.insert(professional_availabilities).values({
      id: availability.id,
      professional_id: availability.professionalId,
      day_of_week: availability.dayOfWeek,
      start_hour: availability.startHour,
      end_hour: availability.endHour,
      shift: availability.shift,
    })
  }

  async updateAvailability(
    availability: ProfessionalAvailability,
  ): Promise<void> {
    await db
      .update(professional_availabilities)
      .set({
        day_of_week: availability.dayOfWeek,
        start_hour: availability.startHour,
        end_hour: availability.endHour,
        shift: availability.shift,
      })
      .where(eq(professional_availabilities.id, availability.id))
  }

  async deleteAvailability(availabilityId: string): Promise<void> {
    await db
      .delete(professional_availabilities)
      .where(eq(professional_availabilities.id, availabilityId))
  }
}
