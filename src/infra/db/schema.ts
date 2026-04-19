import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  jsonb,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { pgEnum } from 'drizzle-orm/pg-core'

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
])

export const shiftEnum = pgEnum('shift', [
  'MORNING',
  'AFTERNOON',
  'NIGHT',
  'FULL_DAY',
])

// --- 1. TABELAS DE AUTENTICAÇÃO (BETTER AUTH) ---

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  telephone: text('telephone'),
  telephonWhatsapp: boolean('telephone_whatsapp').notNull().default(false),
  secondTelephone: text('second_telephone'),
  secondTelephonWhatsapp: boolean('second_telephone_whatsapp')
    .notNull()
    .default(false),
  linkedin: text('linkedin'),
  instagram: text('instagram'),
  facebook: text('facebook'),
  identificationNumber: text('identification_number').unique(),
  identificationType: varchar('identification_type', { length: 20 }),
  role: varchar('role', { length: 20 }).notNull().default('CLIENT'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
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
  id: uuid('id').defaultRandom().primaryKey(),
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
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// --- 2. TABELAS DE DOMÍNIO (PROFISSIONAIS, CONTRATOS, REVIEWS) ---

export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  licenseNumber: text('license_number'),
  category: text('category').notNull(),
  yearsOfExperience: integer('years_of_experience'),
  verified: boolean('verified').notNull().default(false),
  resume: text('resume'),
  metadata: jsonb('metadata').$type<{
    services: string[]
    locations: { city: string; state: string; type: string }[]
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const availabilities = pgTable('availabilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id, { onDelete: 'cascade' }),

  dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),

  // Modo turno
  shift: shiftEnum('shift'),

  // Modo horário livre (HH:MM) — usado quando shift é null
  startHour: varchar('start_hour', { length: 5 }),
  endHour: varchar('end_hour', { length: 5 }),
})

export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id),

  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
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

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    professionalId: uuid('professional_id')
      .notNull()
      .references(() => professionals.id, { onDelete: 'cascade' }),
    contractId: uuid('contract_id').references(() => contracts.id, {
      onDelete: 'set null',
    }),

    rating: integer('rating').notNull(), // Sugestão: validar 1-5 na aplicação
    comment: text('comment'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Garante que um contrato só tenha um review (opcional, mas recomendado)
    uniqueContractReview: uniqueIndex('unique_contract_review').on(
      table.contractId,
    ),
  }),
)

export const address = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  contractId: uuid('contract_id').references(() => contracts.id, {
    onDelete: 'cascade',
  }),

  zipCode: text('zip_code').notNull(),
  addressLine: text('address_line').notNull(),
  number: text('number').notNull(),
  complement: text('complement'),
  district: text('district').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  reference: text('reference'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// --- 3. RELATIONS ---

export const usersRelations = relations(users, ({ one, many }) => ({
  professionalProfile: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  address: one(address, {
    fields: [users.id],
    references: [address.userId],
  }),
  contractsAsClient: many(contracts),
  sessions: many(sessions),
  accounts: many(accounts),
  reviewsMade: many(reviews),
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
    reviews: many(reviews),
  }),
)

export const contractsRelations = relations(contracts, ({ one }) => ({
  client: one(users, { fields: [contracts.clientId], references: [users.id] }),
  professional: one(professionals, {
    fields: [contracts.professionalId],
    references: [professionals.id],
  }),
  review: one(reviews, {
    fields: [contracts.id],
    references: [reviews.contractId],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  client: one(users, { fields: [reviews.clientId], references: [users.id] }),
  professional: one(professionals, {
    fields: [reviews.professionalId],
    references: [professionals.id],
  }),
  contract: one(contracts, {
    fields: [reviews.contractId],
    references: [contracts.id],
  }),
}))

export const addressesRelations = relations(address, ({ one }) => ({
  user: one(users, {
    fields: [address.userId],
    references: [users.id],
  }),
  contract: one(contracts, {
    fields: [address.contractId],
    references: [contracts.id],
  }),
}))

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  professional: one(professionals, {
    fields: [availabilities.professionalId],
    references: [professionals.id],
  }),
}))
