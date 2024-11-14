import { getTableTimestamps } from '@/common/constants/table-timestamps';
import { relations } from 'drizzle-orm';
import { boolean, date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { Token } from './token-table';
import { LoginSession } from './login-session';

export const User = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar().notNull(),
  last_name: varchar().notNull(),
  email: varchar().notNull().unique(),
  gender: varchar().notNull(),
  username: varchar().notNull().unique(),
  password: varchar().notNull(),
  is_active: boolean().notNull().default(false),
  is_email_verified: boolean().notNull().default(false),
  last_login_at: date({ mode: 'string' }),
  last_login_ip: varchar(),
  needs_to_reset_password: boolean().notNull().default(false),
  last_password_reset_at: date({ mode: 'string' }),
  ...getTableTimestamps()
});

export const userRelations = relations(User, ({ many }) => ({
  tokens: many(Token),
  login_sessions: many(LoginSession)
}));