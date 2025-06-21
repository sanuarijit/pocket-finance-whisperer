import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { useInvestments } from '@/hooks/useDatabase';
import { TrendingUp, Plus, Calendar, IndianRupee, Trash2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InvestmentForm {
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  interestRate?: number;
  maturityDate?: string;
  description?: string;
}

export const SavingsInvestmentTracker = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { investments, addInvestment, updateInvestment, deleteInvestment, isLoading } = useInvestments();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<InvestmentForm>();
  const watchedType = watch('type');

  const investmentTypes = [
    { value: 'epf', label: 'EPF (Employee Provident Fund)' },
    { value: 'ppf', label: 'PPF (Public Provident Fund)' },
    { value: 'fd', label: 'Fixed Deposit' },
    { value: 'rd', label: 'Recurring Deposit' },
    { value: 'mf_equity', label: 'Mutual Fund - Equity' },
    { value: 'mf_debt', label: 'Mutual Fund - Debt' },
    { value: 'mf_hybrid', label: 'Mutual Fund - Hybrid' },
    { value: 'sip', label: 'SIP (Systematic Investment Plan)' },
    { value: 'elss', label: 'ELSS (Tax Saving MF)' },
    { value: 'nsc', label: 'NSC (National Savings Certificate)' },
    { value: 'kisan_vikas', label: 'Kisan Vikas Patra' },
    { value: 'gold', label: 'Gold Investment' },
    { value: 'stocks', label: 'Direct Stocks' },
    { value: 'bonds', label: 'Government Bonds' },
    { value: 'ulip', label: 'ULIP' },
    { value: 'other', label: 'Other Investment' }
  ];

  const getTypicalReturns = (type: string) => {
    const returns: Record<string, number> = {
      epf: 8.15, ppf: 7.1, fd: 6.5, rd: 6.0, mf_equity: 12.0,
      mf_debt: 7.0, mf_hybrid: 9.0, sip: 12.0, elss: 11.0,
      nsc: 6.8, kisan_vikas: 7.5, gold: 8.0, stocks: 15.0,
      bonds: 6.0, ulip: 8.0, other: 7.0
    };
    return returns[type] || 7.0;
  };

  const onSubmit = (data: InvestmentForm) => {
    const investmentData = {
      ...data,
      amount: Number(data.amount),
      currentValue: Number(data.currentValue),
      interestRate: data.interestRate ? Number(data.interestRate) : getTypicalReturns(data.type)
    };

    if (isEditing) {
      updateInvestment({ id: isEditing, ...investmentData });
      setIsEditing(null);
    } else {
      addInvestment(investmentData);
    }
    reset();
  };

  const handleEdit = (investment: any) => {
    setIsEditing(investment.id);
    setValue('name', investment.name);
    setValue('type', investment.type);
    setValue('amount', investment.amount);
    setValue('currentValue', investment.currentValue);
    setValue('interestRate', investment.interestRate);
    setValue('maturityDate', investment.maturityDate);
    setValue('description', investment.description);
  };

  const calculateReturns = (investment: any) => {
    const returns = investment.currentValue - investment.amount;
    const returnPercentage = ((returns / investment.amount) * 100).toFixed(2);
    return { returns, returnPercentage };
  };

  const totalInvestment = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum: number, inv: any) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvestment;
  const overallReturnPercent = totalInvestment > 0 ? ((totalReturns / totalInvestment) * 100).toFixed(2) : '0';

  const getTypeLabel = (type: string) => {
    return investmentTypes.find(t => t.value === type)?.label || type.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Total Invested</div>
            <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Current Value</div>
            <div className="text-2xl font-bold text-green-600">₹{totalCurrentValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Total Returns</div>
            <div className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{totalReturns.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Return %</div>
            <div className={`text-2xl font-bold ${Number(overallReturnPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallReturnPercent}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">My Investments</TabsTrigger>
          <TabsTrigger value="add">Add Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">Loading investments...</div>
              </CardContent>
            </Card>
          ) : investments.length === 0 ? (
            <Card>
              <CardContent className="pt-4">
                <div className="text-center text-muted-foreground">
                  No investments added yet. Add your first investment to start tracking.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {investments.map((investment: any) => {
                const { returns, returnPercentage } = calculateReturns(investment);
                return (
                  <Card key={investment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{investment.name}</h3>
                            <Badge variant="outline">{getTypeLabel(investment.type)}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Invested</div>
                              <div className="font-medium">₹{investment.amount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Current Value</div>
                              <div className="font-medium">₹{investment.currentValue.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Returns</div>
                              <div className={`font-medium ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{returns.toLocaleString()} ({returnPercentage}%)
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Interest Rate</div>
                              <div className="font-medium">{investment.interestRate || 'N/A'}%</div>
                            </div>
                          </div>
                          {investment.maturityDate && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              Matures: {new Date(investment.maturityDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(investment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInvestment(investment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {isEditing ? 'Edit Investment' : 'Add New Investment'}
              </CardTitle>
              <CardDescription>
                Track your savings across EPF, PPF, mutual funds, fixed deposits, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Investment Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., HDFC Bank FD, SBI Bluechip Fund"
                      {...register('name', { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Investment Type</Label>
                    <Select onValueChange={(value) => setValue('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Invested (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 50000"
                      {...register('amount', { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentValue">Current Value (₹)</Label>
                    <Input
                      id="currentValue"
                      type="number"
                      placeholder="e.g., 55000"
                      {...register('currentValue', { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%) - Optional</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder={`Default: ${watchedType ? getTypicalReturns(watchedType) : '7.0'}%`}
                      {...register('interestRate')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maturityDate">Maturity Date - Optional</Label>
                    <Input
                      id="maturityDate"
                      type="date"
                      {...register('maturityDate')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description - Optional</Label>
                  <Input
                    id="description"
                    placeholder="Additional notes about this investment"
                    {...register('description')}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {isEditing ? 'Update Investment' : 'Add Investment'}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(null);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};