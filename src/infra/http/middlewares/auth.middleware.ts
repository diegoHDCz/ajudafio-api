import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '@clerk/backend'
import { GetUserService } from '../../../service/user/get-user.service'
import { UserRepositoryImpl } from '../../repositories/user.repository.impl'
import { Role } from '../../../domain/entities/role'

export interface AuthenticatedUser {
  id: string
  role: Role
  email?: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser
  }
}

export function requireAuth(allowedRoles?: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization

      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing token' })
      }

      const token = authHeader.replace('Bearer ', '')

      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        issuer: process.env.CLERK_ISSUER!,
      })

      const userRepo = new UserRepositoryImpl()
      const role: Role = await userRepo
        .findByEmail(payload.email as string)
        ?.then((user) => {
          if (!user) {
            throw new Error('User not found')
          }
          return user.role
        })

      request.user = {
        id: payload.sub,
        role: ,
        email: payload.email as string | undefined,
      }

      if (allowedRoles && !allowedRoles.includes(role)) {
        return reply
          .code(403)
          .send({ error: 'Forbidden: Insufficient permissions' })
      }
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' })
    }
  }
}
