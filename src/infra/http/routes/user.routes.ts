import { FastifyInstance } from 'fastify'
import { CreateUserService } from '../../../service/user/create-user.service'
import { requireAuth } from '../middlewares/auth.middleware'
import { GetUserService } from '../../../service/user/get-user.service'
import { Role } from '../../../domain/entities/role'

interface UserRoutesDeps {
  createUserService: CreateUserService
  getUserService: GetUserService
}

export async function userRoutes(app: FastifyInstance, deps: UserRoutesDeps) {
  const { createUserService, getUserService } = deps

  app.post('/users', async (request, reply) => {
    const body = request.body as { email: string }

    const user = await createUserService.execute(body.email)

    return reply.send(user)
  })

  app.get(
    '/users/me',
    {
      preHandler: requireAuth([
        Role.CLIENT,
        Role.HEALTH_PROFESSIONAL,
        Role.ADMIN,
      ]),
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
