import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import { authRoutes } from './routes/auth.routes'
import { healthRoutes } from './routes/health.routes'
import { loggerConfig } from '../utils/logger'
import { userRoutes } from './routes/user.routes'

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

  // 3. REGISTRO CORRETO DAS ROTAS
  // Use o .register para o Fastify gerenciar o encapsulamento
  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(healthRoutes, { prefix: '/api/health' })
  await app.register(userRoutes, { prefix: '/api/users' })

  return app
}
