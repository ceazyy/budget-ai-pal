import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import IncomeForm from '@/components/IncomeForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import SavingsGoal from '@/components/SavingsGoal';
import AlertPanel from '@/components/AlertPanel';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Transaction, TransactionCategory, FinancialSummary, BudgetAlert, ForecastData, SavingsRecommendation } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const expensesByCategory = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    
    let topCategory = { name: 'other' as TransactionCategory, amount: 0 };
    
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > topCategory.amount && category !== 'income') {
        topCategory = { 
          name: category as TransactionCategory,
          amount 
        };
      }
    });

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      topCategory
    };
  };

  const financialSummary = getFinancialSummary(transactions);

  const handleAddTransaction = async (transactionData: {
    description: string;
    amount: number;
    category: TransactionCategory;
  }) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        ...transactionData
      });
      
      if (error) throw error;
      
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error('Failed to add transaction');
    }
  };

  const mockBudgetAlerts: BudgetAlert[] = [
    {
      id: '1',
      category: 'food',
      message: 'You have spent 80% of your food budget',
      threshold: 200,
      currentSpending: 164,
      severity: 'medium'
    },
    {
      id: '2',
      category: 'entertainment',
      message: 'You have almost reached your entertainment budget',
      threshold: 50,
      currentSpending: 44.49,
      severity: 'high'
    }
  ];
  
  const mockForecastData: ForecastData[] = [
    { category: 'food', predicted: 320, actual: 164 },
    { category: 'housing', predicted: 1200, actual: 1200 },
    { category: 'transport', predicted: 100, actual: 70.3 },
    { category: 'utilities', predicted: 130, actual: 101.22 },
    { category: 'entertainment', predicted: 150, actual: 44.49 },
    { category: 'other', predicted: 200, actual: 0 }
  ];
  
  const mockSavingsRecommendation: SavingsRecommendation = {
    goal: 500,
    currentSavings: 300,
    tips: [
      'Reduce eating out to save an additional $50',
      'Consider a cheaper entertainment subscription',
      'Try carpooling to save on transportation'
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-lg">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="mt-1 text-gray-500">Your collaborative personal finance manager</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-4">
              <Button className="bg-primary text-white">Sync Accounts</Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <Dashboard summary={financialSummary} />
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <IncomeForm onAddIncome={handleAddTransaction} />
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <AlertPanel alerts={mockBudgetAlerts} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <ExpenseChart forecastData={mockForecastData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SavingsGoal recommendation={mockSavingsRecommendation} />
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
