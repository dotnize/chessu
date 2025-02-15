import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export * from "./auth.schema";

export const endReasonEnum = pgEnum("end_reason", [
  "checkmate",
  "resign",
  "timeout",
  "draw",
  "abandoned",
]);

// a finished chess game. ongoing games will be stored in redis or other kv store
export const game = pgTable("game", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  started_at: timestamp().notNull(),
  ended_at: timestamp().notNull().defaultNow(),
  end_reason: endReasonEnum().notNull(),
  pgn: text().notNull(),

  winner_id: text().references(() => user.id),
  white_id: text().references(() => user.id),
  black_id: text().references(() => user.id),
});

export type User = typeof user.$inferSelect;
export type Game = typeof game.$inferSelect;
