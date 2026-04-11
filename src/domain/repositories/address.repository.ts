import { AddressEntity } from '../entities/address'

export interface AddressRepository {
  findById(id: string): Promise<AddressEntity | null>
  findAll(): Promise<AddressEntity[]>
  save(address: AddressEntity): Promise<void>
  update(id: string, data: Partial<AddressEntity>): Promise<AddressEntity>
  delete(id: string): Promise<void>
  findByUserId(userId: string): Promise<AddressEntity | null>
  findByContractId(contractId: string): Promise<AddressEntity | null>
}
