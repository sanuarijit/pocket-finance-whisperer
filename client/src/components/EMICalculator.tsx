import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExpenses, useIncomes, useDebts } from '@/hooks/useDatabase';
import { Calculator, AlertTriangle, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EMICalculation {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  affordability: 'good' | 'moderate' | 'risky';
  recommendation: string;
  maxAffordableAmount: number;
  suggestedTenure: number;
}

export const EMICalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState<EMICalculation | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { debts } = useDebts();

  // Check for EMI alerts on component mount
  useEffect(() => {
    checkEMIAlerts();
  }, [debts]);

  const checkEMIAlerts = () => {
    const currentAlerts: string[] = [];
    const today = new Date();

    debts.forEach(debt => {
      // Alert for high EMI burden
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      if (debt.emi > totalIncome * 0.5) {
        currentAlerts.push(`High EMI burden: ${debt.name} EMI is ${((debt.emi / totalIncome) * 100).toFixed(1)}% of income`);
      }

      // Alert for loans completing soon
      if (debt.remainingMonths <= 6 && debt.remainingMonths > 0) {
        currentAlerts.push(`${debt.name} will be completed in ${debt.remainingMonths} months`);
      }

      // Alert for high interest loans
      if (debt.interestRate > 15) {
        currentAlerts.push(`Consider prepaying ${debt.name} (${debt.interestRate}% interest rate)`);
      }
    });

    setAlerts(currentAlerts);

    // Show toast for critical alerts
    if (currentAlerts.length > 0) {
      toast({
        title: "EMI Alerts",
        description: `You have ${currentAlerts.length} financial alerts`,
        variant: "default",
      });
    }
  };

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(tenure);

    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers",
        variant: "destructive",
      });
      return;
    }

    // EMI calculation formula
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    // Calculate affordability
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentEMIs = debts.reduce((sum, debt) => sum + debt.emi, 0);
    const disposableIncome = totalIncome - totalExpenses - currentEMIs;

    const emiToIncomeRatio = (emi + currentEMIs) / totalIncome;
    const emiToDisposableRatio = emi / disposableIncome;

    let affordability: 'good' | 'moderate' | 'risky';
    let recommendation: string;

    if (emiToIncomeRatio <= 0.3 && emiToDisposableRatio <= 0.5) {
      affordability = 'good';
      recommendation = 'This EMI fits comfortably in your budget. Good choice!';
    } else if (emiToIncomeRatio <= 0.5 && emiToDisposableRatio <= 0.8) {
      affordability = 'moderate';
      recommendation = 'This EMI is manageable but will impact your flexibility. Consider a longer tenure or larger down payment.';
    } else {
      affordability = 'risky';
      recommendation = 'This EMI is too high for your current income. Consider reducing the loan amount or extending the tenure.';
    }

    // Calculate maximum affordable amount
    const maxEMI = disposableIncome * 0.5; // 50% of disposable income
    const maxAffordableAmount = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));

    // Suggest optimal tenure
    const targetEMI = disposableIncome * 0.3; // 30% of disposable income
    const suggestedTenure = Math.ceil(Math.log(1 + (p * r / targetEMI)) / Math.log(1 + r));

    setResult({
      monthlyEMI: emi,
      totalInterest,
      totalAmount,
      affordability,
      recommendation,
      maxAffordableAmount,
      suggestedTenure: Math.min(suggestedTenure, 240) // Cap at 20 years
    });
  };

  const getAffordabilityColor = (affordability: string) => {
    switch (affordability) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risky': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPresetValues = (type: 'home' | 'car' | 'personal') => {
    const presets = {
      home: { rate: '8.5', tenure: '240' }, // 20 years
      car: { rate: '10.5', tenure: '60' },  // 5 years
      personal: { rate: '14.0', tenure: '36' } // 3 years
    };
    
    setInterestRate(presets[type].rate);
    setTenure(presets[type].tenure);
  };

  return (
    <div className="space-y-6">
      {/* EMI Alerts */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Bell className="h-5 w-5" />
              EMI Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-orange-700">
              {alerts.map((alert, index) => (
                <li key={index}>• {alert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* EMI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Smart EMI Calculator
          </CardTitle>
          <CardDescription>
            Calculate EMI with affordability analysis and smart recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loan Type Presets */}
          <div className="space-y-2">
            <Label>Quick Presets</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => getPresetValues('home')}>
                Home Loan
              </Button>
              <Button variant="outline" size="sm" onClick={() => getPresetValues('car')}>
                Car Loan
              </Button>
              <Button variant="outline" size="sm" onClick={() => getPresetValues('personal')}>
                Personal Loan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Loan Amount (₹)</Label>
              <Input
                id="principal"
                type="number"
                placeholder="e.g., 500000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                placeholder="e.g., 8.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (months)</Label>
              <Input
                id="tenure"
                type="number"
                placeholder="e.g., 240"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateEMI} className="w-full" disabled={!principal || !interestRate || !tenure}>
            Calculate EMI & Affordability
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              {/* EMI Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Monthly EMI</div>
                    <div className="text-2xl font-bold">₹{result.monthlyEMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                    <div className="text-2xl font-bold">₹{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold">₹{result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Affordability Analysis */}
              <Alert className={getAffordabilityColor(result.affordability)}>
                <div className="flex items-center gap-2">
                  {result.affordability === 'good' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription className="font-medium">
                    <Badge variant={result.affordability === 'good' ? 'default' : result.affordability === 'moderate' ? 'secondary' : 'destructive'}>
                      {result.affordability.toUpperCase()}
                    </Badge>
                    <span className="ml-2">{result.recommendation}</span>
                  </AlertDescription>
                </div>
              </Alert>

              {/* Smart Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Max Affordable Loan Amount</div>
                      <div className="text-lg font-semibold">₹{result.maxAffordableAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Suggested Tenure</div>
                      <div className="text-lg font-semibold">{result.suggestedTenure} months ({Math.round(result.suggestedTenure / 12)} years)</div>
                    </div>
                  </div>

                  {result.affordability === 'risky' && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-red-700">Better Options:</div>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• Reduce loan amount to ₹{result.maxAffordableAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                        <li>• Extend tenure to {result.suggestedTenure} months</li>
                        <li>• Increase down payment by ₹{(parseFloat(principal) - result.maxAffordableAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                        <li>• Consider increasing income before taking the loan</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};