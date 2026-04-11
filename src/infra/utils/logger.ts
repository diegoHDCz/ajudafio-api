import { PinoLoggerOptions } from 'fastify/types/logger'
import pino from 'pino'

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

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
}

export const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  customLevels: levels,
  useOnlyCustomLevels: true,
})
