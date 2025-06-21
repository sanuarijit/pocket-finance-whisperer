
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Wallet, CreditCard, TrendingUp, Calculator } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Add expense clicked')
    },
    {
      icon: Wallet,
      label: 'Transfer',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Transfer clicked')
    },
    {
      icon: CreditCard,
      label: 'Pay Bill',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Pay bill clicked')
    },
    {
      icon: Calculator,
      label: 'Calculator',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Calculator clicked')
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
