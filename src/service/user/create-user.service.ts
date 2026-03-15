import { randomUUID } from "crypto"
import { User } from "../../domain/entities/user"
import { UserRepository, UserDTO } from "../../domain/repositories/user.repository"

interface CreateUserServiceDeps {
  userRepository: UserRepository
}

export class CreateUserService {

  constructor(private deps: CreateUserServiceDeps) {}

  async execute(email: string): Promise<UserDTO> {

    const user = User.create(email)
    await this.deps.userRepository.create(user)

    // Return DTO by fetching from repo
    const createdUser = await this.deps.userRepository.findByEmail(email)
    if (!createdUser) throw new Error('Failed to create user')
    return createdUser
  }
}