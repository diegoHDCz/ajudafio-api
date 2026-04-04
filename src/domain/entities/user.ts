import { randomUUID } from 'node:crypto'
import { Role } from './role'
import { DocumentationTypeEnum } from './documentation-type.enum'

export interface UserProps {
  id: string
  email: string
  authId: string | null
  createdAt: Date | null
  role: Role
  username: string | null
  fullName: string | null
  identificationNumber?: string | null
  identificationType?: DocumentationTypeEnum | null
}

export class User {
  public id: string
  public email: string
  public authId: string | null
  public createdAt: Date | null
  public role: Role
  public username: string | null
  public fullName: string | null
  public identificationNumber: string | null
  public identificationType: DocumentationTypeEnum | null

  constructor(props: UserProps) {
    this.id = props.id
    this.email = props.email
    this.authId = props.authId
    this.createdAt = props.createdAt
    this.role = props.role ?? Role.CLIENT
    this.username = props.username ?? null
    this.fullName = props.fullName ?? null
    this.identificationNumber = props.identificationNumber ?? null
    this.identificationType = props.identificationType ?? null
  }

  static create(
    email: string,
    auth_id: string | null = null,
    fullName: string | null = null,
    username: string | null = null,
  ) {
    // Agora não importa a ordem, pois você usa chaves (keys)
    return new User({
      id: randomUUID(),
      email: email,
      authId: auth_id,
      createdAt: new Date(),
      role: Role.CLIENT,
      username: username,
      fullName: fullName,
    })
  }

  static getEmailPrefixWithFullTimestamp(email: string): string {
    const [localPart] = email.split('@')

    if (!localPart) {
      throw new Error('E-mail fornecido é inválido ou está vazio')
    }

    const timestamp = new Date().toISOString()

    const numbersOnlyTimestamp = timestamp.replace(/\D/g, '')

    return `${localPart}${numbersOnlyTimestamp}`
  }

  static getFirstAndLastName(fullName: string): {
    firstName: string

    lastName: string
  } {
    const nameParts = fullName.trim().split(' ')

    const firstName = nameParts[0]

    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    return { firstName, lastName }
  }
}
