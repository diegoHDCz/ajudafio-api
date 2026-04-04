import { env } from './config/env'
import { buildServer } from './infra/http/server'

async function bootstrap() {
  const app = await buildServer()

  await app.listen({
    port: env.PORT,
    host: '0.0.0.0',
  })

  console.log(`Server running on port ${env.PORT}`)
}

bootstrap()
