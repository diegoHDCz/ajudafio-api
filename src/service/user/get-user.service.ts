import { UserEntity } from '../../domain/entities/user'
import { UserRepository } from '../../domain/repositories/user.repository'

export class GetUserService {
  constructor(private userRepository: UserRepository) {}

  async executeByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email)
  }
}
