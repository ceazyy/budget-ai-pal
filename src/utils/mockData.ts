
import { BudgetAlert, ForecastData, SavingsRecommendation } from '@/types/finance';

export const getMockBudgetAlerts = (): BudgetAlert[] => [
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

export const getMockForecastData = (): ForecastData[] => [
  { category: 'food', predicted: 320, actual: 164 },
  { category: 'housing', predicted: 1200, actual: 1200 },
  { category: 'transport', predicted: 100, actual: 70.3 },
  { category: 'utilities', predicted: 130, actual: 101.22 },
  { category: 'entertainment', predicted: 150, actual: 44.49 },
  { category: 'other', predicted: 200, actual: 0 }
];

export const getMockSavingsRecommendation = (): SavingsRecommendation => ({
  goal: 500,
  currentSavings: 300,
  tips: [
    'Reduce eating out to save an additional $50',
    'Consider a cheaper entertainment subscription',
    'Try carpooling to save on transportation'
  ]
});
