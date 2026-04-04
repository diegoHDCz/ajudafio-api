import { env } from './config/env'
import { buildServer } from './infra/http/server'
import { clerkPlugin } from '@clerk/fastify'

async function bootstrap() {
  const app = await buildServer()
  app.register(clerkPlugin, {
    publishableKey: env.CLERK_PUBLISHABLE_KEY!,
    secretKey: env.CLERK_SECRET_KEY!,
  })
  await app.listen({
    port: env.PORT,
    host: '0.0.0.0',
  })

  console.log(`Server running on port ${env.PORT}`)
}

bootstrap()
