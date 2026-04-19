import {
  ProfessionalCategory,
  ProfessionalCategoryParser,
} from '../../../domain/entities/professional/professional-cateogry'
import { ProfessionalSelectRow } from '../../../infra/repositories/professional.repository.impl'

export class ListProfessionalDto {
  professionalId: string
  userId: string
  name: string
  licenseNumber: string | null
  category: ProfessionalCategory
  yearsOfExperience: number | null
  verified: boolean
  addressLine: string | null
  city: string | null
  state: string | null
  resume: string | null
  metadata: Record<string, any>
  constructor(row: ProfessionalSelectRow) {
    this.professionalId = row.professionals.id
    this.userId = row.professionals.userId
    this.name = row.users?.name || 'Unknown'
    this.licenseNumber = row.professionals.licenseNumber
    this.category = ProfessionalCategoryParser.fromString(
      row.professionals.category,
    )
    this.city = row.addresses?.city || 'null'
    this.addressLine = row.addresses?.addressLine || 'null'
    this.state = row.addresses?.state || 'null'
    this.yearsOfExperience = row.professionals.yearsOfExperience
    this.verified = row.professionals.verified
    this.resume = row.professionals.resume
    this.metadata = ListProfessionalDto.transformMetadata(
      row.professionals.metadata,
    )
  }

  private static transformMetadata(
    metadata: {
      services: string[]
      locations: {
        city: string
        state: string
        type: string
      }[]
    } | null,
  ): Record<string, any> {
    if (!metadata) {
      return {}
    }
    return {
      services: metadata.services || [],
      locations: metadata.locations || [],
    }
  }
}
