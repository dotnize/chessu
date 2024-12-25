import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// --- start better-auth schema ---
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  isAnonymous: boolean("isAnonymous"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});
// --- end better-auth schema ---

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
export type Session = typeof session.$inferSelect;
export type Game = typeof game.$inferSelect;
