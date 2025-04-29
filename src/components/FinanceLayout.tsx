
import React from 'react';
import { FinancialSummary, BudgetAlert, ForecastData, SavingsRecommendation, Transaction } from '@/types/finance';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import SavingsGoal from '@/components/SavingsGoal';
import AlertPanel from '@/components/AlertPanel';
import BudgetForm from '@/components/BudgetForm';

interface FinanceLayoutProps {
  financialSummary: FinancialSummary;
  transactions: Transaction[];
  alerts: BudgetAlert[];
  forecastData: ForecastData[];
  savingsRecommendation: SavingsRecommendation;
  onAddTransaction: (transactionData: {
    description: string;
    amount: number;
    category: any;
  }) => Promise<void>;
  isLoadingAlerts?: boolean;
  onDeleteAlert?: (alertId: string) => Promise<void>;
  onBudgetAdded?: () => void;
}

const FinanceLayout = ({
  financialSummary,
  transactions,
  alerts,
  forecastData,
  savingsRecommendation,
  onAddTransaction,
  isLoadingAlerts = false,
  onDeleteAlert,
  onBudgetAdded = () => {},
}: FinanceLayoutProps) => {
  return (
    <>
      <section className="mb-8">
        <Dashboard summary={financialSummary} />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <TransactionForm onAddTransaction={onAddTransaction} />
          <BudgetForm onBudgetAdded={onBudgetAdded} />
          <AlertPanel 
            alerts={alerts} 
            onDeleteAlert={onDeleteAlert}
            isLoading={isLoadingAlerts} 
          />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <ExpenseChart forecastData={forecastData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SavingsGoal recommendation={savingsRecommendation} />
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceLayout;
