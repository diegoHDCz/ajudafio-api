import { DrizzleProfessionalRepository } from '../../infra/repositories/professional.repository.impl'
import { logger } from '../../infra/utils/logger'
import { ProfessionalDetailsDTO } from './dto/professional-details.dto'

export class DetailProfessionalUseCase {
  constructor(private professionalRepository: DrizzleProfessionalRepository) {}

  async execute(
    professionalId: string,
  ): Promise<ProfessionalDetailsDTO | null> {
    logger.info(`Buscando detalhes do profissional com ID: ${professionalId}`)
    return this.professionalRepository.findById(professionalId)
  }
}
