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
  private isInitialized = false;

  constructor() {
    // Initialize with localStorage for web compatibility
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing local storage database...');
      // Initialize localStorage structure if not exists
      if (!localStorage.getItem('moneywise_expenses')) {
        localStorage.setItem('moneywise_expenses', JSON.stringify([]));
      }
      if (!localStorage.getItem('moneywise_debts')) {
        localStorage.setItem('moneywise_debts', JSON.stringify([]));
      }
      if (!localStorage.getItem('moneywise_investments')) {
        localStorage.setItem('moneywise_investments', JSON.stringify([]));
      }
      if (!localStorage.getItem('moneywise_settings')) {
        localStorage.setItem('moneywise_settings', JSON.stringify({}));
      }
      
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async addExpense(expense: Omit<Expense, 'created_at'>): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const expenses = await this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      created_at: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    localStorage.setItem('moneywise_expenses', JSON.stringify(expenses));
  }

  async getExpenses(): Promise<Expense[]> {
    if (!this.isInitialized) await this.initialize();
    
    const expenses = localStorage.getItem('moneywise_expenses');
    return expenses ? JSON.parse(expenses) : [];
  }

  async deleteExpense(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const expenses = await this.getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('moneywise_expenses', JSON.stringify(filteredExpenses));
  }

  async addDebt(debt: Omit<Debt, 'created_at'>): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const debts = await this.getDebts();
    const newDebt: Debt = {
      ...debt,
      created_at: new Date().toISOString()
    };
    
    debts.push(newDebt);
    localStorage.setItem('moneywise_debts', JSON.stringify(debts));
  }

  async getDebts(): Promise<Debt[]> {
    if (!this.isInitialized) await this.initialize();
    
    const debts = localStorage.getItem('moneywise_debts');
    return debts ? JSON.parse(debts) : [];
  }

  async updateDebt(debt: Debt): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const debts = await this.getDebts();
    const index = debts.findIndex(d => d.id === debt.id);
    if (index !== -1) {
      debts[index] = debt;
      localStorage.setItem('moneywise_debts', JSON.stringify(debts));
    }
  }

  async deleteDebt(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const debts = await this.getDebts();
    const filteredDebts = debts.filter(debt => debt.id !== id);
    localStorage.setItem('moneywise_debts', JSON.stringify(filteredDebts));
  }

  async addInvestment(investment: Omit<Investment, 'created_at'>): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const investments = await this.getInvestments();
    const newInvestment: Investment = {
      ...investment,
      created_at: new Date().toISOString()
    };
    
    investments.push(newInvestment);
    localStorage.setItem('moneywise_investments', JSON.stringify(investments));
  }

  async getInvestments(): Promise<Investment[]> {
    if (!this.isInitialized) await this.initialize();
    
    const investments = localStorage.getItem('moneywise_investments');
    return investments ? JSON.parse(investments) : [];
  }

  async updateInvestment(investment: Investment): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const investments = await this.getInvestments();
    const index = investments.findIndex(i => i.id === investment.id);
    if (index !== -1) {
      investments[index] = investment;
      localStorage.setItem('moneywise_investments', JSON.stringify(investments));
    }
  }

  async deleteInvestment(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const investments = await this.getInvestments();
    const filteredInvestments = investments.filter(investment => investment.id !== id);
    localStorage.setItem('moneywise_investments', JSON.stringify(filteredInvestments));
  }

  async setSetting(key: string, value: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const settings = JSON.parse(localStorage.getItem('moneywise_settings') || '{}');
    settings[key] = value;
    localStorage.setItem('moneywise_settings', JSON.stringify(settings));
  }

  async getSetting(key: string): Promise<string | null> {
    if (!this.isInitialized) await this.initialize();
    
    const settings = JSON.parse(localStorage.getItem('moneywise_settings') || '{}');
    return settings[key] || null;
  }

  async exportData(): Promise<{ expenses: Expense[], debts: Debt[], investments: Investment[] }> {
    const expenses = await this.getExpenses();
    const debts = await this.getDebts();
    const investments = await this.getInvestments();
    
    return { expenses, debts, investments };
  }

  async importData(data: { expenses?: Expense[], debts?: Debt[], investments?: Investment[] }): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    if (data.expenses) {
      localStorage.setItem('moneywise_expenses', JSON.stringify(data.expenses));
    }
    if (data.debts) {
      localStorage.setItem('moneywise_debts', JSON.stringify(data.debts));
    }
    if (data.investments) {
      localStorage.setItem('moneywise_investments', JSON.stringify(data.investments));
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for localStorage
    this.isInitialized = false;
  }
}

export const databaseService = new DatabaseService();