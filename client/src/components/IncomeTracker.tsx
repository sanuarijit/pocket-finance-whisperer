import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useIncomes } from '@/hooks/useDatabase';
import { nanoid } from 'nanoid';

const IncomeTracker = () => {
  const { incomes, addIncome, deleteIncome, isLoading } = useIncomes();
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    type: 'salary' as 'salary' | 'freelance' | 'business' | 'investment' | 'other',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.source || !formData.description) {
      return;
    }

    await addIncome({
      id: nanoid(),
      amount: parseFloat(formData.amount),
      source: formData.source,
      description: formData.description,
      type: formData.type,
      date: formData.date
    });

    setFormData({
      amount: '',
      source: '',
      description: '',
      type: 'salary',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddingIncome(false);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      salary: 'bg-blue-100 text-blue-800',
      freelance: 'bg-green-100 text-green-800',
      business: 'bg-purple-100 text-purple-800',
      investment: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const thisMonthIncome = incomes.filter(income => 
    income.date.startsWith(new Date().toISOString().slice(0, 7))
  ).reduce((sum, income) => sum + income.amount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading income data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Income Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 dark:text-green-400">This Month Income</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">₹{thisMonthIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Income</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Income Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Income Tracker
            </CardTitle>
            <Button
              onClick={() => setIsAddingIncome(!isAddingIncome)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isAddingIncome && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Company Name, Client"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Monthly salary, Project payment"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Add Income</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingIncome(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Income List */}
          <div className="space-y-3">
            {incomes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No income records yet. Add your first income entry!
              </div>
            ) : (
              incomes.map((income) => (
                <div key={income.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{income.source}</span>
                      <Badge className={getTypeColor(income.type)}>
                        {income.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{income.description}</div>
                    <div className="text-xs text-gray-500">{income.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">₹{income.amount.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteIncome(income.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeTracker;