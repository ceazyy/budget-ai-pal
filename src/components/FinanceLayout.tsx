
import React from 'react';
import { FinancialSummary, BudgetAlert, ForecastData, SavingsRecommendation, Transaction } from '@/types/finance';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import IncomeForm from '@/components/IncomeForm';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';
import SavingsGoal from '@/components/SavingsGoal';
import AlertPanel from '@/components/AlertPanel';

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
}

const FinanceLayout = ({
  financialSummary,
  transactions,
  alerts,
  forecastData,
  savingsRecommendation,
  onAddTransaction,
}: FinanceLayoutProps) => {
  return (
    <>
      <section className="mb-8">
        <Dashboard summary={financialSummary} />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <IncomeForm onAddIncome={onAddTransaction} />
          <TransactionForm onAddTransaction={onAddTransaction} />
          <AlertPanel alerts={alerts} />
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
