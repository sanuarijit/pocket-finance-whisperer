import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExpenses, useIncomes, useBankBalances, useDebts } from '@/hooks/useDatabase';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface AffordabilityResult {
  canAfford: boolean;
  recommendation: string;
  impact: string;
  emergencyFundAfter: number;
  monthsOfExpensesCovered: number;
  debtToIncomeRatio: number;
  suggestion: string;
}

export const AffordabilityAnalyzer = () => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseType, setPurchaseType] = useState('');
  const [emiMonths, setEmiMonths] = useState('');
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { bankBalances } = useBankBalances();
  const { debts } = useDebts();

  const calculateAffordability = () => {
    const amount = parseFloat(purchaseAmount);
    if (!amount || amount <= 0) return;

    // Calculate financial metrics
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBankBalance = bankBalances.reduce((sum, balance) => sum + balance.balance, 0);
    const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    const monthlyEMIs = debts.reduce((sum, debt) => sum + debt.emi, 0);

    const monthlyDisposable = totalIncome - totalExpenses - monthlyEMIs;
    const emergencyFund = totalBankBalance * 0.3; // Keep 30% as emergency
    const availableForPurchase = totalBankBalance - emergencyFund;
    
    const debtToIncomeRatio = totalDebt / (totalIncome * 12); // Annual ratio
    const monthsOfExpensesCovered = totalBankBalance / (totalExpenses + monthlyEMIs);

    let canAfford = false;
    let recommendation = '';
    let impact = '';
    let suggestion = '';

    if (emiMonths && parseInt(emiMonths) > 0) {
      // EMI Purchase Analysis
      const monthlyEMI = amount / parseInt(emiMonths);
      const newDisposable = monthlyDisposable - monthlyEMI;
      
      canAfford = newDisposable > totalExpenses * 0.2; // Keep 20% buffer
      
      if (canAfford) {
        recommendation = `✅ You can afford this EMI of ₹${monthlyEMI.toFixed(0)}/month`;
        impact = `Your disposable income will be ₹${newDisposable.toFixed(0)}/month after EMI`;
        suggestion = `Recommended: Choose ${Math.min(parseInt(emiMonths), 24)} months tenure for better financial health`;
      } else {
        recommendation = `❌ This EMI would strain your budget`;
        impact = `You'd only have ₹${newDisposable.toFixed(0)}/month disposable income`;
        suggestion = `Consider: Increase down payment or extend tenure to ₹${(monthlyDisposable * 0.3).toFixed(0)}/month max EMI`;
      }
    } else {
      // One-time Purchase Analysis
      canAfford = amount <= availableForPurchase && monthsOfExpensesCovered > 3;
      
      if (canAfford) {
        recommendation = `✅ You can afford this purchase`;
        impact = `You'll have ₹${(availableForPurchase - amount).toFixed(0)} left after purchase`;
        suggestion = getSmartSuggestion(purchaseType, amount, monthlyDisposable);
      } else {
        recommendation = `❌ This purchase would risk your financial stability`;
        impact = amount > availableForPurchase 
          ? `You need ₹${(amount - availableForPurchase).toFixed(0)} more`
          : 'Your emergency fund would be compromised';
        suggestion = `Wait and save ₹${(monthlyDisposable * 0.5).toFixed(0)}/month. You can afford this in ${Math.ceil((amount - availableForPurchase) / (monthlyDisposable * 0.5))} months`;
      }
    }

    setResult({
      canAfford,
      recommendation,
      impact,
      emergencyFundAfter: totalBankBalance - (emiMonths ? 0 : amount),
      monthsOfExpensesCovered: (totalBankBalance - (emiMonths ? 0 : amount)) / (totalExpenses + monthlyEMIs),
      debtToIncomeRatio,
      suggestion
    });
  };

  const getSmartSuggestion = (type: string, amount: number, disposable: number): string => {
    const suggestions: Record<string, string> = {
      party: amount > 3000 ? 'Consider hosting at home or splitting costs with friends' : 'Good choice for entertainment budget',
      trip: amount > 10000 ? 'Look for off-season deals or group bookings' : 'Perfect for a refreshing break',
      phone: amount > 20000 ? 'Consider previous generation models or wait for sales' : 'Good value for money choice',
      default: disposable > amount * 0.1 ? 'This fits well in your budget' : 'Consider if this is a necessity'
    };
    
    return suggestions[type] || suggestions.default;
  };

  const getRecommendedEMI = () => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyEMIs = debts.reduce((sum, debt) => sum + debt.emi, 0);
    const monthlyDisposable = totalIncome - totalExpenses - monthlyEMIs;
    
    return Math.floor(monthlyDisposable * 0.3); // Max 30% of disposable income for new EMI
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Affordability Analyzer
        </CardTitle>
        <CardDescription>
          Check if you can afford a purchase and get smart financial advice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Purchase Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Purchase Type</Label>
            <Select value={purchaseType} onValueChange={setPurchaseType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="trip">Trip/Vacation</SelectItem>
                <SelectItem value="party">Party/Event</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emi">EMI Duration (months) - Optional</Label>
          <Input
            id="emi"
            type="number"
            placeholder="Leave empty for one-time purchase"
            value={emiMonths}
            onChange={(e) => setEmiMonths(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Recommended max EMI: ₹{getRecommendedEMI()}/month
          </p>
        </div>

        <Button 
          onClick={calculateAffordability}
          className="w-full"
          disabled={!purchaseAmount}
        >
          Analyze Affordability
        </Button>

        {result && (
          <div className="space-y-4">
            <Alert className={result.canAfford ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {result.canAfford ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="font-medium">
                  {result.recommendation}
                </AlertDescription>
              </div>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Financial Impact</div>
                  <div className="font-medium">{result.impact}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Emergency Fund After</div>
                  <div className="font-medium">₹{result.emergencyFundAfter.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.monthsOfExpensesCovered.toFixed(1)} months of expenses covered
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground mb-2">Smart Suggestion</div>
                <div className="font-medium text-sm">{result.suggestion}</div>
                
                <div className="flex gap-2 mt-3">
                  <Badge variant={result.debtToIncomeRatio < 0.3 ? 'default' : 'destructive'}>
                    Debt Ratio: {(result.debtToIncomeRatio * 100).toFixed(1)}%
                  </Badge>
                  <Badge variant={result.monthsOfExpensesCovered > 6 ? 'default' : 'secondary'}>
                    {result.monthsOfExpensesCovered.toFixed(1)}M Emergency Fund
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};