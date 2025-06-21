
import { useEffect, useState } from 'react';
import { databaseService, type Expense, type Debt, type Investment } from '@/services/databaseService';
import { toast } from '@/hooks/use-toast';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await databaseService.initialize();
        setIsInitialized(true);
        console.log('Database hook initialized');
      } catch (error) {
        console.error('Database initialization failed:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize local database",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  return { isInitialized, isLoading };
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      const data = await databaseService.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'created_at'>) => {
    try {
      await databaseService.addExpense(expense);
      await loadExpenses();
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await databaseService.deleteExpense(id);
      await loadExpenses();
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return { expenses, isLoading, addExpense, deleteExpense, refreshExpenses: loadExpenses };
};

export const useIncomes = () => {
  const { isInitialized } = useDatabase();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addIncome = async (income: any) => {
    await databaseService.addIncome(income);
    const updatedIncomes = await databaseService.getIncomes();
    setIncomes(updatedIncomes);
  };

  const deleteIncome = async (id: string) => {
    await databaseService.deleteIncome(id);
    const updatedIncomes = await databaseService.getIncomes();
    setIncomes(updatedIncomes);
  };

  useEffect(() => {
    const loadIncomes = async () => {
      try {
        const data = await databaseService.getIncomes();
        setIncomes(data);
      } catch (error) {
        console.error('Failed to load incomes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      loadIncomes();
    }
  }, [isInitialized]);

  return { incomes, addIncome, deleteIncome, isLoading };
};

export const useBankBalances = () => {
  const { isInitialized } = useDatabase();
  const [bankBalances, setBankBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addBankBalance = async (bankBalance: any) => {
    await databaseService.addBankBalance(bankBalance);
    const updatedBankBalances = await databaseService.getBankBalances();
    setBankBalances(updatedBankBalances);
  };

  const updateBankBalance = async (bankBalance: any) => {
    await databaseService.updateBankBalance(bankBalance);
    const updatedBankBalances = await databaseService.getBankBalances();
    setBankBalances(updatedBankBalances);
  };

  const deleteBankBalance = async (id: string) => {
    await databaseService.deleteBankBalance(id);
    const updatedBankBalances = await databaseService.getBankBalances();
    setBankBalances(updatedBankBalances);
  };

  useEffect(() => {
    const loadBankBalances = async () => {
      try {
        const data = await databaseService.getBankBalances();
        setBankBalances(data);
      } catch (error) {
        console.error('Failed to load bank balances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitialized) {
      loadBankBalances();
    }
  }, [isInitialized]);

  return { bankBalances, addBankBalance, updateBankBalance, deleteBankBalance, isLoading };
};

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDebts = async () => {
    try {
      const data = await databaseService.getDebts();
      setDebts(data);
    } catch (error) {
      console.error('Failed to load debts:', error);
      toast({
        title: "Error",
        description: "Failed to load debts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addDebt = async (debt: Omit<Debt, 'created_at'>) => {
    try {
      await databaseService.addDebt(debt);
      await loadDebts();
      toast({
        title: "Success",
        description: "Debt added successfully",
      });
    } catch (error) {
      console.error('Failed to add debt:', error);
      toast({
        title: "Error",
        description: "Failed to add debt",
        variant: "destructive"
      });
    }
  };

  const updateDebt = async (debt: Debt) => {
    try {
      await databaseService.updateDebt(debt);
      await loadDebts();
      toast({
        title: "Success",
        description: "Debt updated successfully",
      });
    } catch (error) {
      console.error('Failed to update debt:', error);
      toast({
        title: "Error",
        description: "Failed to update debt",
        variant: "destructive"
      });
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      await databaseService.deleteDebt(id);
      await loadDebts();
      toast({
        title: "Success",
        description: "Debt deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete debt:', error);
      toast({
        title: "Error",
        description: "Failed to delete debt",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  return { debts, isLoading, addDebt, updateDebt, deleteDebt, refreshDebts: loadDebts };
};
