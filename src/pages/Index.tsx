
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTransactions } from '@/hooks/useTransactions';
import { getFinancialSummary } from '@/utils/financeCalculations';
import { getMockBudgetAlerts, getMockForecastData, getMockSavingsRecommendation } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';
import FinanceLayout from '@/components/FinanceLayout';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

const Index = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions, 
    error: transactionsError,
    refetch 
  } = useTransactions();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (transactionsError) {
      toast.error('Failed to load transactions');
      console.error('Error loading transactions:', transactionsError);
    }
  }, [transactionsError]);

  const handleAddTransaction = async (transactionData: {
    description: string;
    amount: number;
    category: any;
  }) => {
    if (!user) {
      toast.error('You must be logged in to add transactions');
      return;
    }
    
    try {
      // Prepare transaction data with current date and user ID
      const newTransaction = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        ...transactionData
      };
      
      const { error } = await supabase.from('transactions').insert(newTransaction);
      
      if (error) throw error;
      
      // Refresh transactions data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error('Failed to add transaction');
    }
  };

  // Mock data for components that aren't yet connected to Supabase
  const mockBudgetAlerts = getMockBudgetAlerts();
  const mockForecastData = getMockForecastData();
  const mockSavingsRecommendation = getMockSavingsRecommendation();

  // Get financial summary from transactions
  const financialSummary = getFinancialSummary(transactions);

  // Show loading state while initializing
  if (isInitializing || isLoadingTransactions) {
    return <LoadingState />;
  }

  // Show error state if there was an error loading transactions
  if (transactionsError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader onSignOut={handleSignOut} />
        
        <FinanceLayout
          financialSummary={financialSummary}
          transactions={transactions}
          alerts={mockBudgetAlerts}
          forecastData={mockForecastData}
          savingsRecommendation={mockSavingsRecommendation}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
