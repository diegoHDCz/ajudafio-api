import Fastify from 'fastify'

import { userRoutes } from './routes/user.routes'
import { authRoutes } from './routes/auth.routes'
import { UserRepositoryImpl } from '../repositories/user.repository.impl'
import { CreateUserService } from '../../service/user/create-user.service'
import { AuthService } from '../../service/auth/register.service'
import { healthRoutes } from './routes/health.routes'
import { GetUserService } from '../../service/user/get-user.service'
import { LoginService } from '../../service/auth/login.service'
import { sessionRoutes } from './routes/session.routes'
import { ClerkRepository } from '../repositories/clerk.repository'
import {
  CreateSessionService,
  GenerateTemplateTokenService,
} from '../../service/auth/session'

export function buildServer() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  const userRepository = new UserRepositoryImpl()
  const createUserService = new CreateUserService({ userRepository })
  const getUserService = new GetUserService({ userRepository })
  const authService = new AuthService({ userRepository })
  const loginService = new LoginService({ getUserService })
  const clerkRepository = new ClerkRepository()
  const createSessionService = new CreateSessionService(clerkRepository)
  const generateTemplateTokenService = new GenerateTemplateTokenService(
    clerkRepository,
  )

  userRoutes(app, {
    createUserService,
    getUserService,
  })

  authRoutes(app, {
    authService,
    loginService,
  })

  sessionRoutes(app, {
    createSessionService,
    generateTemplateTokenService,
  })

  app.register(healthRoutes)

  return app
}
