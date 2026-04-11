import { Address } from '../../infra/repositories/address.repository.impl'

export class AddressEntity {
  public id: string
  public userId: string | null
  public contractId: string | null
  public zipCode: string
  public addressLine: string
  public number: string
  public complement: string | null
  public district: string
  public city: string
  public state: string
  public reference: string | null
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Address) {
    this.id = props.id
    this.userId = props.userId
    this.contractId = props.contractId
    this.zipCode = props.zipCode
    this.addressLine = props.addressLine
    this.number = props.number

    // Tratando null do banco para undefined da entidade
    this.complement = props.complement ?? null
    this.reference = props.reference ?? null

    this.district = props.district
    this.city = props.city
    this.state = props.state
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
