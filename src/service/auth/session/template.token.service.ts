import { ClerkRepository } from '../../../infra/repositories/clerk.repository'

export class GenerateTemplateTokenService {
  constructor(private clerkRepository: ClerkRepository) {}

  /**
   * Generates a token using the provided session ID and template.
   * @param sessionId - The ID of the session.
   * @param template - The template to use for token generation.
   * @returns The generated token.
   * @throws Error if sessionId or template are invalid.
   */
  async execute(sessionId: string, template: string) {
    if (
      !sessionId ||
      typeof sessionId !== 'string' ||
      sessionId.trim() === ''
    ) {
      throw new Error('Invalid sessionId: must be a non-empty string')
    }

    if (!template || typeof template !== 'string' || template.trim() === '') {
      throw new Error('Invalid template: must be a non-empty string')
    }

    try {
      return await this.clerkRepository.getTokenByTemplate(sessionId, template)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to generate token: ${message}`)
    }
  }
}
