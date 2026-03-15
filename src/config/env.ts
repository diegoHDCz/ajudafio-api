import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL!,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_ISSUER: process.env.CLERK_ISSUER,
  CLERK_JWKS: process.env.CLERK_JWKS,
  CLERK_DOMAIN: process.env.CLERK_DOMAIN,
}
