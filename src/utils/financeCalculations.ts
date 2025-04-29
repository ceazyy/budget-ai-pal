
import { Transaction, TransactionCategory, FinancialSummary } from '@/types/finance';

export const getFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
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
