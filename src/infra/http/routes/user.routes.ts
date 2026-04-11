import { FastifyInstance } from 'fastify'

import { requireAuth } from '../middlewares/auth.middleware'
import { Role } from '../../../domain/entities/role'
import { DrizzleUserRepository } from '../../repositories/user.repository.impl'
import { GetUserService } from '../../../service/user/get-user.service'

export async function userRoutes(app: FastifyInstance) {
  const userRepository = new DrizzleUserRepository()
  const getUserService = new GetUserService(userRepository)

  app.get(
    '/me',
    {
      // O middleware valida o token e popula o request.user
      preHandler: [requireAuth([Role.PROFESSIONAL, Role.ADMIN, Role.CLIENT])],
    },
    async (request, reply) => {
      // 1. O email vem do que o middleware injetou
      const email = request.user?.email

      if (!email) {
        return reply
          .code(401)
          .send({ error: 'User email not found in session' })
      }

      // 2. Busca no seu serviço de domínio
      const user = await getUserService.executeByEmail(email)

      if (!user) {
        return reply.code(404).send({ error: 'User not found in database' })
      }

      return reply.send(user)
    },
  )
}

