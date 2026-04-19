import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { RegisterService } from '../../../service/auth/register.service'
import { LoginService } from '../../../service/auth/login.service'
import { request } from 'node:http'
import { validateAuth } from '../middlewares/auth.middleware'

export interface AuthRoutesDependencies {
  registerService: RegisterService
  loginService: LoginService
}

export function authRoutes(deps: AuthRoutesDependencies) {
  return async function (app: FastifyInstance) {
    const { registerService, loginService } = deps

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
        const result = await loginService.execute({ email, password })

        return reply.send({
          message: 'Login realizado com sucesso',
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
          accessToken: result.token,
        })
      } catch (err) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
    })

    app.get(
      '/validate',
      { preHandler: validateAuth() },
      async function (req, res) {
        await res.send({ message: 'Autenticação válida!' })
      },
    )
  }
}
