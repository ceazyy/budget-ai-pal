
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import SavingsGoal from '@/components/SavingsGoal';
import AlertPanel from '@/components/AlertPanel';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/finance';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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

  const financialSummary = getFinancialSummary(transactions);

  const handleAddTransaction = (transactionData: {
    description: string;
    amount: number;
    category: TransactionCategory;
  }) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...transactionData,
    };

    setTransactions([...transactions, newTransaction]);
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

        {/* Dashboard Summary */}
        <section className="mb-8">
          <Dashboard summary={financialSummary} />
        </section>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <AlertPanel alerts={mockBudgetAlerts} />
          </div>
          
          {/* Middle and Right columns */}
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
