
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'fixed' | 'variable' | 'discretionary';
  created_at?: string;
}

export interface Debt {
  id: string;
  name: string;
  principal: number;
  currentBalance: number;
  emi: number;
  interestRate: number;
  tenure: number;
  remainingMonths: number;
  created_at?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  created_at?: string;
}

class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing database...');
      
      // Create or open database
      this.db = await this.sqlite.createConnection(
        'moneywise.db',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();

      // Create tables
      await this.createTables();
      
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createDebtsTable = `
      CREATE TABLE IF NOT EXISTS debts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        principal REAL NOT NULL,
        currentBalance REAL NOT NULL,
        emi REAL NOT NULL,
        interestRate REAL NOT NULL,
        tenure INTEGER NOT NULL,
        remainingMonths INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createInvestmentsTable = `
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        currentValue REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createSettingsTable = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.db.execute(createExpensesTable);
    await this.db.execute(createDebtsTable);
    await this.db.execute(createInvestmentsTable);
    await this.db.execute(createSettingsTable);

    console.log('Database tables created successfully');
  }

  // Expense operations
  async addExpense(expense: Omit<Expense, 'created_at'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO expenses (id, amount, category, description, date, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await this.db.run(query, [
      expense.id,
      expense.amount,
      expense.category,
      expense.description,
      expense.date,
      expense.type
    ]);
  }

  async getExpenses(): Promise<Expense[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
    return result.values || [];
  }

  async deleteExpense(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  // Debt operations
  async addDebt(debt: Omit<Debt, 'created_at'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO debts (id, name, principal, currentBalance, emi, interestRate, tenure, remainingMonths)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.run(query, [
      debt.id,
      debt.name,
      debt.principal,
      debt.currentBalance,
      debt.emi,
      debt.interestRate,
      debt.tenure,
      debt.remainingMonths
    ]);
  }

  async getDebts(): Promise<Debt[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT * FROM debts ORDER BY created_at DESC');
    return result.values || [];
  }

  async updateDebt(debt: Debt): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      UPDATE debts SET 
        name = ?, principal = ?, currentBalance = ?, emi = ?, 
        interestRate = ?, tenure = ?, remainingMonths = ?
      WHERE id = ?
    `;

    await this.db.run(query, [
      debt.name,
      debt.principal,
      debt.currentBalance,
      debt.emi,
      debt.interestRate,
      debt.tenure,
      debt.remainingMonths,
      debt.id
    ]);
  }

  async deleteDebt(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.run('DELETE FROM debts WHERE id = ?', [id]);
  }

  // Investment operations
  async addInvestment(investment: Omit<Investment, 'created_at'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO investments (id, name, type, amount, currentValue)
      VALUES (?, ?, ?, ?, ?)
    `;

    await this.db.run(query, [
      investment.id,
      investment.name,
      investment.type,
      investment.amount,
      investment.currentValue
    ]);
  }

  async getInvestments(): Promise<Investment[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT * FROM investments ORDER BY created_at DESC');
    return result.values || [];
  }

  async updateInvestment(investment: Investment): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      UPDATE investments SET name = ?, type = ?, amount = ?, currentValue = ?
      WHERE id = ?
    `;

    await this.db.run(query, [
      investment.name,
      investment.type,
      investment.amount,
      investment.currentValue,
      investment.id
    ]);
  }

  async deleteInvestment(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.run('DELETE FROM investments WHERE id = ?', [id]);
  }

  // Settings operations
  async setSetting(key: string, value: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
    `;

    await this.db.run(query, [key, value]);
  }

  async getSetting(key: string): Promise<string | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT value FROM settings WHERE key = ?', [key]);
    return result.values?.[0]?.value || null;
  }

  // Utility operations
  async exportData(): Promise<{ expenses: Expense[], debts: Debt[], investments: Investment[] }> {
    const expenses = await this.getExpenses();
    const debts = await this.getDebts();
    const investments = await this.getInvestments();

    return { expenses, debts, investments };
  }

  async importData(data: { expenses?: Expense[], debts?: Debt[], investments?: Investment[] }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Clear existing data
      await this.db.execute('DELETE FROM expenses');
      await this.db.execute('DELETE FROM debts');
      await this.db.execute('DELETE FROM investments');

      // Import new data
      if (data.expenses) {
        for (const expense of data.expenses) {
          await this.addExpense(expense);
        }
      }

      if (data.debts) {
        for (const debt of data.debts) {
          await this.addDebt(debt);
        }
      }

      if (data.investments) {
        for (const investment of data.investments) {
          await this.addInvestment(investment);
        }
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection('moneywise.db', false);
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export const databaseService = new DatabaseService();
