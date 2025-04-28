
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SavingsRecommendation } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';

interface SavingsGoalProps {
  recommendation: SavingsRecommendation;
}

const SavingsGoal = ({ recommendation }: SavingsGoalProps) => {
  const { goal, currentSavings, tips } = recommendation;
  
  // Calculate percentage of goal achieved
  const percentage = Math.min(Math.round((currentSavings / goal) * 100), 100);

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Savings Goal</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Current</span>
          <span className="text-sm font-medium">{formatCurrency(currentSavings)}</span>
        </div>
        <Progress value={percentage} className="h-2 bg-gray-200" />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">{percentage}% of goal</span>
          <span className="text-sm font-medium">Goal: {formatCurrency(goal)}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm mb-2">Saving Tips:</h3>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-finance-savings mr-2">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default SavingsGoal;
