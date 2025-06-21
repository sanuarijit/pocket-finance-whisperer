import { 
  users, expenses, debts, investments, incomes, bankBalances,
  type User, type InsertUser,
  type Expense, type InsertExpense,
  type Debt, type InsertDebt,
  type Investment, type InsertInvestment,
  type Income, type InsertIncome,
  type BankBalance, type InsertBankBalance
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Expense operations
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpenses(): Promise<Expense[]>;
  deleteExpense(id: string): Promise<void>;
  
  // Debt operations
  createDebt(debt: InsertDebt): Promise<Debt>;
  getDebts(): Promise<Debt[]>;
  updateDebt(debt: Debt): Promise<Debt>;
  deleteDebt(id: string): Promise<void>;
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getInvestments(): Promise<Investment[]>;
  updateInvestment(investment: Investment): Promise<Investment>;
  deleteInvestment(id: string): Promise<void>;
  
  // Income operations
  createIncome(income: InsertIncome): Promise<Income>;
  getIncomes(): Promise<Income[]>;
  deleteIncome(id: string): Promise<void>;
  
  // Bank Balance operations
  createBankBalance(bankBalance: InsertBankBalance): Promise<BankBalance>;
  getBankBalances(): Promise<BankBalance[]>;
  updateBankBalance(bankBalance: BankBalance): Promise<BankBalance>;
  deleteBankBalance(id: string): Promise<void>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Expense operations
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [created] = await db
      .insert(expenses)
      .values(expense)
      .returning();
    return created;
  }

  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async deleteExpense(id: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  // Debt operations
  async createDebt(debt: InsertDebt): Promise<Debt> {
    const [created] = await db
      .insert(debts)
      .values(debt)
      .returning();
    return created;
  }

  async getDebts(): Promise<Debt[]> {
    return await db.select().from(debts);
  }

  async updateDebt(debt: Debt): Promise<Debt> {
    const [updated] = await db
      .update(debts)
      .set(debt)
      .where(eq(debts.id, debt.id))
      .returning();
    return updated;
  }

  async deleteDebt(id: string): Promise<void> {
    await db.delete(debts).where(eq(debts.id, id));
  }

  // Investment operations
  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [created] = await db
      .insert(investments)
      .values(investment)
      .returning();
    return created;
  }

  async getInvestments(): Promise<Investment[]> {
    return await db.select().from(investments);
  }

  async updateInvestment(investment: Investment): Promise<Investment> {
    const [updated] = await db
      .update(investments)
      .set(investment)
      .where(eq(investments.id, investment.id))
      .returning();
    return updated;
  }

  async deleteInvestment(id: string): Promise<void> {
    await db.delete(investments).where(eq(investments.id, id));
  }

  // Income operations
  async createIncome(income: InsertIncome): Promise<Income> {
    const [created] = await db
      .insert(incomes)
      .values(income)
      .returning();
    return created;
  }

  async getIncomes(): Promise<Income[]> {
    return await db.select().from(incomes);
  }

  async deleteIncome(id: string): Promise<void> {
    await db.delete(incomes).where(eq(incomes.id, id));
  }

  // Bank Balance operations
  async createBankBalance(bankBalance: InsertBankBalance): Promise<BankBalance> {
    const [created] = await db
      .insert(bankBalances)
      .values(bankBalance)
      .returning();
    return created;
  }

  async getBankBalances(): Promise<BankBalance[]> {
    return await db.select().from(bankBalances);
  }

  async updateBankBalance(bankBalance: BankBalance): Promise<BankBalance> {
    const [updated] = await db
      .update(bankBalances)
      .set(bankBalance)
      .where(eq(bankBalances.id, bankBalance.id))
      .returning();
    return updated;
  }

  async deleteBankBalance(id: string): Promise<void> {
    await db.delete(bankBalances).where(eq(bankBalances.id, id));
  }
}

export const storage = new DatabaseStorage();
