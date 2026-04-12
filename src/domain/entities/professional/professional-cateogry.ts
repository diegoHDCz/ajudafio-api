export enum ProfessionalCategory {
  CAREGIVER = 'CAREGIVER',
  PHYSIOTHERAPIST = 'PHYSIOTHERAPIST',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  NURSE = 'NURSE',
  HOSPITAL_COMPANION = 'HOSPITAL_COMPANION',
}

export class ProfessionalCategoryParser {
  static fromString(value: string): ProfessionalCategory {
    const normalized = value.toUpperCase().trim()
    if (
      Object.values(ProfessionalCategory).includes(
        normalized as ProfessionalCategory,
      )
    ) {
      return normalized as ProfessionalCategory
    }
    throw new Error(
      `Invalid ProfessionalCategory: "${value}". Valid values: ${Object.values(ProfessionalCategory).join(', ')}`,
    )
  }
}
