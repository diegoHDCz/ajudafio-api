import { ProfessionalEntity } from '../entities/professional/professional'

export interface ProfessionalRepository {
  findById(id: string): Promise<ProfessionalEntity | null>
  findAll(): Promise<ProfessionalEntity[]>
  save(professional: ProfessionalEntity): Promise<void>
  update(
    id: string,
    data: Partial<ProfessionalEntity>,
  ): Promise<ProfessionalEntity>
  delete(id: string): Promise<void>
}
