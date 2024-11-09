import { timestamp } from 'drizzle-orm/pg-core';

const createdTimestamps = timestamp('created_at', { mode: 'string' })
  .notNull()
  .default('now()');

const updatedTimestamps = timestamp('updated_at', { mode: 'string' })
  .notNull()
  .defaultNow();

const deletedTimestamps = timestamp('deleted_at', { mode: 'string' })
  .notNull()
  .defaultNow();

export function getTableTimestamps() {
  return {
    created_at: createdTimestamps,
    updated_at: updatedTimestamps,
    deleted_at: deletedTimestamps
  };
}
