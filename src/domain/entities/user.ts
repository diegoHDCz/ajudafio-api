import { randomUUID } from 'crypto'
import { Role } from './role'

export class User {
  constructor(
    public id: string,
    public email: string,
    public authId: string | null,
    public createdAt: Date | null,
    public role: Role = Role.CLIENT,
    public username: string | null = null,
  ) {}

  static create(
    email: string,
    auth_id: string | null = null,
    username: string | null = null,
  ) {
    return new User(
      randomUUID(),
      email,
      auth_id,
      new Date(),
      Role.CLIENT,
      username,
    )
  }

  static async createWithRole(
    email: string,
    role: Role,
    auth_id: string | null = null,
    username: string | null = null,
    professionalData?: {
      licenseNumber: string
      specialty: string
      yearsOfExperience: number
    },
  ): Promise<User> {
    if (role === Role.HEALTH_PROFESSIONAL) {
      if (!professionalData) {
        throw new Error(
          'Professional data is required for HEALTH_PROFESSIONAL role',
        )
      }
      // Importação dinâmica para evitar dependência circular
      const { Professional } = await import('./professional')
      return Professional.createProfessional(
        email,
        professionalData.licenseNumber,
        professionalData.specialty,
        professionalData.yearsOfExperience,
        auth_id,
        username,
      )
    }

    return new User(randomUUID(), email, auth_id, new Date(), role, username)
  }

  // Type guard para verificar se é um Professional
  isProfessional(): boolean {
    return this.role === Role.HEALTH_PROFESSIONAL
  }

  // Método para obter o professional se for um
  async asProfessional(): Promise<any> {
    if (this.isProfessional()) {
      const { Professional } = await import('./professional')
      return this as unknown as InstanceType<typeof Professional>
    }
    return null
  }
}
