import { pgTable, serial, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const resumasResume = pgTable('resumas_resume', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  language: varchar('language'),
  state: varchar('state'),
  jsonResume: jsonb('json_resume'),
  createDate: timestamp('create_date'),
  writeDate: timestamp('write_date'),
})

export type Resume = typeof resumasResume.$inferSelect
export type NewResume = typeof resumasResume.$inferInsert
