import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  CreateSessionService,
  GenerateTemplateTokenService,
} from '../../../service/auth/session'

interface SessionRoutesDeps {
  createSessionService: CreateSessionService
  generateTemplateTokenService: GenerateTemplateTokenService
}

export async function sessionRoutes(
  app: FastifyInstance,
  deps: SessionRoutesDeps,
) {
  const { createSessionService, generateTemplateTokenService } = deps

  // Create session route
  app.post('/sessions', async (request, reply) => {
    const schema = z.object({
      userId: z.string().nonempty('User ID is required'),
    })
    const { userId } = schema.parse(request.body)

    try {
      const session = await createSessionService.execute(userId)
      return reply.code(201).send({ session })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return reply.code(400).send({ error: message })
    }
  })

  // Generate template token route
  app.post('/sessions/:sessionId/tokens', async (request, reply) => {
    const schema = z.object({
      template: z.string().nonempty('Template is required'),
    })
    const { template } = schema.parse(request.body)
    const { sessionId } = request.params as { sessionId: string }

    try {
      const token = await generateTemplateTokenService.execute(
        sessionId,
        template,
      )
      return reply.code(200).send({ token })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return reply.code(400).send({ error: message })
    }
  })
}
