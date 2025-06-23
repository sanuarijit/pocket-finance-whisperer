
import { useQuery, useMutation } from '@tanstack/react-query';
import { databaseService, type Expense, type Debt, type Investment, type Income, type BankBalance } from '@/services/databaseService';
import { nanoid } from 'nanoid';
import { toast } from '@/hooks/use-toast';

// Simple database status hook - localStorage is always ready
export const useDatabase = () => {
  return { isInitialized: true, isLoading: false };
};

// Expenses hook using localStorage
export const useExpenses = () => {
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => databaseService.getExpenses(),
  });

  const addExpenseMutation = useMutation({
    mutationFn: (expense: Omit<Expense, 'created_at'>) => databaseService.addExpense(expense),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => databaseService.deleteExpense(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const addExpense = (expense: Omit<Expense, 'id' | 'created_at'>) => {
    const expenseWithId = { ...expense, id: nanoid() };
    addExpenseMutation.mutate(expenseWithId);
  };

  const deleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  return { 
    expenses, 
    isLoading, 
    addExpense, 
    deleteExpense,
    refreshExpenses: () => window.location.reload(), // Simple refresh for localStorage
  };
};

// Incomes hook using localStorage
export const useIncomes = () => {
  const { data: incomes = [], isLoading } = useQuery({
    queryKey: ['incomes'],
    queryFn: () => databaseService.getIncomes(),
  });

  const addIncomeMutation = useMutation({
    mutationFn: (income: Omit<Income, 'created_at'>) => databaseService.addIncome(income),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Income added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add income",
        variant: "destructive",
      });
    },
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: (id: string) => databaseService.deleteIncome(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Income deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive",
      });
    },
  });

  const addIncome = (income: Omit<Income, 'id' | 'created_at'>) => {
    const incomeWithId = { ...income, id: nanoid() };
    addIncomeMutation.mutate(incomeWithId);
  };

  const deleteIncome = (id: string) => {
    deleteIncomeMutation.mutate(id);
  };

  return { incomes, addIncome, deleteIncome, isLoading };
};

// Bank Balances hook using localStorage
export const useBankBalances = () => {
  const { data: bankBalances = [], isLoading } = useQuery({
    queryKey: ['bankBalances'],
    queryFn: () => databaseService.getBankBalances(),
  });

  const addBankBalanceMutation = useMutation({
    mutationFn: (bankBalance: Omit<BankBalance, 'created_at'>) => databaseService.addBankBalance(bankBalance),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank balance added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add bank balance",
        variant: "destructive",
      });
    },
  });

  const updateBankBalanceMutation = useMutation({
    mutationFn: (bankBalance: BankBalance) => databaseService.updateBankBalance(bankBalance),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank balance updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bank balance",
        variant: "destructive",
      });
    },
  });

  const deleteBankBalanceMutation = useMutation({
    mutationFn: (id: string) => databaseService.deleteBankBalance(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bank balance deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete bank balance",
        variant: "destructive",
      });
    },
  });

  const addBankBalance = (bankBalance: Omit<BankBalance, 'id' | 'created_at'>) => {
    const bankBalanceWithId = { ...bankBalance, id: nanoid() };
    addBankBalanceMutation.mutate(bankBalanceWithId);
  };

  const updateBankBalance = (bankBalance: BankBalance) => {
    updateBankBalanceMutation.mutate(bankBalance);
  };

  const deleteBankBalance = (id: string) => {
    deleteBankBalanceMutation.mutate(id);
  };

  return { bankBalances, addBankBalance, updateBankBalance, deleteBankBalance, isLoading };
};

// Debts hook using localStorage
export const useDebts = () => {
  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['debts'],
    queryFn: () => databaseService.getDebts(),
  });

  const addDebtMutation = useMutation({
    mutationFn: (debt: Omit<Debt, 'created_at'>) => databaseService.addDebt(debt),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Debt added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add debt",
        variant: "destructive",
      });
    },
  });

  const updateDebtMutation = useMutation({
    mutationFn: (debt: Debt) => databaseService.updateDebt(debt),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Debt updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update debt",
        variant: "destructive",
      });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: (id: string) => databaseService.deleteDebt(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Debt deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete debt",
        variant: "destructive",
      });
    },
  });

  const addDebt = (debt: Omit<Debt, 'id' | 'created_at'>) => {
    const debtWithId = { ...debt, id: nanoid() };
    addDebtMutation.mutate(debtWithId);
  };

  const updateDebt = (debt: Debt) => {
    updateDebtMutation.mutate(debt);
  };

  const deleteDebt = (id: string) => {
    deleteDebtMutation.mutate(id);
  };

  return { debts, addDebt, updateDebt, deleteDebt, isLoading };
};

// Investments hook using localStorage
export const useInvestments = () => {
  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => databaseService.getInvestments(),
  });

  const addInvestmentMutation = useMutation({
    mutationFn: (investment: Omit<Investment, 'created_at'>) => databaseService.addInvestment(investment),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investment added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add investment",
        variant: "destructive",
      });
    },
  });

  const updateInvestmentMutation = useMutation({
    mutationFn: (investment: Investment) => databaseService.updateInvestment(investment),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investment updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update investment",
        variant: "destructive",
      });
    },
  });

  const deleteInvestmentMutation = useMutation({
    mutationFn: (id: string) => databaseService.deleteInvestment(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investment deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete investment",
        variant: "destructive",
      });
    },
  });

  const addInvestment = (investment: Omit<Investment, 'id' | 'created_at'>) => {
    const investmentWithId = { ...investment, id: nanoid() };
    addInvestmentMutation.mutate(investmentWithId);
  };

  const updateInvestment = (investment: Investment) => {
    updateInvestmentMutation.mutate(investment);
  };

  const deleteInvestment = (id: string) => {
    deleteInvestmentMutation.mutate(id);
  };

  return { investments, addInvestment, updateInvestment, deleteInvestment, isLoading };
};
