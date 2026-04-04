import { FastifyInstance } from 'fastify'

import { requireAuth } from '../middlewares/auth.middleware'
import { GetUserService } from '../../../service/user/get-user.service'
import { Role } from '../../../domain/entities/role'

interface UserRoutesDeps {
  getUserService: GetUserService
}

export async function userRoutes(app: FastifyInstance, deps: UserRoutesDeps) {
  const { getUserService } = deps

  app.get(
    '/users/me',
    {
      preHandler: requireAuth([Role.CLIENT, Role.PROFESSIONAL, Role.ADMIN]),
    },
    async (request, reply) => {
      const user = request.user

      if (!user) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
      return reply.send(user)
    },
  )
}
