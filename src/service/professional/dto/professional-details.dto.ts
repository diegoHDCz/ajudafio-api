import { InferSelectModel } from 'drizzle-orm'
import {
  professionals,
  users,
  reviews,
  availabilities,
  address,
} from '../../../infra/db/schema'

// Tipo inferido do resultado do db.query.professionals.findFirst com os withs
export type ProfessionalQueryResult = InferSelectModel<typeof professionals> & {
  user:
    | (InferSelectModel<typeof users> & {
        address: InferSelectModel<typeof address> | null
      })
    | null
  reviews: InferSelectModel<typeof reviews>[]
  availabilities: InferSelectModel<typeof availabilities>[]
}

export class ProfessionalDetailsDTO {
  id: string
  name: string | null
  image: string | null
  category: string
  verified: boolean
  yearsOfExperience: number | null
  resume: string | null
  address: InferSelectModel<typeof address> | null

  metadata: {
    services: string[]
    locations: any[]
  }

  stats: {
    averageRating: number
    totalReviews: number
  }

  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: Date
  }>

  availabilities: InferSelectModel<typeof availabilities>[]

  private constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.image = data.image
    this.category = data.category
    this.verified = data.verified
    this.yearsOfExperience = data.yearsOfExperience
    this.resume = data.resume
    this.metadata = data.metadata
    this.stats = data.stats
    this.reviews = data.reviews
    this.availabilities = data.availabilities
    this.address = data.address
  }

  static fromQueryResult(
    result: ProfessionalQueryResult,
  ): ProfessionalDetailsDTO {
    const totalRating = result.reviews.reduce((sum, r) => sum + r.rating, 0)

    return new ProfessionalDetailsDTO({
      id: result.id,
      name: result.user?.name ?? null,
      image: result.user?.image ?? null,
      category: result.category,
      verified: result.verified,
      yearsOfExperience: result.yearsOfExperience,
      resume: result.resume,
      metadata: result.metadata ?? { services: [], locations: [] },
      address: result.user?.address ?? null,
      availabilities: result.availabilities,
      stats: {
        totalReviews: result.reviews.length,
        averageRating:
          result.reviews.length > 0 ? totalRating / result.reviews.length : 0,
      },
      reviews: result.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    })
  }
}
