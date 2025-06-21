
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Wallet, Trash2 } from 'lucide-react';
import { useExpenses } from '@/hooks/useDatabase';
import type { Expense } from '@/services/databaseService';

const ExpenseTracker = () => {
  const { expenses, isLoading, addExpense, deleteExpense } = useExpenses();
  
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'variable' as 'fixed' | 'variable' | 'discretionary'
  });

  const categories = [
    'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'EMI', 
    'Medical', 'Fuel', 'Groceries', 'Other'
  ];

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      return;
    }

    const expense: Omit<Expense, 'created_at'> = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0],
      type: newExpense.type
    };

    await addExpense(expense);
    setNewExpense({ amount: '', category: '', description: '', type: 'variable' });
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'variable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'discretionary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-xl font-bold">₹{totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={newExpense.type}
              onValueChange={(value: 'fixed' | 'variable' | 'discretionary') => 
                setNewExpense({...newExpense, type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed (EMI, Rent)</SelectItem>
                <SelectItem value="variable">Variable (Food, Fuel)</SelectItem>
                <SelectItem value="discretionary">Discretionary (Shopping)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddExpense} className="w-full">
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses ({expenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No expenses recorded yet. Add your first expense above!
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-start p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{expense.description}</span>
                      <Badge className={getTypeColor(expense.type)}>
                        {expense.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expense.category} • {expense.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold">₹{expense.amount.toLocaleString()}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Wallet className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">Local Storage Active</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Your data is safely stored on your device and works completely offline. No internet required!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
