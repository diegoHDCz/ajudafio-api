import { verifyPassword } from 'better-auth/crypto'
import { UserRepository } from '../../domain/repositories/user.repository'
import { AccountRepository } from '../../domain/repositories/account.repository'
import { UserEntity } from '../../domain/entities/user'
import { randomUUID } from 'node:crypto'
import { SessionEntity } from '../../domain/entities/session'
import { SessionRepository } from '../../domain/repositories/session.repository'

interface LoginRequest {
  email: string
  password: string
}

export class LoginService {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute({
    email,
    password,
  }: LoginRequest): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepository.findByEmail(email.toLowerCase())
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const accounts = await this.accountRepository.findByUserId(user.id)
    const credentialAccount = accounts.find(
      (acc) => acc.providerId === 'credential',
    )

    if (!credentialAccount || !credentialAccount.password) {
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await verifyPassword({
      password: password,
      hash: credentialAccount.password,
    })

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // 4. Se a senha está OK, criamos a Sessão manualmente
    const sessionToken = randomUUID() // Este é o seu "Bearer Token"
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias

    const session: SessionEntity = {
      id: randomUUID(),
      userId: user.id,
      token: sessionToken,
      expiresAt: expiresAt,
      createdAt: now,
      updatedAt: now,
      // ipAddress e userAgent você pode pegar do request na rota e passar para cá
    }

    await this.sessionRepository.save(session)

    return {
      user,
      token: sessionToken,
    }
  }
}
