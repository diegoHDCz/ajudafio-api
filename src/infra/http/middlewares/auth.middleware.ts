import { FastifyRequest, FastifyReply } from 'fastify'
import { auth } from '../../lib/auth' // Import your Better Auth instance
import { fromNodeHeaders } from 'better-auth/node'
import { Role } from '../../../domain/entities/role'

export interface AuthenticatedUser {
  id: string
  role: Role
  email?: string
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
      // 1. Retrieve the session using Better Auth's API
      // It automatically handles Session Cookies or Bearer Tokens
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      })

      // 2. If no session, return 401
      if (!session) {
        return reply
          .code(401)
          .send({ error: 'Unauthorized: No active session' })
      }

      const { user } = session


      let role: Role
      try {
        role = Role.create(user.role as string)
      } catch (error) {
        return reply.code(400).send({ error: 'Invalid role assigned to user' })
      }

      // 4. RBAC Check (Role-Based Access Control)
      if (allowedRoles && !allowedRoles.includes(role)) {
        return reply
          .code(403)
          .send({ error: 'Forbidden: Insufficient permissions' })
      }

      // 5. Populate request.user with our domain-specific types
      request.user = {
        id: user.id,
        role,
        email: user.email,
        name: user.name || undefined, // Better Auth uses 'name' by default
      }
    } catch (err) {
      console.error('Authentication error:', err)
      return reply
        .code(500)
        .send({ error: 'Internal server error during authentication' })
    }
  }
}
