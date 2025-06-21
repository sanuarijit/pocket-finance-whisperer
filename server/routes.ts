import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExpenseSchema, 
  insertDebtSchema, 
  insertInvestmentSchema, 
  insertIncomeSchema, 
  insertBankBalanceSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Expense routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expense = insertExpenseSchema.parse(req.body);
      const created = await storage.createExpense(expense);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // Debt routes
  app.get("/api/debts", async (req, res) => {
    try {
      const debts = await storage.getDebts();
      res.json(debts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch debts" });
    }
  });

  app.post("/api/debts", async (req, res) => {
    try {
      const debt = insertDebtSchema.parse(req.body);
      const created = await storage.createDebt(debt);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid debt data" });
    }
  });

  app.put("/api/debts/:id", async (req, res) => {
    try {
      const debt = { ...req.body, id: req.params.id };
      const updated = await storage.updateDebt(debt);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update debt" });
    }
  });

  app.delete("/api/debts/:id", async (req, res) => {
    try {
      await storage.deleteDebt(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete debt" });
    }
  });

  // Investment routes
  app.get("/api/investments", async (req, res) => {
    try {
      const investments = await storage.getInvestments();
      res.json(investments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const investment = insertInvestmentSchema.parse(req.body);
      const created = await storage.createInvestment(investment);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid investment data" });
    }
  });

  app.put("/api/investments/:id", async (req, res) => {
    try {
      const investment = { ...req.body, id: req.params.id };
      const updated = await storage.updateInvestment(investment);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update investment" });
    }
  });

  app.delete("/api/investments/:id", async (req, res) => {
    try {
      await storage.deleteInvestment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete investment" });
    }
  });

  // Income routes
  app.get("/api/incomes", async (req, res) => {
    try {
      const incomes = await storage.getIncomes();
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch incomes" });
    }
  });

  app.post("/api/incomes", async (req, res) => {
    try {
      const income = insertIncomeSchema.parse(req.body);
      const created = await storage.createIncome(income);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid income data" });
    }
  });

  app.delete("/api/incomes/:id", async (req, res) => {
    try {
      await storage.deleteIncome(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete income" });
    }
  });

  // Bank Balance routes
  app.get("/api/bank-balances", async (req, res) => {
    try {
      const bankBalances = await storage.getBankBalances();
      res.json(bankBalances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bank balances" });
    }
  });

  app.post("/api/bank-balances", async (req, res) => {
    try {
      const bankBalance = insertBankBalanceSchema.parse(req.body);
      const created = await storage.createBankBalance(bankBalance);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid bank balance data" });
    }
  });

  app.put("/api/bank-balances/:id", async (req, res) => {
    try {
      const bankBalance = { ...req.body, id: req.params.id };
      const updated = await storage.updateBankBalance(bankBalance);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bank balance" });
    }
  });

  app.delete("/api/bank-balances/:id", async (req, res) => {
    try {
      await storage.deleteBankBalance(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bank balance" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
