import { FastifyInstance } from 'fastify'
import { AuthService } from '../../../service/auth/register.service'
import { email, z } from 'zod'
import { LoginService } from '../../../service/auth/login.service'
import { log } from 'node:console'

interface AuthRoutesDeps {
  authService: AuthService
  loginService: LoginService
}

export async function authRoutes(app: FastifyInstance, deps: AuthRoutesDeps) {
  const { authService, loginService } = deps

  // Sign up route - public
  app.post('/auth/signup', async (request, reply) => {
    const schema = z.object({
      email: z.string().email().nonempty('Email is required'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .nonempty('Password is required'),
      username: z
        .string()
        .max(100, 'Username must be at most 100 characters long')
        .nonempty('Username is required'),
    })
    const { email, password, username } = schema.parse(request.body)

    try {
      const user = await authService.createUser(email, password, username)
      return reply.code(201).send({
        userId: user.id,
      })
    } catch (error) {
      return reply.code(400).send({ error: error })
    }
  })

  app.post('/auth/login', async (request, reply) => {
    const schema = z.object({
      email: z.string().email().nonempty('Email is required'),
      password: z.string().nonempty('Password is required'),
    })
    const { email, password } = schema.parse(request.body)
    try {
      
      const token = await loginService.login({ email, password })
      console.log(`Login successful for email: ${email}`)
      console.log(token)
      return reply.code(200).send(token)
    } catch (error) {
      return reply
        .code(400)
        .send({ error: error instanceof Error ? error.message : String(error) })
    }
  })
}
