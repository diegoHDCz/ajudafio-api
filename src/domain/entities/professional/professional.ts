import { User } from '../user'
import { Role } from '../role'
import { randomUUID } from 'crypto'

export class Professional extends User {
  constructor(
    id: string,
    email: string,
    authId: string | null,
    createdAt: Date | null,
    username: string | null,
    public licenseNumber: string,
    public specialty: string,
    public yearsOfExperience: number,
  ) {
    super(id, email, authId, createdAt, Role.HEALTH_PROFESSIONAL, username)
  }

  // Método de criação específico para Professional
  static createProfessional(
    email: string,
    licenseNumber: string,
    specialty: string,
    yearsOfExperience: number,
    auth_id: string | null = null,
    username: string | null = null,
  ) {
    return new Professional(
      randomUUID(),
      email,
      auth_id,
      new Date(),
      username,
      licenseNumber,
      specialty,
      yearsOfExperience,
    )
  }

  // Métodos específicos do profissional
  isLicensed(): boolean {
    return this.licenseNumber.length > 0
  }

  getFullSpecialty(): string {
    return `${this.specialty} (${this.yearsOfExperience} years experience)`
  }
}
