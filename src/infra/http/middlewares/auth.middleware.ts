import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '@clerk/backend'
import { Role } from '../../../domain/entities/role'

export interface AuthenticatedUser {
  id: string
  role: Role
  email?: string
  fullName?: string
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

      if (!payload.email) {
        return reply.code(400).send({ error: 'Token missing email' })
      }

      // Extrair o papel diretamente do token JWT
      const metadata = payload.metadata as { role?: string }
      if (!metadata?.role) {
        return reply.code(400).send({ error: 'Token missing role in metadata' })
      }

      let role: Role
      try {
        role = Role.create(metadata.role)
      } catch (error) {
        return reply.code(400).send({ error: 'Invalid role in token' })
      }

      if (allowedRoles && !allowedRoles.includes(role)) {
        return reply.code(403).send({ error: 'Forbidden' })
      }

      request.user = {
        id: payload.sub,
        role,
        email: payload.email as string,
        fullName: payload.full_name as string,
      }
    } catch (err) {
      console.error('Authentication error:', err)
      return reply.code(401).send({ error: 'Invalid token' })
    }
  }
}
