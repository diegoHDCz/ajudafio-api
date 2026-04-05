
import { PinoLoggerOptions } from 'fastify/types/logger'

export const loggerConfig: PinoLoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  },
}
