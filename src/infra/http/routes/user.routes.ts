import { FastifyInstance } from 'fastify'

import { requireAuth } from '../middlewares/auth.middleware'
import { Role } from '../../../domain/entities/role'
import { DrizzleUserRepository } from '../../repositories/user.repository.impl'
import { GetUserService } from '../../../service/user/get-user.service'
import { DrizzleUpdateUserService } from '../../../service/user/update-user.service'
import z from 'zod'

export async function userRoutes(app: FastifyInstance) {
  const userRepository = new DrizzleUserRepository()
  const getUserService = new GetUserService(userRepository)
  const updateUserService = new DrizzleUpdateUserService(userRepository)

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

  app.put(
    '/update',
    { preHandler: [requireAuth([Role.PROFESSIONAL, Role.ADMIN, Role.CLIENT])] },
    async (request, reply) => {
      const userId = request.user?.id

      const UpdateUserDTOSchema = z.object({
        nomeCompleto: z.string(),
        role: z.enum([Role.PROFESSIONAL, Role.ADMIN, Role.CLIENT]).optional(),
        telefone: z.string(),
        telefoneWhatsapp: z.boolean(),
        telefoneSecundario: z.string().nullable().optional(),
        telefoneSecundarioWhatsapp: z.boolean(),
        linkedin: z.string().nullable().optional(),
        instagram: z.string().nullable().optional(),
        facebook: z.string().nullable().optional(),
      })

      const data = UpdateUserDTOSchema.parse(request.body)

      const updatedUser = await updateUserService.execute(userId!, {
        nomeCompleto: data.nomeCompleto,
        role: data.role,
        telefone: data.telefone,
        telefoneWhatsapp: data.telefoneWhatsapp,
        telefoneSecundario: data.telefoneSecundario,
        telefoneSecundarioWhatsapp: data.telefoneSecundarioWhatsapp,
        linkedin: data.linkedin,
        instagram: data.instagram,
        facebook: data.facebook,
      })

      return reply.send(updatedUser)
    },
  )
}
