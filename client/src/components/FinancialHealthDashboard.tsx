import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExpenses, useIncomes, useBankBalances, useDebts } from '@/hooks/useDatabase';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, PiggyBank } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface FinancialMetrics {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyEMIs: number;
  disposableIncome: number;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  financialHealthScore: number;
}

export const FinancialHealthDashboard = () => {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { bankBalances } = useBankBalances();
  const { debts } = useDebts();

  const calculateMetrics = (): FinancialMetrics => {
    const totalAssets = bankBalances.reduce((sum, balance) => sum + balance.balance, 0);
    const totalLiabilities = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
    const netWorth = totalAssets - totalLiabilities;
    
    const monthlyIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const monthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyEMIs = debts.reduce((sum, debt) => sum + debt.emi, 0);
    const disposableIncome = monthlyIncome - monthlyExpenses - monthlyEMIs;
    
    const emergencyFundMonths = totalAssets / (monthlyExpenses + monthlyEMIs || 1);
    const debtToIncomeRatio = totalLiabilities / (monthlyIncome * 12 || 1);
    const savingsRate = (disposableIncome / monthlyIncome || 0) * 100;
    
    // Financial Health Score (0-100)
    let score = 50; // Base score
    if (emergencyFundMonths >= 6) score += 20;
    else if (emergencyFundMonths >= 3) score += 10;
    
    if (debtToIncomeRatio < 0.2) score += 15;
    else if (debtToIncomeRatio < 0.4) score += 5;
    else score -= 10;
    
    if (savingsRate >= 20) score += 15;
    else if (savingsRate >= 10) score += 5;
    else if (savingsRate < 0) score -= 15;
    
    const financialHealthScore = Math.max(0, Math.min(100, score));

    return {
      netWorth,
      totalAssets,
      totalLiabilities,
      monthlyIncome,
      monthlyExpenses,
      monthlyEMIs,
      disposableIncome,
      emergencyFundMonths,
      debtToIncomeRatio,
      savingsRate,
      financialHealthScore
    };
  };

  const metrics = calculateMetrics();

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500', variant: 'outline' as const };
    return { label: 'Needs Improvement', color: 'bg-red-500', variant: 'destructive' as const };
  };

  const healthStatus = getHealthStatus(metrics.financialHealthScore);

  // Generate financial projection for next 12 months
  const generateProjection = () => {
    const projectionData = [];
    let currentNetWorth = metrics.netWorth;
    
    for (let month = 1; month <= 12; month++) {
      currentNetWorth += metrics.disposableIncome;
      projectionData.push({
        month: `Month ${month}`,
        netWorth: currentNetWorth,
        savings: metrics.disposableIncome * month
      });
    }
    return projectionData;
  };

  const projectionData = generateProjection();

  // Expense breakdown for pie chart
  const expenseBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expenseBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-bold">₹{metrics.netWorth.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Disposable</p>
                <p className="text-2xl font-bold">₹{metrics.disposableIncome.toLocaleString()}</p>
              </div>
              {metrics.disposableIncome >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emergency Fund</p>
                <p className="text-2xl font-bold">{metrics.emergencyFundMonths.toFixed(1)}M</p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold">{metrics.financialHealthScore}/100</p>
              </div>
              <div className={`h-8 w-8 rounded-full ${healthStatus.color}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Health Overview
          </CardTitle>
          <CardDescription>Your current financial status and key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Overall Health Score</span>
              <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
            </div>
            <Progress value={metrics.financialHealthScore} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Emergency Fund</span>
                  <span className={metrics.emergencyFundMonths >= 6 ? 'text-green-600' : 'text-red-600'}>
                    {metrics.emergencyFundMonths.toFixed(1)} months
                  </span>
                </div>
                <Progress value={Math.min((metrics.emergencyFundMonths / 6) * 100, 100)} />
                <p className="text-xs text-muted-foreground">Target: 6 months</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Debt-to-Income</span>
                  <span className={metrics.debtToIncomeRatio < 0.3 ? 'text-green-600' : 'text-red-600'}>
                    {(metrics.debtToIncomeRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.min(metrics.debtToIncomeRatio * 100, 100)} />
                <p className="text-xs text-muted-foreground">Target: Under 30%</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Savings Rate</span>
                  <span className={metrics.savingsRate >= 20 ? 'text-green-600' : 'text-yellow-600'}>
                    {metrics.savingsRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.max(0, Math.min(metrics.savingsRate, 100))} />
                <p className="text-xs text-muted-foreground">Target: 20%+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Projection */}
        <Card>
          <CardHeader>
            <CardTitle>12-Month Financial Projection</CardTitle>
            <CardDescription>Based on current income and spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Net Worth']} />
                <Line type="monotone" dataKey="netWorth" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where your money goes each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Alerts */}
      {(metrics.emergencyFundMonths < 3 || metrics.debtToIncomeRatio > 0.4 || metrics.savingsRate < 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Financial Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-red-700">
              {metrics.emergencyFundMonths < 3 && (
                <li>• Emergency fund is below 3 months. Consider building it to ₹{((metrics.monthlyExpenses + metrics.monthlyEMIs) * 6).toLocaleString()}</li>
              )}
              {metrics.debtToIncomeRatio > 0.4 && (
                <li>• High debt-to-income ratio. Consider debt consolidation or aggressive repayment</li>
              )}
              {metrics.savingsRate < 0 && (
                <li>• You're spending more than you earn. Review expenses and increase income sources</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};