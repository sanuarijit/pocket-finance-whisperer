
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Wallet, Plus, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Investment {
  id: string;
  name: string;
  type: 'pf' | 'fd' | 'mf' | 'stocks' | 'gold' | 'sip';
  amount: number;
  currentValue: number;
  purchaseDate: string;
  maturityDate?: string;
  returns: number;
}

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'EPF Account',
      type: 'pf',
      amount: 185000,
      currentValue: 195000,
      purchaseDate: '2023-01-01',
      returns: 5.41
    },
    {
      id: '2',
      name: 'HDFC Bank FD',
      type: 'fd',
      amount: 100000,
      currentValue: 107500,
      purchaseDate: '2024-01-01',
      maturityDate: '2026-01-01',
      returns: 7.5
    },
    {
      id: '3',
      name: 'SBI Bluechip Fund',
      type: 'mf',
      amount: 50000,
      currentValue: 62000,
      purchaseDate: '2023-06-01',
      returns: 24.0
    }
  ]);

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'mf' as const,
    amount: '',
    currentValue: '',
    maturityDate: ''
  });

  const addInvestment = () => {
    if (!newInvestment.name || !newInvestment.amount || !newInvestment.currentValue) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newInvestment.amount);
    const currentValue = parseFloat(newInvestment.currentValue);
    const returns = ((currentValue - amount) / amount) * 100;

    const investment: Investment = {
      id: Date.now().toString(),
      name: newInvestment.name,
      type: newInvestment.type,
      amount,
      currentValue,
      purchaseDate: new Date().toISOString().split('T')[0],
      maturityDate: newInvestment.maturityDate || undefined,
      returns
    };

    setInvestments([...investments, investment]);
    setNewInvestment({ name: '', type: 'mf', amount: '', currentValue: '', maturityDate: '' });
    
    toast({
      title: "Investment Added",
      description: `${investment.name} has been added successfully`,
    });
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const overallReturnPercent = (totalReturns / totalInvested) * 100;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pf': return 'PF';
      case 'fd': return 'FD';
      case 'mf': return 'Mutual Fund';
      case 'stocks': return 'Stocks';
      case 'gold': return 'Gold';
      case 'sip': return 'SIP';
      default: return type.toUpperCase();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pf': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fd': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'mf': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'stocks': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sip': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const InvestmentOverview = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 dark:text-green-400">Total Invested</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">₹{totalInvested.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">Current Value</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{totalCurrentValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Returns Summary */}
      <Card className={`${totalReturns >= 0 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-sm ${totalReturns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Total Returns
              </div>
              <div className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                ₹{totalReturns.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${totalReturns >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {totalReturns >= 0 ? '+' : ''}{overallReturnPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment List */}
      <div className="space-y-3">
        {investments.map((investment) => (
          <Card key={investment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{investment.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getTypeColor(investment.type)}>
                      {getTypeLabel(investment.type)}
                    </Badge>
                    {investment.maturityDate && (
                      <span className="text-xs text-muted-foreground">
                        Matures: {investment.maturityDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{investment.currentValue.toLocaleString()}</div>
                  <div className={`text-sm ${investment.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {investment.returns >= 0 ? '+' : ''}{investment.returns.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Invested: ₹{investment.amount.toLocaleString()} • 
                Gain: ₹{(investment.currentValue - investment.amount).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const AddInvestmentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Investment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="inv-name">Investment Name</Label>
          <Input
            id="inv-name"
            placeholder="e.g., HDFC Top 100 Fund"
            value={newInvestment.name}
            onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
          />
        </div>
        
        <div>
          <Label htmlFor="inv-type">Type</Label>
          <select
            id="inv-type"
            className="w-full p-2 border rounded-md bg-background"
            value={newInvestment.type}
            onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value as any})}
          >
            <option value="mf">Mutual Fund</option>
            <option value="pf">Provident Fund</option>
            <option value="fd">Fixed Deposit</option>
            <option value="stocks">Stocks</option>
            <option value="gold">Gold</option>
            <option value="sip">SIP</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="inv-amount">Invested Amount</Label>
            <Input
              id="inv-amount"
              type="number"
              placeholder="Principal amount"
              value={newInvestment.amount}
              onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="inv-current">Current Value</Label>
            <Input
              id="inv-current"
              type="number"
              placeholder="Current value"
              value={newInvestment.currentValue}
              onChange={(e) => setNewInvestment({...newInvestment, currentValue: e.target.value})}
            />
          </div>
        </div>

        {(newInvestment.type === 'fd') && (
          <div>
            <Label htmlFor="maturity">Maturity Date (Optional)</Label>
            <Input
              id="maturity"
              type="date"
              value={newInvestment.maturityDate}
              onChange={(e) => setNewInvestment({...newInvestment, maturityDate: e.target.value})}
            />
          </div>
        )}

        <Button onClick={addInvestment} className="w-full">
          Add Investment
        </Button>
      </CardContent>
    </Card>
  );

  const SIPCalculator = () => {
    const [sipData, setSipData] = useState({
      monthlyAmount: '',
      expectedReturn: '',
      duration: ''
    });

    const monthlyAmount = parseFloat(sipData.monthlyAmount) || 0;
    const annualReturn = parseFloat(sipData.expectedReturn) || 0;
    const years = parseFloat(sipData.duration) || 0;

    const monthlyReturn = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = months > 0 ? monthlyAmount * (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn)) : 0;
    const totalInvested = monthlyAmount * months;
    const gains = futureValue - totalInvested;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SIP Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sip-amount">Monthly SIP Amount</Label>
            <Input
              id="sip-amount"
              type="number"
              placeholder="₹5000"
              value={sipData.monthlyAmount}
              onChange={(e) => setSipData({...sipData, monthlyAmount: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sip-return">Expected Return (%)</Label>
              <Input
                id="sip-return"
                type="number"
                placeholder="12"
                value={sipData.expectedReturn}
                onChange={(e) => setSipData({...sipData, expectedReturn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="sip-duration">Duration (years)</Label>
              <Input
                id="sip-duration"
                type="number"
                placeholder="10"
                value={sipData.duration}
                onChange={(e) => setSipData({...sipData, duration: e.target.value})}
              />
            </div>
          </div>

          {futureValue > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">SIP Projection</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Invested:</span>
                    <span className="font-medium">₹{totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Future Value:</span>
                    <span className="font-medium">₹{futureValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Gains:</span>
                    <span className="font-medium text-green-600">₹{gains.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assets & Investments</h1>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Net Worth</div>
          <div className="text-xl font-bold text-green-600">₹{(totalCurrentValue - 185000).toLocaleString()}</div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Portfolio</TabsTrigger>
          <TabsTrigger value="add">Add Asset</TabsTrigger>
          <TabsTrigger value="calculator">SIP Calc</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <InvestmentOverview />
        </TabsContent>
        
        <TabsContent value="add" className="mt-6">
          <AddInvestmentForm />
        </TabsContent>
        
        <TabsContent value="calculator" className="mt-6">
          <SIPCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentTracker;
