
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

export interface Income {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string;
  type: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
  created_at?: string;
}

export interface BankBalance {
  id: string;
  bankName: string;
  accountType: 'savings' | 'current' | 'fd' | 'other';
  balance: number;
  date: string;
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
      if (!localStorage.getItem('moneywise_income')) {
        localStorage.setItem('moneywise_income', JSON.stringify([]));
      }
      if (!localStorage.getItem('moneywise_bank_balances')) {
        localStorage.setItem('moneywise_bank_balances', JSON.stringify([]));
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

  // Income operations
  async addIncome(income: Omit<Income, 'created_at'>): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const incomes = await this.getIncomes();
    const newIncome: Income = {
      ...income,
      created_at: new Date().toISOString()
    };
    
    incomes.push(newIncome);
    localStorage.setItem('moneywise_income', JSON.stringify(incomes));
  }

  async getIncomes(): Promise<Income[]> {
    if (!this.isInitialized) await this.initialize();
    
    const incomes = localStorage.getItem('moneywise_income');
    return incomes ? JSON.parse(incomes) : [];
  }

  async deleteIncome(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const incomes = await this.getIncomes();
    const filteredIncomes = incomes.filter(income => income.id !== id);
    localStorage.setItem('moneywise_income', JSON.stringify(filteredIncomes));
  }

  // Bank Balance operations
  async addBankBalance(bankBalance: Omit<BankBalance, 'created_at'>): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const bankBalances = await this.getBankBalances();
    const newBankBalance: BankBalance = {
      ...bankBalance,
      created_at: new Date().toISOString()
    };
    
    bankBalances.push(newBankBalance);
    localStorage.setItem('moneywise_bank_balances', JSON.stringify(bankBalances));
  }

  async getBankBalances(): Promise<BankBalance[]> {
    if (!this.isInitialized) await this.initialize();
    
    const bankBalances = localStorage.getItem('moneywise_bank_balances');
    return bankBalances ? JSON.parse(bankBalances) : [];
  }

  async updateBankBalance(bankBalance: BankBalance): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const bankBalances = await this.getBankBalances();
    const index = bankBalances.findIndex(b => b.id === bankBalance.id);
    if (index !== -1) {
      bankBalances[index] = bankBalance;
      localStorage.setItem('moneywise_bank_balances', JSON.stringify(bankBalances));
    }
  }

  async deleteBankBalance(id: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const bankBalances = await this.getBankBalances();
    const filteredBankBalances = bankBalances.filter(balance => balance.id !== id);
    localStorage.setItem('moneywise_bank_balances', JSON.stringify(filteredBankBalances));
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

  async exportData(): Promise<{ expenses: Expense[], debts: Debt[], investments: Investment[], incomes: Income[], bankBalances: BankBalance[] }> {
    const expenses = await this.getExpenses();
    const debts = await this.getDebts();
    const investments = await this.getInvestments();
    const incomes = await this.getIncomes();
    const bankBalances = await this.getBankBalances();
    
    return { expenses, debts, investments, incomes, bankBalances };
  }

  async importData(data: { expenses?: Expense[], debts?: Debt[], investments?: Investment[], incomes?: Income[], bankBalances?: BankBalance[] }): Promise<void> {
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
    if (data.incomes) {
      localStorage.setItem('moneywise_income', JSON.stringify(data.incomes));
    }
    if (data.bankBalances) {
      localStorage.setItem('moneywise_bank_balances', JSON.stringify(data.bankBalances));
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for localStorage
    this.isInitialized = false;
  }
}

export const databaseService = new DatabaseService();
