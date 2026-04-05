import { FastifyRequest, FastifyReply } from 'fastify'
import { auth } from '../../lib/auth'
import { Role } from '../../../domain/entities/role'
import pino from 'pino'
import { loggerConfig } from '../../utils/logger'

const logger = pino(loggerConfig)

export interface AuthenticatedUser {
  id: string
  role: Role
  email: string
  name?: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser
  }
}

export function requireAuth(allowedRoles?: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Extração Manual Segura (Evita o erro de TS que tivemos antes)
      const headers = {
        authorization: request.headers.authorization || '',
        cookie: request.headers.cookie || '',
        host: request.headers.host || '',
        'x-forwarded-host':
          (request.headers['x-forwarded-host'] as string) || '',
      }

      // 2. Chamada para o Better Auth (O plugin bearer vai validar o Header aqui)
      const session = await auth.api.getSession({ headers })

      if (!session) {
        logger.warn(
          { path: request.url },
          'Tentativa de acesso não autorizado: Sessão nula',
        )
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Sessão inválida ou expirada. Faça login novamente.',
        })
      }

      const { user } = session

      // 3. Validação da Role de Domínio
      let userRole: Role
      try {
        // Garantimos que a string que vem do banco (Better Auth) é uma Role válida no seu domínio
        userRole = Role.create(user.role as string)
      } catch (error) {
        logger.error(
          { userId: user.id, role: user.role },
          'Role do usuário no banco é inválida',
        )
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Permissões corrompidas no perfil.',
        })
      }

      // 4. RBAC (Role-Based Access Control)
      if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = allowedRoles.includes(userRole)

        if (!hasPermission) {
          return reply.code(403).send({
            error: 'Forbidden',
            message: 'Seu nível de acesso não permite esta operação.',
          })
        }
      }

      // 5. Hydrate Request User
      request.user = {
        id: user.id,
        role: userRole,
        email: user.email,
        name: user.name ?? undefined,
      }
    } catch (err) {
      logger.error(err, 'Erro crítico no Middleware de Autenticação')
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  }
}
