import {
  DrizzleProfessionalRepository,
  Professional,
} from '../../infra/repositories/professional.repository.impl'

export class ListProfessionalsService {
  constructor(private professionalRepository: DrizzleProfessionalRepository) {}

  async execute(): Promise<Professional[]> {
    return this.professionalRepository.findAll()
  }
}
