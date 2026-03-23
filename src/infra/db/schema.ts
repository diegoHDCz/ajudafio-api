import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  auth_id: text('auth_id'),
  created_at: timestamp('created_at').defaultNow(),
  username: text('username'),
  role: text('role').notNull().default('client'),
  license_number: text('license_number'),
  specialty: text('specialty'),
  years_of_experience: integer('years_of_experience'),
})

export const professional_locations = pgTable('professional_locations', {
  id: uuid('id').primaryKey(),
  professional_id: uuid('professional_id').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  type: text('type').notNull(),
})

export const professional_services = pgTable('professional_services', {
  id: uuid('id').primaryKey(),
  professional_id: uuid('professional_id').notNull(),
  service_type: text('service_type').notNull(),
})

export const professional_availabilities = pgTable(
  'professional_availabilities',
  {
    id: uuid('id').primaryKey(),
    professional_id: uuid('professional_id').notNull(),
    day_of_week: text('day_of_week').notNull(),
    start_hour: text('start_hour').notNull(),
    end_hour: text('end_hour').notNull(),
    shift: text('shift').notNull(),
  },
)

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey(),
  user_id: uuid('user_id').notNull(),
  professional_id: uuid('professional_id').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  status: text('status').notNull().default('pending'),
  hour_rate: integer('hour_rate').notNull(),
  total_hours: integer('total_hours').notNull(),
  total_amount: integer('total_amount').notNull(),
  shift: text('shift').notNull(),
  discount_percentage: integer('discount_percentage').notNull().default(0),
  minimum_hours_to_available_discount: integer(
    'minimum_hours_to_available_discount',
  )
    .notNull()
    .default(0),
})

export const contract_locations = pgTable('contract_locations', {
  id: uuid('id').primaryKey(),
  contract_id: uuid('contract_id').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  type: text('type').notNull(),
})

export const contract_details = pgTable('contract_details', {
  id: uuid('id').primaryKey(),
  contract_id: uuid('contract_id').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  attends_at_home: boolean('attends_at_home').notNull().default(false),
  attends_hospital: boolean('attends_hospital').notNull().default(false),
  attends_nursing_home: boolean('attends_nursing_home')
    .notNull()
    .default(false),
  scheduled_days: text('scheduled_days')
    .array()
    .notNull()
    .default(sql`'{}'`),
  start_hour: text('start_hour').notNull(),
  end_hour: text('end_hour').notNull(),
})

export const contract_schedules = pgTable('contract_schedules', {
  id: uuid('id').primaryKey(),
  contract_id: uuid('contract_id').notNull(),
  day_of_week: text('day_of_week').notNull(),
  start_hour: text('start_hour').notNull(),
  end_hour: text('end_hour').notNull(),
})

export const contract_services = pgTable('contract_services', {
  id: uuid('id').primaryKey(),
  contract_id: uuid('contract_id').notNull(),
  service_type: text('service_type').notNull(),
})

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey(),
  contract_id: uuid('contract_id').notNull(),
  professional_id: uuid('professional_id').notNull(),
  status: text('status').notNull().default('pending'),
})
