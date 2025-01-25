import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export * from "./auth.schema";
// export your other schemas here

export const endReasonEnum = pgEnum("end_reason", [
  "checkmate",
  "resign",
  "timeout",
  "draw",
  "abandoned",
]);
export const winnerEnum = pgEnum("winner", ["white", "black"]);

// a finished chess game. ongoing games will be stored in redis
export const game = pgTable("game", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  started_at: timestamp().notNull(),
  ended_at: timestamp().notNull().defaultNow(),
  end_reason: endReasonEnum().notNull(),
  pgn: text().notNull(),

  winner: winnerEnum(),
  winner_id: text().references(() => user.id),
  white_id: text().references(() => user.id),
  black_id: text().references(() => user.id),

  // in case user is a guest
  winner_name: text(),
  white_name: text(),
  black_name: text(),
});

export type User = typeof user.$inferSelect;
export type Game = typeof game.$inferSelect;
