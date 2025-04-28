
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Transaction, FinancialSummary } from '@/types/finance';
import { ArrowDown, ArrowUp, DollarSign, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardProps {
  summary: FinancialSummary;
}

const Dashboard = ({ summary }: DashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Income Card */}
      <Card className="finance-card">
        <div className="flex justify-between items-center mb-2">
          <span className="stat-label">Total Income</span>
          <div className="h-8 w-8 bg-finance-income bg-opacity-20 flex items-center justify-center rounded-full">
            <ArrowUp className="h-4 w-4 text-finance-income" />
          </div>
        </div>
        <div className="stat-value text-finance-income">
          {formatCurrency(summary.totalIncome)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Monthly earnings</div>
      </Card>

      {/* Expenses Card */}
      <Card className="finance-card">
        <div className="flex justify-between items-center mb-2">
          <span className="stat-label">Total Expenses</span>
          <div className="h-8 w-8 bg-finance-expense bg-opacity-20 flex items-center justify-center rounded-full">
            <ArrowDown className="h-4 w-4 text-finance-expense" />
          </div>
        </div>
        <div className="stat-value text-finance-expense">
          {formatCurrency(summary.totalExpenses)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Monthly spending</div>
      </Card>

      {/* Savings Card */}
      <Card className="finance-card">
        <div className="flex justify-between items-center mb-2">
          <span className="stat-label">Net Savings</span>
          <div className="h-8 w-8 bg-finance-savings bg-opacity-20 flex items-center justify-center rounded-full">
            <DollarSign className="h-4 w-4 text-finance-savings" />
          </div>
        </div>
        <div className={`stat-value ${summary.netSavings >= 0 ? 'text-finance-income' : 'text-finance-expense'}`}>
          {formatCurrency(summary.netSavings)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {summary.netSavings >= 0 ? 'You\'re saving!' : 'Spending deficit'}
        </div>
      </Card>

      {/* Top Expense Card */}
      <Card className="finance-card">
        <div className="flex justify-between items-center mb-2">
          <span className="stat-label">Top Expense</span>
          <div className="h-8 w-8 bg-gray-100 flex items-center justify-center rounded-full">
            <PieChart className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div className="stat-value" style={{color: `var(--tw-color-finance-${summary.topCategory.name})`}}>
          {formatCurrency(summary.topCategory.amount)}
        </div>
        <div className="text-xs text-gray-500 mt-1 capitalize">
          {summary.topCategory.name}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
