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
    username: string,
  ): Promise<UserDTO> {
    // Create user in Clerk
    const clerkUser = await this.clerk.users.createUser({
      emailAddress: [email],
      username: username,
      password,
      publicMetadata: {
        role: Role.CLIENT,
      },
    })

    const user = User.create(email, clerkUser.id, username)
    await this.deps.userRepository.create(user)

    const createdUser = await this.deps.userRepository.findByEmail(email)
    if (!createdUser) {
      this.clerk.users.deleteUser(clerkUser.id)
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
