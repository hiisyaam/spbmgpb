import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  lives: integer('lives').default(5),
  streak: integer('streak').default(0),
  level: text('level').default('Algorithm Novice'),
});

export const progress = sqliteTable('progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').references(() => users.id),
  algorithm: text('algorithm').notNull(), // 'bubble_sort', 'selection_sort'
  levelReached: integer('levelReached').default(1),
  completionPercentage: integer('completionPercentage').default(0),
  stars: integer('stars').default(0),
});
