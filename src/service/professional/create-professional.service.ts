import { log } from 'node:console'
import { ProfessionalCategory } from '../../domain/entities/professional/professional-cateogry'
import { ProfessionalRepository } from '../../domain/repositories/professional.repository'
import { UpsertAddressService } from '../address/upsert-address.service'
import { DrizzleUpdateUserService } from '../user/update-user.service'
import { randomUUID } from 'node:crypto'
import { logger } from '../../infra/utils/logger'
import { Role } from '../../domain/entities/role'

export interface CreateProfessionalRequest {
  userId: string
  nomeCompleto: string
  areaAtuacao: ProfessionalCategory
  numeroRegistro: string | null
  resumoProfissional: string

  // Contatos
  telefone: string
  telefoneWhatsapp: boolean

  telefoneSecundario?: string | null
  telefoneSecundarioWhatsapp: boolean

  // Redes Sociais (Opcionais)
  linkedin: string | null
  instagram: string | null
  facebook: string | null

  cep: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
  referencia: string | null
}

export class CreateProfessionalService {
  constructor(
    private professionalRepository: ProfessionalRepository,
    private updateUserService: DrizzleUpdateUserService,
    private upsertAddressService: UpsertAddressService,
  ) {}
  async execute(request: CreateProfessionalRequest): Promise<void> {
    logger.info(`Criando profissional para usuário ${request.userId}`)
    await this.updateUserService.execute(request.userId, {
      nomeCompleto: request.nomeCompleto,
      telefone: request.telefone,
      telefoneWhatsapp: request.telefoneWhatsapp,
      telefoneSecundario: request.telefoneSecundario,
      telefoneSecundarioWhatsapp: request.telefoneSecundarioWhatsapp,
      linkedin: request.linkedin,
      instagram: request.instagram,
      facebook: request.facebook,
      role: Role.PROFESSIONAL,
    })

    const professionalId = randomUUID()
    await this.professionalRepository.save({
      userId: request.userId,
      category: request.areaAtuacao,
      licenseNumber: request.numeroRegistro,
      resume: request.resumoProfissional,
      verified: false,
      metadata: { services: [], locations: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
      id: professionalId,
      yearsOfExperience: null,
    })
    logger.info(
      `Profissional criado com ID ${professionalId} para usuário ${request.userId}`,
    )
    await this.upsertAddressService.execute({
      userId: request.userId,
      zipCode: request.cep,
      addressLine: request.logradouro,
      number: request.numero,
      complement: request.complemento,
      district: request.bairro,
      city: request.cidade,
      state: request.uf,
      reference: request.referencia,
    })
    logger.info(`Endereço do profissional ${professionalId} criado/atualizado`)
  }
}
