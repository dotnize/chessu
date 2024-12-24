import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text().unique(),
  name: text(),
  // first_name: text(),
  // last_name: text(),
  avatar_url: text(),
  email: text().unique().notNull(),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  setup_at: timestamp(),
  terms_accepted_at: timestamp(),

  wins: integer().default(0).notNull(),
  losses: integer().default(0).notNull(),
  draws: integer().default(0).notNull(),
  // rating/elo?
});

export const oauthAccount = pgTable(
  "oauth_account",
  {
    provider_id: text().notNull(),
    provider_user_id: text().notNull(),
    user_id: integer()
      .notNull()
      .references(() => user.id),
  },
  (table) => [primaryKey({ columns: [table.provider_id, table.provider_user_id] })],
);

export const session = pgTable("session", {
  id: text().primaryKey(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  expires_at: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const endReasonEnum = pgEnum("end_reason", [
  "checkmate",
  "resign",
  "timeout",
  "draw",
  "abandoned",
]);

// a finished chess game. ongoing games will be stored in redis
export const game = pgTable("game", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  started_at: timestamp().notNull(),
  ended_at: timestamp().notNull().defaultNow(),
  end_reason: endReasonEnum().notNull(),
  pgn: text().notNull(),

  winner_id: integer().references(() => user.id),
  white_id: integer().references(() => user.id),
  black_id: integer().references(() => user.id),

  // in case user is a guest
  winner_name: text(),
  white_name: text(),
  black_name: text(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Game = typeof game.$inferSelect;
