import { AddressEntity } from '../../domain/entities/address'
import { AddressRepository } from '../../domain/repositories/address.repository'
import { address } from '../../infra/db/schema'

export class UpsertAddressService {
  constructor(private addressRepository: AddressRepository) {}
  async execute(data: Partial<AddressEntity>): Promise<void> {
    await this.addressRepository
      .findByUserId(data.userId!)
      .then(async (existingAddress) => {
        if (existingAddress) {
          await this.addressRepository.update(existingAddress.id, data)
        } else {
          const newAddress = new AddressEntity({
            id: data.id ?? crypto.randomUUID(),
            userId: data.userId!,
            contractId: data.contractId ?? null,
            zipCode: data.zipCode!,
            addressLine: data.addressLine!,
            number: data.number!,
            complement: data.complement ?? null,
            district: data.district!,
            city: data.city!,
            state: data.state!,
            reference: data.reference ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          await this.addressRepository.save(newAddress)
        }
      })
  }
}
