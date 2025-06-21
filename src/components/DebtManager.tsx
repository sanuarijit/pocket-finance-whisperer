
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingDown, AlertCircle, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Debt {
  id: string;
  name: string;
  principal: number;
  currentBalance: number;
  emi: number;
  interestRate: number;
  tenure: number;
  remainingMonths: number;
}

const DebtManager = () => {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: '1',
      name: 'Home Loan',
      principal: 2500000,
      currentBalance: 1850000,
      emi: 12500,
      interestRate: 8.5,
      tenure: 240,
      remainingMonths: 186
    },
    {
      id: '2',
      name: 'Car Loan',
      principal: 800000,
      currentBalance: 450000,
      emi: 8900,
      interestRate: 9.2,
      tenure: 84,
      remainingMonths: 52
    }
  ]);

  const [newDebt, setNewDebt] = useState({
    name: '',
    principal: '',
    emi: '',
    interestRate: '',
    tenure: ''
  });

  const [prepaymentCalculator, setPrepaymentCalculator] = useState({
    debtId: '',
    amount: ''
  });

  const addDebt = () => {
    if (!newDebt.name || !newDebt.principal || !newDebt.emi || !newDebt.interestRate || !newDebt.tenure) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const principal = parseFloat(newDebt.principal);
    const emi = parseFloat(newDebt.emi);
    const rate = parseFloat(newDebt.interestRate);
    const tenure = parseInt(newDebt.tenure);

    // Calculate current balance (simplified calculation)
    const monthlyRate = rate / 12 / 100;
    const remainingMonths = Math.ceil(Math.log(1 + (principal * monthlyRate) / emi) / Math.log(1 + monthlyRate));
    const currentBalance = principal * 0.85; // Simplified for demo

    const debt: Debt = {
      id: Date.now().toString(),
      name: newDebt.name,
      principal,
      currentBalance,
      emi,
      interestRate: rate,
      tenure,
      remainingMonths
    };

    setDebts([...debts, debt]);
    setNewDebt({ name: '', principal: '', emi: '', interestRate: '', tenure: '' });
    
    toast({
      title: "Debt Added",
      description: `${debt.name} has been added successfully`,
    });
  };

  const calculatePrepaymentImpact = (debt: Debt, prepayAmount: number) => {
    const monthlyRate = debt.interestRate / 12 / 100;
    const currentBalance = debt.currentBalance - prepayAmount;
    
    if (currentBalance <= 0) {
      return {
        newBalance: 0,
        monthsSaved: debt.remainingMonths,
        interestSaved: debt.remainingMonths * debt.emi - debt.currentBalance
      };
    }

    const newRemainingMonths = Math.ceil(Math.log(1 + (currentBalance * monthlyRate) / debt.emi) / Math.log(1 + monthlyRate));
    const monthsSaved = debt.remainingMonths - newRemainingMonths;
    const interestSaved = monthsSaved * debt.emi - prepayAmount;

    return {
      newBalance: currentBalance,
      monthsSaved,
      interestSaved: Math.max(0, interestSaved)
    };
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  const totalEMI = debts.reduce((sum, debt) => sum + debt.emi, 0);

  const DebtOverview = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="text-sm text-red-600 dark:text-red-400">Total Debt</div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">₹{totalDebt.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="text-sm text-orange-600 dark:text-orange-400">Monthly EMI</div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">₹{totalEMI.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="space-y-3">
        {debts.map((debt) => {
          const progress = ((debt.principal - debt.currentBalance) / debt.principal) * 100;
          const totalInterest = (debt.remainingMonths * debt.emi) - debt.currentBalance;
          
          return (
            <Card key={debt.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{debt.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {debt.interestRate}% • {debt.remainingMonths} months left
                    </p>
                  </div>
                  <Badge variant="outline">₹{debt.emi.toLocaleString()}/mo</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹{debt.currentBalance.toLocaleString()} remaining</span>
                    <span>{progress.toFixed(1)}% paid</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Total interest remaining: ₹{totalInterest.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const AddDebtForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Debt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="debt-name">Debt Name</Label>
          <Input
            id="debt-name"
            placeholder="e.g., Personal Loan"
            value={newDebt.name}
            onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="principal">Principal Amount</Label>
            <Input
              id="principal"
              type="number"
              placeholder="Total loan amount"
              value={newDebt.principal}
              onChange={(e) => setNewDebt({...newDebt, principal: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="emi">Monthly EMI</Label>
            <Input
              id="emi"
              type="number"
              placeholder="Monthly payment"
              value={newDebt.emi}
              onChange={(e) => setNewDebt({...newDebt, emi: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interest">Interest Rate (%)</Label>
            <Input
              id="interest"
              type="number"
              step="0.1"
              placeholder="Annual rate"
              value={newDebt.interestRate}
              onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="tenure">Tenure (months)</Label>
            <Input
              id="tenure"
              type="number"
              placeholder="Total months"
              value={newDebt.tenure}
              onChange={(e) => setNewDebt({...newDebt, tenure: e.target.value})}
            />
          </div>
        </div>

        <Button onClick={addDebt} className="w-full">
          Add Debt
        </Button>
      </CardContent>
    </Card>
  );

  const PrepaymentCalculator = () => {
    const selectedDebt = debts.find(d => d.id === prepaymentCalculator.debtId);
    const prepayAmount = parseFloat(prepaymentCalculator.amount) || 0;
    const impact = selectedDebt ? calculatePrepaymentImpact(selectedDebt, prepayAmount) : null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Prepayment Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Debt</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={prepaymentCalculator.debtId}
                onChange={(e) => setPrepaymentCalculator({...prepaymentCalculator, debtId: e.target.value})}
              >
                <option value="">Choose a debt</option>
                {debts.map((debt) => (
                  <option key={debt.id} value={debt.id}>{debt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="prepay-amount">Prepayment Amount</Label>
              <Input
                id="prepay-amount"
                type="number"
                placeholder="Enter amount"
                value={prepaymentCalculator.amount}
                onChange={(e) => setPrepaymentCalculator({...prepaymentCalculator, amount: e.target.value})}
              />
            </div>

            {impact && prepayAmount > 0 && (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Impact Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>New Balance:</span>
                      <span className="font-medium">₹{impact.newBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Months Saved:</span>
                      <span className="font-medium">{impact.monthsSaved} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Saved:</span>
                      <span className="font-medium text-green-600">₹{impact.interestSaved.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Debt Strategy Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-200">Smart Debt Strategy</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  • Pay high-interest debts first<br/>
                  • Consider debt consolidation if you have multiple loans<br/>
                  • Emergency fund before aggressive prepayment
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debt Manager</h1>
        {totalDebt > 0 && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">EMI-to-Income</div>
            <div className="text-lg font-bold text-orange-600">45%</div>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add">Add Debt</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <DebtOverview />
        </TabsContent>
        
        <TabsContent value="add" className="mt-6">
          <AddDebtForm />
        </TabsContent>
        
        <TabsContent value="calculator" className="mt-6">
          <PrepaymentCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebtManager;
