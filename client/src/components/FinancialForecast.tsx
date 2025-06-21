
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, Target, Calendar, Calculator } from 'lucide-react';

const FinancialForecast = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

  // Mock financial data
  const financialData = {
    monthlyIncome: 75000,
    averageExpenses: 45000,
    upcomingEMIs: 21400,
    savingsGoal: 50000,
    currentSavings: 12000,
    emergencyFundTarget: 225000, // 3 months expenses
    currentEmergencyFund: 85000
  };

  const generateForecast = (months: number) => {
    const monthlyData = [];
    let cumulativeBalance = 15000; // Starting balance
    
    for (let i = 1; i <= months; i++) {
      const income = financialData.monthlyIncome;
      const expenses = financialData.averageExpenses + (Math.random() * 5000 - 2500); // Some variance
      const emis = financialData.upcomingEMIs;
      const netSavings = income - expenses - emis;
      cumulativeBalance += netSavings;
      
      monthlyData.push({
        month: i,
        income,
        expenses: Math.round(expenses),
        emis,
        netSavings: Math.round(netSavings),
        balance: Math.round(cumulativeBalance),
        balanceStatus: cumulativeBalance < 10000 ? 'critical' : cumulativeBalance < 25000 ? 'warning' : 'good'
      });
    }
    
    return monthlyData;
  };

  const forecast = generateForecast(selectedTimeframe === '3months' ? 3 : selectedTimeframe === '6months' ? 6 : 12);

  const generateInsights = () => {
    const insights = [];
    const avgMonthlySavings = forecast.reduce((sum, month) => sum + month.netSavings, 0) / forecast.length;
    const finalBalance = forecast[forecast.length - 1]?.balance || 0;
    
    // Low balance warning
    const lowBalanceMonths = forecast.filter(month => month.balance < 25000);
    if (lowBalanceMonths.length > 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Low Balance Alert',
        description: `Your balance may drop below ₹25,000 in ${lowBalanceMonths.length} month(s). Consider reducing discretionary spending.`
      });
    }

    // EMI-to-income ratio
    const emiRatio = (financialData.upcomingEMIs / financialData.monthlyIncome) * 100;
    if (emiRatio > 40) {
      insights.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'High EMI Burden',
        description: `Your EMI-to-income ratio is ${emiRatio.toFixed(1)}%. Consider debt consolidation or prepayment.`
      });
    }

    // Savings goal progress
    const monthsToGoal = Math.ceil((financialData.savingsGoal - financialData.currentSavings) / avgMonthlySavings);
    if (monthsToGoal > 0) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Savings Goal',
        description: `At current rate, you'll reach your ₹${financialData.savingsGoal.toLocaleString()} goal in ${monthsToGoal} months.`
      });
    }

    // Emergency fund status
    const emergencyFundProgress = (financialData.currentEmergencyFund / financialData.emergencyFundTarget) * 100;
    if (emergencyFundProgress < 50) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Emergency Fund Priority',
        description: `Your emergency fund is only ${emergencyFundProgress.toFixed(1)}% complete. Prioritize building it to 3-6 months of expenses.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const ForecastView = () => (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {[
          { value: '3months', label: '3 Months' },
          { value: '6months', label: '6 Months' },
          { value: '12months', label: '1 Year' }
        ].map((option) => (
          <Button
            key={option.value}
            variant={selectedTimeframe === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Projected Balance</div>
            <div className="text-xl font-bold">₹{forecast[forecast.length - 1]?.balance.toLocaleString()}</div>
            <div className="text-xs text-green-600">After {forecast.length} months</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Avg Monthly Savings</div>
            <div className="text-xl font-bold">
              ₹{Math.round(forecast.reduce((sum, month) => sum + month.netSavings, 0) / forecast.length).toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">Per month</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((month) => (
              <div key={month.month} className="p-3 rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Month {month.month}</span>
                  <Badge 
                    variant={month.balanceStatus === 'critical' ? 'destructive' : 
                            month.balanceStatus === 'warning' ? 'secondary' : 'default'}
                  >
                    ₹{month.balance.toLocaleString()}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Income</div>
                    <div className="font-medium text-green-600">+₹{month.income.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Expenses</div>
                    <div className="font-medium text-red-600">-₹{month.expenses.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">EMIs</div>
                    <div className="font-medium text-orange-600">-₹{month.emis.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-sm">
                  <span className="text-muted-foreground">Net: </span>
                  <span className={`font-medium ${month.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.netSavings >= 0 ? '+' : ''}₹{month.netSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GoalsTracker = () => (
    <div className="space-y-4">
      {/* Savings Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Savings Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>₹{financialData.currentSavings.toLocaleString()} saved</span>
              <span>₹{financialData.savingsGoal.toLocaleString()} target</span>
            </div>
            <Progress 
              value={(financialData.currentSavings / financialData.savingsGoal) * 100} 
              className="h-3"
            />
            <div className="text-xs text-muted-foreground">
              ₹{(financialData.savingsGoal - financialData.currentSavings).toLocaleString()} remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Fund */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>₹{financialData.currentEmergencyFund.toLocaleString()}</span>
              <span>₹{financialData.emergencyFundTarget.toLocaleString()} target</span>
            </div>
            <Progress 
              value={(financialData.currentEmergencyFund / financialData.emergencyFundTarget) * 100} 
              className="h-3"
            />
            <div className="text-xs text-muted-foreground">
              {Math.round((financialData.currentEmergencyFund / (financialData.averageExpenses + financialData.upcomingEMIs)) * 10) / 10} months of expenses covered
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Smart Tips</h4>
          <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
            <p>• Set up automatic transfers to reach goals faster</p>
            <p>• Emergency fund before aggressive investing</p>
            <p>• Review and adjust goals quarterly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SmartInsights = () => (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Alert 
          key={index} 
          className={
            insight.type === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' :
            insight.type === 'warning' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950' :
            'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
          }
        >
          <insight.icon className="h-4 w-4" />
          <div>
            <div className="font-semibold">{insight.title}</div>
            <AlertDescription className="mt-1">
              {insight.description}
            </AlertDescription>
          </div>
        </Alert>
      ))}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Smart Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="font-medium text-green-800 dark:text-green-200">Prepayment Opportunity</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Consider prepaying ₹25,000 to your Car Loan to save ₹18,500 in interest
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="font-medium text-blue-800 dark:text-blue-200">Investment Suggestion</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                You can invest ₹8,000 monthly in SIP after emergency fund completion
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
              <div className="font-medium text-orange-800 dark:text-orange-200">Expense Alert</div>
              <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Food expenses increased 23% this month. Consider meal planning to save ₹3,000
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Forecast</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Next {selectedTimeframe === '3months' ? '3' : selectedTimeframe === '6months' ? '6' : '12'} months
        </Badge>
      </div>

      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="mt-6">
          <ForecastView />
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <GoalsTracker />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <SmartInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialForecast;
