import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// --- 1. BETTER AUTH REQUIRED TABLES ---

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'), // Better Auth standard
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),

  // Your Custom Fields

  identificationNumber: text('identification_number').unique(),
  identificationType: varchar('identification_type', { length: 20 }),
  role: varchar('role', { length: 20 }).notNull().default('client'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// --- 2. YOUR DOMAIN TABLES (PROFESSIONALS & CONTRACTS) ---

export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  licenseNumber: text('license_number'),
  specialty: text('specialty'),
  yearsOfExperience: integer('years_of_experience'),
  metadata: jsonb('metadata').$type<{
    services: string[]
    locations: { city: string; state: string; type: string }[]
  }>(),
})

export const availabilities = pgTable('availabilities', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(),
  startHour: varchar('start_hour', { length: 5 }).notNull(),
  endHour: varchar('end_hour', { length: 5 }).notNull(),
})

export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id),

  status: varchar('status', { length: 20 }).notNull().default('pending'),
  hourRate: integer('hour_rate').notNull(),
  totalAmount: integer('total_amount').notNull(),

  details: jsonb('details')
    .$type<{
      startDate: string
      endDate: string
      services: string[]
      schedule: { day: string; start: string; end: string }[]
      location: { city: string; state: string; address?: string }
    }>()
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// --- 3. RELATIONS ---

export const usersRelations = relations(users, ({ one, many }) => ({
  professionalProfile: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  contractsAsClient: many(contracts),
  sessions: many(sessions),
  accounts: many(accounts),
}))

export const professionalsRelations = relations(
  professionals,
  ({ one, many }) => ({
    user: one(users, {
      fields: [professionals.userId],
      references: [users.id],
    }),
    availabilities: many(availabilities),
    contracts: many(contracts),
  }),
)

export const contractsRelations = relations(contracts, ({ one }) => ({
  client: one(users, { fields: [contracts.clientId], references: [users.id] }),
  professional: one(professionals, {
    fields: [contracts.professionalId],
    references: [professionals.id],
  }),
}))
