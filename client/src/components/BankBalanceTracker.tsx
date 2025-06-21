import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, Edit, Trash2 } from 'lucide-react';
import { useBankBalances } from '@/hooks/useDatabase';
import { nanoid } from 'nanoid';

const BankBalanceTracker = () => {
  const { bankBalances, addBankBalance, updateBankBalance, deleteBankBalance, isLoading } = useBankBalances();
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountType: 'savings' as 'savings' | 'current' | 'fd' | 'other',
    balance: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bankName || !formData.balance) {
      return;
    }

    const balanceData = {
      id: editingId || nanoid(),
      bankName: formData.bankName,
      accountType: formData.accountType,
      balance: parseFloat(formData.balance),
      date: formData.date
    };

    if (editingId) {
      await updateBankBalance(balanceData);
      setEditingId(null);
    } else {
      await addBankBalance(balanceData);
    }

    setFormData({
      bankName: '',
      accountType: 'savings',
      balance: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddingBalance(false);
  };

  const handleEdit = (balance: any) => {
    setFormData({
      bankName: balance.bankName,
      accountType: balance.accountType,
      balance: balance.balance.toString(),
      date: balance.date
    });
    setEditingId(balance.id);
    setIsAddingBalance(true);
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      savings: 'bg-blue-100 text-blue-800',
      current: 'bg-green-100 text-green-800',
      fd: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const totalBalance = bankBalances.reduce((sum, balance) => sum + balance.balance, 0);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading bank balance data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Balance Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Total Bank Balance</div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">₹{totalBalance.toLocaleString()}</div>
            <div className="text-xs text-blue-500 mt-1">{bankBalances.length} accounts</div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Balance Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Bank Balance Tracker
            </CardTitle>
            <Button
              onClick={() => setIsAddingBalance(!isAddingBalance)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {editingId ? 'Update Balance' : 'Add Balance'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isAddingBalance && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., SBI, HDFC, ICICI"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={formData.accountType} onValueChange={(value) => setFormData({ ...formData, accountType: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="fd">Fixed Deposit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="balance">Current Balance (₹)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    required
                  />
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
                <Button type="submit">
                  {editingId ? 'Update Balance' : 'Add Balance'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingBalance(false);
                    setEditingId(null);
                    setFormData({
                      bankName: '',
                      accountType: 'savings',
                      balance: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Bank Balance List */}
          <div className="space-y-3">
            {bankBalances.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No bank balances recorded yet. Add your first bank account balance!
              </div>
            ) : (
              bankBalances.map((balance) => (
                <div key={balance.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{balance.bankName}</span>
                      <Badge className={getAccountTypeColor(balance.accountType)}>
                        {balance.accountType}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">Updated: {balance.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 text-lg">₹{balance.balance.toLocaleString()}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(balance)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBankBalance(balance.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default BankBalanceTracker;