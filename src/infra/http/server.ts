import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import { authRoutes } from './routes/auth.routes'
import { healthRoutes } from './routes/health.routes'
import { loggerConfig } from '../utils/logger'
import { userRoutes } from './routes/user.routes'
import { professionalRoutes } from './routes/professional.routes'
import { DrizzleUserRepository } from '../repositories/user.repository.impl'
import { DrizzleAccountRepository } from '../repositories/account.repository.impl'
import { DrizzleSessionRepository } from '../repositories/session.repository.impl'
import { DrizzleProfessionalRepository } from '../repositories/professional.repository.impl'
import { DrizzleAddressRepository } from '../repositories/address.repository.impl'
import { RegisterService } from '../../service/auth/register.service'
import { LoginService } from '../../service/auth/login.service'
import { GetUserService } from '../../service/user/get-user.service'
import { DrizzleUpdateUserService } from '../../service/user/update-user.service'
import { UpsertAddressService } from '../../service/address/upsert-address.service'
import { CreateProfessionalService } from '../../service/professional/create-professional.service'
import { ListProfessionalsService } from '../../service/professional/list-professionals.service'

export async function buildServer() {
  const app = Fastify({
    logger: loggerConfig,
  })

  // 1. CORS deve vir primeiro
  await app.register(cors, {
    origin: true,
    credentials: true, // ESSENCIAL para o Better Auth aceitar cookies do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // 2. COOKIE deve vir antes das rotas
  await app.register(fastifyCookie, {
    // Se process.env.COOKIE_SECRET sumir, o Better Auth ainda usa o secret dele,
    // mas é bom ter esse aqui para outros cookies seus.
    secret: process.env.COOKIE_SECRET || process.env.BETTER_AUTH_SECRET,
    parseOptions: {},
  })

  const userRepository = new DrizzleUserRepository()
  const accountRepository = new DrizzleAccountRepository()
  const sessionRepository = new DrizzleSessionRepository()
  const professionalRepository = new DrizzleProfessionalRepository()
  const addressRepository = new DrizzleAddressRepository()

  const registerService = new RegisterService(userRepository, accountRepository)
  const loginService = new LoginService(
    userRepository,
    accountRepository,
    sessionRepository,
  )

  const getUserService = new GetUserService(userRepository)
  const updateUserService = new DrizzleUpdateUserService(userRepository)

  const listProfessionalsService = new ListProfessionalsService(
    professionalRepository,
  )
  const upsertAddressService = new UpsertAddressService(addressRepository)
  const createProfessionalService = new CreateProfessionalService(
    professionalRepository,
    updateUserService,
    upsertAddressService,
  )

  await app.register(authRoutes({ registerService, loginService }), {
    prefix: '/api/auth',
  })
  await app.register(healthRoutes, { prefix: '/api/health' })
  await app.register(userRoutes({ getUserService, updateUserService }), {
    prefix: '/api/users',
  })
  await app.register(
    professionalRoutes({ createProfessionalService, listProfessionalsService }),
    {
      prefix: '/api/professionals',
    },
  )

  return app
}
