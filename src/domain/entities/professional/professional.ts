import { Professional } from '../../../infra/repositories/professional.repository.impl'
import { ProfessionalCategory } from './professional-cateogry'

export class ProfessionalEntity {
  public id: string
  public userId: string
  public licenseNumber: string | null
  public category: ProfessionalCategory
  public yearsOfExperience: number | null
  public verified: boolean
  public resume: string | null
  public metadata: {
    services: string[]
    locations: { city: string; state: string; type: string }[]
  }
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Professional) {
    this.id = props.id
    this.userId = props.userId
    this.licenseNumber = props.licenseNumber
    this.category = props.category as ProfessionalCategory
    this.yearsOfExperience = props.yearsOfExperience
    this.verified = props.verified
    this.resume = props.resume
    this.metadata = {
      services: props.metadata?.services ?? [],
      locations: props.metadata?.locations ?? [],
    }
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
