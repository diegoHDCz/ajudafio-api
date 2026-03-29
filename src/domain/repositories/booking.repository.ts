import { Booking } from '../entities/booking'

export interface BookingDTO {
  id: string
  contractId: string
  professionalId: string
  status: 'pending' | 'confirmed' | 'rejected'
}

export interface BookingRepository {
  findById(id: string): Promise<BookingDTO | null>
  findByContractId(contractId: string): Promise<BookingDTO[]>
  findByProfessionalId(professionalId: string): Promise<BookingDTO[]>
  findAll(): Promise<BookingDTO[]>
  create(booking: Booking): Promise<void>
  update(booking: Booking): Promise<void>
  delete(id: string): Promise<void>
}
