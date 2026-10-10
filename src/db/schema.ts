import { pgTable, uuid, varchar, text, timestamp, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['OWNER', 'COURIER']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['ACTIVE', 'PAUSED', 'CANCELLED']);
export const deliveryStatusEnum = pgEnum('delivery_status', ['PENDING', 'DELIVERING', 'DELIVERED', 'CANCELLED']);

// Tabel Pengguna & Autentikasi
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('COURIER').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Pelanggan
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Langganan
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  bottlesPerDelivery: integer('bottles_per_delivery').notNull(),
  intervalDays: integer('interval_days').notNull(),
  status: subscriptionStatusEnum('status').default('ACTIVE').notNull(),
  startDate: date('start_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Jadwal & Tracking Pengantaran
export const deliveries = pgTable('deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  deliveryDate: date('delivery_date').notNull(),
  bottleCount: integer('bottle_count').notNull(),
  status: deliveryStatusEnum('status').default('PENDING').notNull(),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relasi antar tabel
export const customersRelations = relations(customers, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  customer: one(customers, {
    fields: [subscriptions.customerId],
    references: [customers.id],
  }),
  deliveries: many(deliveries),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [deliveries.subscriptionId],
    references: [subscriptions.id],
  }),
}));
