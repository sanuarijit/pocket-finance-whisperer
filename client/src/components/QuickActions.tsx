
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Wallet, PiggyBank } from 'lucide-react';

interface QuickActionsProps {
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  onAddBankBalance?: () => void;
  onViewSummary?: () => void;
}

const QuickActions = ({ onAddExpense, onAddIncome, onAddBankBalance, onViewSummary }: QuickActionsProps) => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      color: 'bg-red-500 hover:bg-red-600',
      action: onAddExpense || (() => console.log('Add expense clicked'))
    },
    {
      icon: TrendingUp,
      label: 'Add Income',
      color: 'bg-green-500 hover:bg-green-600',
      action: onAddIncome || (() => console.log('Add income clicked'))
    },
    {
      icon: Wallet,
      label: 'Bank Balance',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: onAddBankBalance || (() => console.log('Add bank balance clicked'))
    },
    {
      icon: PiggyBank,
      label: 'Summary',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: onViewSummary || (() => console.log('View summary clicked'))
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col gap-2 ${action.color} text-white border-none hover:scale-105 transition-transform`}
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
