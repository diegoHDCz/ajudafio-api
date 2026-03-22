import { ClerkRepository } from '../../../infra/repositories/clerk.repository'

export class CreateSessionService {
  constructor(private clerkRepository: ClerkRepository) {}

  /**
   * Creates a new session for the given user ID.
   * @param userId - The ID of the user to create a session for.
   * @returns The created session.
   * @throws Error if userId is invalid or in production environment.
   */
  async execute(userId: string) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid userId: must be a non-empty string')
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Creating sessions manually is not allowed in production')
    }

    try {
      return await this.clerkRepository.createSession({ userId })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to create session: ${message}`)
    }
  }
}
