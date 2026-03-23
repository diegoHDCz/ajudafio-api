import { Professional } from '../entities/professional/professional'
import { ProfessionalAvailability } from '../entities/professional/professional-availability'
import { ProfessionalLocation } from '../entities/professional/professional-location'
import { ProfessionalService } from '../entities/professional/professional-service'

export interface ProfessionalRepository {
  // Professional methods
  findById(id: string): Promise<Professional | null>
  findByUserId(userId: string): Promise<Professional | null>
  findAll(): Promise<Professional[]>
  create(professional: Professional): Promise<void>
  update(professional: Professional): Promise<void>
  delete(id: string): Promise<void>

  // ProfessionalLocation methods
  findLocationsByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalLocation[]>
  createLocation(location: ProfessionalLocation): Promise<void>
  updateLocation(location: ProfessionalLocation): Promise<void>
  deleteLocation(locationId: string): Promise<void>

  // ProfessionalService methods
  findServicesByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalService[]>
  createService(service: ProfessionalService): Promise<void>
  updateService(service: ProfessionalService): Promise<void>
  deleteService(serviceId: string): Promise<void>

  // ProfessionalAvailability methods
  findAvailabilitiesByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalAvailability[]>
  createAvailability(availability: ProfessionalAvailability): Promise<void>
  updateAvailability(availability: ProfessionalAvailability): Promise<void>
  deleteAvailability(availabilityId: string): Promise<void>
}
