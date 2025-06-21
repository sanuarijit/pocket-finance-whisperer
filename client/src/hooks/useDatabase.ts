import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { nanoid } from 'nanoid';
import { toast } from '@/hooks/use-toast';

// Simple database status hook - API is always ready
export const useDatabase = () => {
  return { isInitialized: true, isLoading: false };
};

// Expenses hook using React Query
export const useExpenses = () => {
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['/api/expenses'],
    queryFn: () => apiRequest('/api/expenses'),
  });

  const addExpenseMutation = useMutation({
    mutationFn: (expense: any) => apiRequest('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
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
    mutationFn: (id: string) => apiRequest(`/api/expenses/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
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

  const addExpense = (expense: any) => {
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
    refreshExpenses: () => queryClient.invalidateQueries({ queryKey: ['/api/expenses'] }),
  };
};

// Incomes hook using React Query
export const useIncomes = () => {
  const { data: incomes = [], isLoading } = useQuery({
    queryKey: ['/api/incomes'],
    queryFn: () => apiRequest('/api/incomes'),
  });

  const addIncomeMutation = useMutation({
    mutationFn: (income: any) => apiRequest('/api/incomes', {
      method: 'POST',
      body: JSON.stringify(income),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incomes'] });
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
    mutationFn: (id: string) => apiRequest(`/api/incomes/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incomes'] });
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

  const addIncome = (income: any) => {
    const incomeWithId = { ...income, id: nanoid() };
    addIncomeMutation.mutate(incomeWithId);
  };

  const deleteIncome = (id: string) => {
    deleteIncomeMutation.mutate(id);
  };

  return { incomes, addIncome, deleteIncome, isLoading };
};

// Bank Balances hook using React Query
export const useBankBalances = () => {
  const { data: bankBalances = [], isLoading } = useQuery({
    queryKey: ['/api/bank-balances'],
    queryFn: () => apiRequest('/api/bank-balances'),
  });

  const addBankBalanceMutation = useMutation({
    mutationFn: (bankBalance: any) => apiRequest('/api/bank-balances', {
      method: 'POST',
      body: JSON.stringify(bankBalance),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bank-balances'] });
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
    mutationFn: (bankBalance: any) => apiRequest(`/api/bank-balances/${bankBalance.id}`, {
      method: 'PUT',
      body: JSON.stringify(bankBalance),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bank-balances'] });
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
    mutationFn: (id: string) => apiRequest(`/api/bank-balances/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bank-balances'] });
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

  const addBankBalance = (bankBalance: any) => {
    const bankBalanceWithId = { ...bankBalance, id: nanoid() };
    addBankBalanceMutation.mutate(bankBalanceWithId);
  };

  const updateBankBalance = (bankBalance: any) => {
    updateBankBalanceMutation.mutate(bankBalance);
  };

  const deleteBankBalance = (id: string) => {
    deleteBankBalanceMutation.mutate(id);
  };

  return { bankBalances, addBankBalance, updateBankBalance, deleteBankBalance, isLoading };
};

// Debts hook using React Query
export const useDebts = () => {
  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['/api/debts'],
    queryFn: () => apiRequest('/api/debts'),
  });

  const addDebtMutation = useMutation({
    mutationFn: (debt: any) => apiRequest('/api/debts', {
      method: 'POST',
      body: JSON.stringify(debt),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/debts'] });
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
    mutationFn: (debt: any) => apiRequest(`/api/debts/${debt.id}`, {
      method: 'PUT',
      body: JSON.stringify(debt),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/debts'] });
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
    mutationFn: (id: string) => apiRequest(`/api/debts/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/debts'] });
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

  const addDebt = (debt: any) => {
    const debtWithId = { ...debt, id: nanoid() };
    addDebtMutation.mutate(debtWithId);
  };

  const updateDebt = (debt: any) => {
    updateDebtMutation.mutate(debt);
  };

  const deleteDebt = (id: string) => {
    deleteDebtMutation.mutate(id);
  };

  return { debts, addDebt, updateDebt, deleteDebt, isLoading };
};

// Investments hook using React Query
export const useInvestments = () => {
  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['/api/investments'],
    queryFn: () => apiRequest('/api/investments'),
  });

  const addInvestmentMutation = useMutation({
    mutationFn: (investment: any) => apiRequest('/api/investments', {
      method: 'POST',
      body: JSON.stringify(investment),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
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
    mutationFn: (investment: any) => apiRequest(`/api/investments/${investment.id}`, {
      method: 'PUT',
      body: JSON.stringify(investment),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
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
    mutationFn: (id: string) => apiRequest(`/api/investments/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
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

  const addInvestment = (investment: any) => {
    const investmentWithId = { ...investment, id: nanoid() };
    addInvestmentMutation.mutate(investmentWithId);
  };

  const updateInvestment = (investment: any) => {
    updateInvestmentMutation.mutate(investment);
  };

  const deleteInvestment = (id: string) => {
    deleteInvestmentMutation.mutate(id);
  };

  return { investments, addInvestment, updateInvestment, deleteInvestment, isLoading };
};