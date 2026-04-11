import { address } from '../db/schema'
import { AddressEntity } from '../../domain/entities/address'
import { AddressRepository } from '../../domain/repositories/address.repository'
import { eq, InferSelectModel } from 'drizzle-orm'
import { db } from '../db/drizzle'

export type Address = InferSelectModel<typeof address>

export class DrizzleAddressRepository implements AddressRepository {
  async findByUserId(userId: string): Promise<AddressEntity | null> {
    const [row] = await db
      .select()
      .from(address)
      .where(eq(address.userId, userId))
    return row ? new AddressEntity(row) : null
  }
  async findByContractId(contractId: string): Promise<AddressEntity | null> {
    const [row] = await db
      .select()
      .from(address)
      .where(eq(address.contractId, contractId))
    return row ? new AddressEntity(row) : null
  }
  async findById(id: string): Promise<AddressEntity | null> {
    const [row] = await db.select().from(address).where(eq(address.id, id))

    return row ? new AddressEntity(row) : null
  }

  async findAll(): Promise<AddressEntity[]> {
    const rows = await db.select().from(address)
    return rows.map((row: Address) => new AddressEntity(row))
  }

  async save(data: AddressEntity): Promise<void> {
    await db.insert(address).values({
      id: data.id,
      userId: data.userId,
      contractId: data.contractId,
      zipCode: data.zipCode,
      addressLine: data.addressLine,
      number: data.number,
      complement: data.complement ?? null, // Volta para null ao salvar
      district: data.district,
      city: data.city,
      state: data.state,
      reference: data.reference ?? null, // Volta para null ao salvar
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }

  async update(
    id: string,
    data: Partial<AddressEntity>,
  ): Promise<AddressEntity> {
    const [updatedRow] = await db
      .update(address)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(address.id, id))
      .returning()

    if (!updatedRow) {
      throw new Error(`Address with id ${id} not found to update.`)
    }

    return new AddressEntity(updatedRow)
  }

  async delete(id: string): Promise<void> {
    await db.delete(address).where(eq(address.id, id))
  }
}
