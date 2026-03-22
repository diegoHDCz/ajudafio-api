import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  auth_id: text('auth_id'),
  createdAt: timestamp('created_at').defaultNow(),
  username: text('username'),
  role: text('role').notNull().default('client'),
  licenseNumber: text('license_number'),
  specialty: text('specialty'),
  yearsOfExperience: integer('years_of_experience'),
})
