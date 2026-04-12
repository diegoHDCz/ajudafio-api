import { ProfessionalCategory } from '../../../domain/entities/professional/professional-cateogry'

export class ListProfessionalDto {
  professionalId: string
  userId: string
  name: string
  licenseNumber: string | null
  category: ProfessionalCategory
  yearsOfExperience: number
  verified: boolean
  resume: string | null
  metadata: Record<string, any>
  constructor(row) {
    this.professionalId = row.professionals.id
    this.userId = row.professionals.userId
    this.name = row.users.name
    this.licenseNumber = row.professionals.licenseNumber
    this.category = row.professionals.category
    this.yearsOfExperience = row.professionals.yearsOfExperience
    this.verified = row.professionals.verified
    this.resume = row.professionals.resume
    this.metadata = row.professionals.metadata
  }
}
