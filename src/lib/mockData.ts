
import { Transaction, ForecastData, SavingsRecommendation, BudgetAlert } from '@/types/finance';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: generateId(),
    date: '2025-04-15',
    description: 'Monthly Salary',
    amount: 3000,
    category: 'income',
  },
  {
    id: generateId(),
    date: '2025-04-02',
    description: 'Apartment Rent',
    amount: -1200,
    category: 'housing',
  },
  {
    id: generateId(),
    date: '2025-04-05',
    description: 'Grocery Shopping',
    amount: -85.75,
    category: 'food',
  },
  {
    id: generateId(),
    date: '2025-04-08',
    description: 'Electricity Bill',
    amount: -65.42,
    category: 'utilities',
  },
  {
    id: generateId(),
    date: '2025-04-10',
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'entertainment',
  },
  {
    id: generateId(),
    date: '2025-04-12',
    description: 'Gas Station',
    amount: -45.30,
    category: 'transport',
  },
  {
    id: generateId(),
    date: '2025-04-18',
    description: 'Restaurant Dinner',
    amount: -78.25,
    category: 'food',
  },
  {
    id: generateId(),
    date: '2025-04-20',
    description: 'Movie Theater',
    amount: -28.50,
    category: 'entertainment',
  },
  {
    id: generateId(),
    date: '2025-04-22',
    description: 'Water Bill',
    amount: -35.80,
    category: 'utilities',
  },
  {
    id: generateId(),
    date: '2025-04-25',
    description: 'Public Transportation',
    amount: -25.00,
    category: 'transport',
  }
];

// Mock forecast data
export const mockForecastData: ForecastData[] = [
  { category: 'food', predicted: 320, actual: 164 },
  { category: 'housing', predicted: 1200, actual: 1200 },
  { category: 'transport', predicted: 100, actual: 70.3 },
  { category: 'utilities', predicted: 130, actual: 101.22 },
  { category: 'entertainment', predicted: 150, actual: 44.49 },
  { category: 'other', predicted: 200, actual: 0 }
];

// Mock savings recommendation
export const mockSavingsRecommendation: SavingsRecommendation = {
  goal: 500,
  currentSavings: 300,
  tips: [
    'Reduce eating out to save an additional $50',
    'Consider a cheaper entertainment subscription',
    'Try carpooling to save on transportation'
  ]
};

// Mock budget alerts
export const mockBudgetAlerts: BudgetAlert[] = [
  {
    id: generateId(),
    category: 'food',
    message: 'You have spent 80% of your food budget',
    threshold: 200,
    currentSpending: 164,
    severity: 'medium'
  },
  {
    id: generateId(),
    category: 'entertainment',
    message: 'You have almost reached your entertainment budget',
    threshold: 50,
    currentSpending: 44.49,
    severity: 'high'
  }
];

// Calculate financial summary from transactions
export const getFinancialSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
  
  // Find top expense category
  let topCategory = { name: 'other' as const, amount: 0 };
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    if (amount > topCategory.amount && category !== 'income') {
      topCategory = { 
        name: category as Transaction['category'], 
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
