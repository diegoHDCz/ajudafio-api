import { Role } from '../../domain/entities/role'
import { UserRepository } from '../../domain/repositories/user.repository'
import { logger } from '../../infra/utils/logger'

export interface UpdateUserDTO {
  nomeCompleto: string
  role?: Role
  telefone: string
  telefoneWhatsapp: boolean

  telefoneSecundario?: string | null
  telefoneSecundarioWhatsapp: boolean

  linkedin?: string | null
  instagram?: string | null
  facebook?: string | null
}

export class DrizzleUpdateUserService {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string, req: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    logger.info(
      `Atualizando usuário ${id} com os dados: ${JSON.stringify(req)}`,
    )

    await this.userRepository.update(id, {
      name: req.nomeCompleto,
      role: req.role,
      telephone: req.telefone,
      telephonWhatsapp: req.telefoneWhatsapp,
      secondTelephone: req.telefoneSecundario,
      secondTelephonWhatsapp: req.telefoneSecundarioWhatsapp,
      linkedin: req.linkedin,
      instagram: req.instagram,
      facebook: req.facebook,
      updatedAt: new Date(),
    })
  }
}
