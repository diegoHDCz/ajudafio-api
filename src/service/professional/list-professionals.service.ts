import {
  DrizzleProfessionalRepository,
  Professional,
} from '../../infra/repositories/professional.repository.impl'
import { ListProfessionalDto } from './dto/list-professional.dto'

export class ListProfessionalsService {
  constructor(private professionalRepository: DrizzleProfessionalRepository) {}

  async execute(): Promise<ListProfessionalDto[]> {
    return this.professionalRepository.findAll()
  }
}
