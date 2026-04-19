import { ListProfessionalDto } from '../../service/professional/dto/list-professional.dto'
import { ProfessionalDetailsDTO } from '../../service/professional/dto/professional-details.dto'
import { ProfessionalEntity } from '../entities/professional/professional'

export interface ProfessionalRepository {
  findById(id: string): Promise<ProfessionalDetailsDTO | null>
  findAll(): Promise<ListProfessionalDto[]>
  save(professional: ProfessionalEntity): Promise<void>
  update(
    id: string,
    data: Partial<ProfessionalEntity>,
  ): Promise<ProfessionalEntity>
  delete(id: string): Promise<void>
}
