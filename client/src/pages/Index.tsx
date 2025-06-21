
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Home, CreditCard, TrendingUp, Calculator, Settings, Moon, Sun } from 'lucide-react';
import { useExpenses, useDebts, useIncomes, useBankBalances } from '@/hooks/useDatabase';
import ExpenseTracker from '@/components/ExpenseTracker';
import DebtManager from '@/components/DebtManager';
import InvestmentTracker from '@/components/InvestmentTracker';
import IncomeTracker from '@/components/IncomeTracker';
import BankBalanceTracker from '@/components/BankBalanceTracker';
import FinancialForecast from '@/components/FinancialForecast';
import QuickActions from '@/components/QuickActions';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { expenses } = useExpenses();
  const { debts } = useDebts();
  const { incomes } = useIncomes();
  const { bankBalances } = useBankBalances();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Calculate real data from database
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const todayExpenses = expenses.filter(expense => expense.date === today);
  const thisMonthExpenses = expenses.filter(expense => expense.date.startsWith(thisMonth));
  
  const todayExpense = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlySpent = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  const totalEMIs = debts.reduce((sum, debt) => sum + debt.emi, 0);
  
  // Calculate real income and bank balance data
  const thisMonthIncomes = incomes.filter(income => income.date.startsWith(thisMonth));
  const monthlyIncome = thisMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalBankBalance = bankBalances.reduce((sum, balance) => sum + balance.balance, 0);
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const netWorth = totalBankBalance - totalDebt;
  
  // Calculate budget based on income vs expenses
  const monthlyBudget = monthlyIncome > 0 ? monthlyIncome : 40000;
  const plannedExpense = monthlyBudget * 0.1; // 10% of monthly budget for daily expenses

  const upcomingEMIs = debts.slice(0, 2).map(debt => ({
    name: debt.name,
    amount: debt.emi,
    dueDate: '2025-06-25' // This could be calculated based on debt creation date
  }));

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Good Morning! 👋</h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">Today's Expense</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{todayExpense.toLocaleString()}</div>
            <div className="text-xs text-blue-500">of ₹{plannedExpense.toLocaleString()} planned</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 dark:text-green-400">Bank Balance</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">₹{totalBankBalance.toLocaleString()}</div>
            <div className="text-xs text-green-500">
              {bankBalances.length} account{bankBalances.length !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>₹{monthlySpent.toLocaleString()} spent</span>
              <span>₹{monthlyBudget.toLocaleString()} budget</span>
            </div>
            <Progress 
              value={Math.min((monthlySpent / monthlyBudget) * 100, 100)} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              ₹{Math.max(0, monthlyBudget - monthlySpent).toLocaleString()} remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-lg font-bold">{expenses.length}</div>
            <div className="text-xs text-blue-600">Records stored</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active Debts</div>
            <div className="text-lg font-bold">{debts.length}</div>
            <div className="text-xs text-orange-600">₹{totalEMIs.toLocaleString()}/mo EMI</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming EMIs */}
      {upcomingEMIs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming EMIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEMIs.map((emi, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{emi.name}</div>
                    <div className="text-sm text-muted-foreground">Due: {emi.dueDate}</div>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    ₹{emi.amount.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <QuickActions 
        onAddExpense={() => setActiveTab('expenses')}
        onAddIncome={() => setActiveTab('income')}
        onAddBankBalance={() => setActiveTab('bankbalance')}
        onViewSummary={() => setActiveTab('dashboard')}
      />
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <div className="container max-w-md mx-auto p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="space-y-6">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="expenses" className="mt-0">
              <ExpenseTracker />
            </TabsContent>
            
            <TabsContent value="debts" className="mt-0">
              <DebtManager />
            </TabsContent>
            
            <TabsContent value="income" className="mt-0">
              <IncomeTracker />
            </TabsContent>
            
            <TabsContent value="bankbalance" className="mt-0">
              <BankBalanceTracker />
            </TabsContent>
            
            <TabsContent value="investments" className="mt-0">
              <InvestmentTracker />
            </TabsContent>
            
            <TabsContent value="forecast" className="mt-0">
              <FinancialForecast />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
            <TabsList className="grid w-full grid-cols-5 rounded-none h-16 bg-transparent">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary/10"
              >
                <Home className="h-4 w-4" />
                <span className="text-xs">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="expenses"
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary/10"
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-xs">Expenses</span>
              </TabsTrigger>
              <TabsTrigger 
                value="income"
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary/10"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Income</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bankbalance"
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">Balance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="debts"
                className="flex flex-col gap-1 py-2 data-[state=active]:bg-primary/10"
              >
                <Calculator className="h-4 w-4" />
                <span className="text-xs">Debts</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
