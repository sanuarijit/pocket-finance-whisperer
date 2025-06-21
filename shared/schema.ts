import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // 'fixed' | 'variable' | 'discretionary'
  createdAt: timestamp("created_at").defaultNow(),
});

export const debts = pgTable("debts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  principal: real("principal").notNull(),
  currentBalance: real("current_balance").notNull(),
  emi: real("emi").notNull(),
  interestRate: real("interest_rate").notNull(),
  tenure: integer("tenure").notNull(),
  remainingMonths: integer("remaining_months").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  currentValue: real("current_value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incomes = pgTable("incomes", {
  id: text("id").primaryKey(),
  amount: real("amount").notNull(),
  source: text("source").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // 'salary' | 'freelance' | 'business' | 'investment' | 'other'
  createdAt: timestamp("created_at").defaultNow(),
});

export const bankBalances = pgTable("bank_balances", {
  id: text("id").primaryKey(),
  bankName: text("bank_name").notNull(),
  accountType: text("account_type").notNull(), // 'savings' | 'current' | 'fd' | 'other'
  balance: real("balance").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  createdAt: true,
});

export const insertDebtSchema = createInsertSchema(debts).omit({
  createdAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  createdAt: true,
});

export const insertIncomeSchema = createInsertSchema(incomes).omit({
  createdAt: true,
});

export const insertBankBalanceSchema = createInsertSchema(bankBalances).omit({
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Debt = typeof debts.$inferSelect;
export type InsertDebt = z.infer<typeof insertDebtSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Income = typeof incomes.$inferSelect;
export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type BankBalance = typeof bankBalances.$inferSelect;
export type InsertBankBalance = z.infer<typeof insertBankBalanceSchema>;
