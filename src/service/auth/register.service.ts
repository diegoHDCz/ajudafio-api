import { randomUUID } from 'node:crypto'
import { AccountRepository } from '../../domain/repositories/account.repository'
import { UserRepository } from '../../domain/repositories/user.repository'
import { hashPassword } from 'better-auth/crypto'
import { Role } from '../../domain/entities/role'
import { UserEntity } from '../../domain/entities/user'

interface RegisterRequest {
  name: string
  email: string
  password: string
}
export class RegisterService {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterRequest): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new Error('Email já está em uso')
    }
    const userId = randomUUID()
    const now = new Date()
  
    const user: UserEntity = {
      id: userId,
      email: email.toLowerCase(),
      name: name,
      emailVerified: false,
      role: Role.CLIENT,
      createdAt: now,
      updatedAt: now,
      telephonWhatsapp: false,
      telephone: null,
      secondTelephone: null,
      secondTelephonWhatsapp: false,
      linkedin: null,
      instagram: null,
      facebook: null,
      identificationNumber: null,
      identificationType: undefined,
      image: null,
    }

    const hashedPassword = await hashPassword(password)

    const account = {
      id: randomUUID(),
      userId: userId,
      accountId: email.toLowerCase(),
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    }

    await this.userRepository.save(user)
    await this.accountRepository.save(account as any)

    return user
  }
}
