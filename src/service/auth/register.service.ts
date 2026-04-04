import { Clerk } from '@clerk/clerk-sdk-node'
import {
  UserRepository,
  UserDTO,
} from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'
import { env } from '../../config/env'
import { Role } from '../../domain/entities/role'

interface AuthServiceDeps {
  userRepository: UserRepository
}

export class AuthService {
  private deps: AuthServiceDeps
  private clerk: ReturnType<typeof Clerk>

  constructor(deps: AuthServiceDeps) {
    this.deps = deps
    this.clerk = Clerk({
      secretKey: env.CLERK_SECRET_KEY!,
    })
  }

  async createUser(
    email: string,
    password: string,
    full_name: string,
  ): Promise<UserDTO> {
    const username = User.getEmailPrefixWithFullTimestamp(email)
    const { firstName, lastName } = User.getFirstAndLastName(full_name)
    const { id } = await this.clerk.users.createUser({
      emailAddress: [email],
      username: username,
      firstName: firstName,
      lastName: lastName,
      password,
      publicMetadata: {
        role: Role.CLIENT,
      },
    })

    const user = User.create(email, id, full_name, username)
    await this.deps.userRepository.create(user)

    const createdUser = await this.deps.userRepository.findByEmail(email)
    if (!createdUser) {
      this.clerk.users.deleteUser(id)
      throw new Error('Failed to create user')
    }
    return createdUser
  }

  async getUserById(userId: string): Promise<UserDTO | null> {
    return await this.deps.userRepository.findById(userId)
  }

  async getUserByEmail(email: string): Promise<UserDTO | null> {
    return await this.deps.userRepository.findByEmail(email)
  }
}
