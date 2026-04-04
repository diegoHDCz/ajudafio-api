import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// 1. USUÁRIOS (A base de tudo)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  authId: text('auth_id').unique(), // Link com o Clerk
  username: text('username'),
  role: varchar('role', { length: 20 }).notNull().default('client'), // 'client' | 'professional' | 'admin'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 2. PROFISSIONAIS (Extensão do usuário)
export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  licenseNumber: text('license_number'),
  specialty: text('specialty'),
  yearsOfExperience: integer('years_of_experience'),
  // Agrupamos detalhes que mudam pouco em JSONB para facilitar a busca
  metadata: jsonb('metadata').$type<{
    services: string[]
    locations: { city: string; state: string; type: string }[]
  }>(),
})

// 3. DISPONIBILIDADE (Tabela separada para permitir buscas por filtros de horário)
export const availabilities = pgTable('availabilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id, { onDelete: 'cascade' }),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Domingo-Sábado)
  startHour: varchar('start_hour', { length: 5 }).notNull(), // "08:00"
  endHour: varchar('end_hour', { length: 5 }).notNull(), // "18:00"
})

// 4. CONTRATOS (O coração do SaaS)
export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => users.id),
  professionalId: uuid('professional_id')
    .notNull()
    .references(() => professionals.id),

  status: varchar('status', { length: 20 }).notNull().default('pending'),

  // Financeiro
  hourRate: integer('hour_rate').notNull(), // Salve sempre em centavos (Integer) para evitar erro de float
  totalAmount: integer('total_amount').notNull(),

  // O "PULO DO GATO": Detalhes do contrato congelados no tempo
  // Se o profissional mudar o preço ou serviço amanhã, o contrato antigo permanece intacto
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

// --- RELATIONS (Otimizados) ---

export const usersRelations = relations(users, ({ one, many }) => ({
  professionalProfile: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  contractsAsClient: many(contracts),
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
