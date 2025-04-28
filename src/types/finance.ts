
export type TransactionCategory = 
  | 'income'
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'savings'
  | 'other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
}

export interface ForecastData {
  category: TransactionCategory;
  predicted: number;
  actual: number;
}

export interface SavingsRecommendation {
  goal: number;
  tips: string[];
  currentSavings: number;
}

export interface BudgetAlert {
  id: string;
  category: TransactionCategory;
  message: string;
  threshold: number;
  currentSpending: number;
  severity: 'low' | 'medium' | 'high';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategory: {
    name: TransactionCategory;
    amount: number;
  };
}
