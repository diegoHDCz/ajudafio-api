import {
  UserRepository,
  UserDTO,
} from '../../domain/repositories/user.repository'

interface GetUserServiceDeps {
  userRepository: UserRepository
}

export class GetUserService {
  private deps: GetUserServiceDeps

  constructor(deps: GetUserServiceDeps) {
    this.deps = deps
  }

  async execute(userId: string): Promise<UserDTO | null> {
    return await this.deps.userRepository.findById(userId)
  }

  async executeByEmail(email: string): Promise<UserDTO | null> {
    return await this.deps.userRepository.findByEmail(email)
  }
}
