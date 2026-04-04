import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/drizzle' // Path to your drizzle db instance
import * as schema from '../db/schema' // Path to your schema file

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

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  // Map your custom database fields to the Session
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'CLIENT', // Matches your DB default
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
})
