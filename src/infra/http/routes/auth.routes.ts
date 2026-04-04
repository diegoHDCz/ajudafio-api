import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { DrizzleUserRepository } from '../../repositories/user.repository.impl'
import { DrizzleAccountRepository } from '../../repositories/account.repository.impl'
import { RegisterService } from '../../../service/auth/register.service'
import { DrizzleSessionRepository } from '../../repositories/session.repository.impl'
import { LoginService } from '../../../service/auth/login.service'

export async function authRoutes(app: FastifyInstance) {
  const userRepository = new DrizzleUserRepository()
  const accountRepository = new DrizzleAccountRepository()
  const sessionRepository = new DrizzleSessionRepository()
  const registerService = new RegisterService(userRepository, accountRepository)
  const loginService = new LoginService(
    userRepository,
    accountRepository,
    sessionRepository,
  )

  // Sign up route - public
  app.post('/signup', async (request, reply) => {
    const registerSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const data = registerSchema.parse(request.body)

      const user = await registerService.execute(data)

      return reply.code(201).send({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Dados inválidos',
          details: error.message,
        })
      }

      if (error instanceof Error && error.message === 'User already exists') {
        return reply.code(409).send({ error: 'Este e-mail já está em uso' })
      }

      app.log.error(error)
      return reply.code(500).send({ error: 'Erro interno no servidor' })
    }
  })

  app.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as any
      const { user, session } = await loginService.execute({ email, password })

      reply.setCookie('session_token', session.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: session.expiresAt,
      })

      return reply.send({
        user: { id: user.id, email: user.email, name: user.name },
        token: session.token,
        expiresAt: session.expiresAt,
      })
    } catch (err) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
  })
}
