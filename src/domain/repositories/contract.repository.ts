import { Contract } from '../entities/contract/contract'
import { ContractDetails } from '../entities/contract/contract-details'
import { ContractLocation } from '../entities/contract/contract-location'
import { ContractSchedule } from '../entities/contract/contract-schedule'
import { ContractService } from '../entities/contract/contract-service'

export interface ContractDTO {
  id: string
  userId: string
  professionalId: string
  startDate: Date
  endDate: Date
  status: 'active' | 'terminated' | 'pending'
  hourRate: number
  totalHours: number
  totalAmount: number
  shift: 'day' | 'night'
  discountPercentage: number
  minimumHoursToAvailableDiscount: number
}

export interface ContractRepository {
  // Contract methods
  findById(id: string): Promise<ContractDTO | null>
  findByUserId(userId: string): Promise<ContractDTO[]>
  findByProfessionalId(professionalId: string): Promise<ContractDTO[]>
  findAll(): Promise<ContractDTO[]>
  create(contract: Contract): Promise<void>
  update(contract: Contract): Promise<void>
  delete(id: string): Promise<void>

  // ContractLocation methods
  findLocationsByContractId(contractId: string): Promise<ContractLocation[]>
  createLocation(location: ContractLocation): Promise<void>
  updateLocation(location: ContractLocation): Promise<void>
  deleteLocation(locationId: string): Promise<void>

  // ContractSchedule methods
  findSchedulesByContractId(contractId: string): Promise<ContractSchedule[]>
  createSchedule(schedule: ContractSchedule): Promise<void>
  updateSchedule(schedule: ContractSchedule): Promise<void>
  deleteSchedule(scheduleId: string): Promise<void>

  // ContractService methods
  findServicesByContractId(contractId: string): Promise<ContractService[]>
  createService(service: ContractService): Promise<void>
  updateService(service: ContractService): Promise<void>
  deleteService(serviceId: string): Promise<void>

  // ContractDetails methods
  findDetailsByContractId(contractId: string): Promise<ContractDetails | null>
  createDetails(details: ContractDetails): Promise<void>
  updateDetails(details: ContractDetails): Promise<void>
  deleteDetails(contractId: string): Promise<void>
}
