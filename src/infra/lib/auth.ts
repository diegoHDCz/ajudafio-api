import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/drizzle' // Path to your drizzle db instance
import * as schema from '../db/schema' // Path to your schema file
import { bearer } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // PostgreSQL
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  plugins: [bearer()],

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  // Map your custom database fields to the Session
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'CLIENT',
        required: true,
      },
      name: { type: 'string' },
      identificationNumber: { type: 'string' },
      identificationType: { type: 'string' },
    },
  },

  // Session Configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  advanced: {
    // 1. DESABILITA A CHECAGEM DE CSRF (O que mata chamadas de fora do browser)
    disableCSRFCheck: true,

    // 2. DESABILITA A VALIDAÇÃO RIGOROSA DE ORIGEM (Libera VS Code/Postman)
    disableOriginCheck: true,

    // 3. SE PRECISAR USAR IP EM LOCALHOST (Evita erro de tracking)
    ipAddress: {
      disableIpTracking: true,
    },
    useCookieToStoredSession: false,
  },
  trustedOrigins: ['http://localhost:3000'],
})
