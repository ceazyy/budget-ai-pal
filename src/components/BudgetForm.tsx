
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TransactionCategory } from '@/types/finance';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const expenseCategories: TransactionCategory[] = [
  'housing',
  'food',
  'transport',
  'utilities',
  'entertainment',
  'savings',
  'other'
];

const categoryLabels: Record<TransactionCategory, string> = {
  income: 'Income',
  housing: 'Housing',
  food: 'Food',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  savings: 'Savings',
  other: 'Other',
};

interface BudgetFormProps {
  onBudgetAdded: () => void;
}

const BudgetForm = ({ onBudgetAdded }: BudgetFormProps) => {
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [threshold, setThreshold] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !threshold) {
      toast.error('Please fill in all fields');
      return;
    }

    const thresholdValue = parseFloat(threshold);
    if (isNaN(thresholdValue) || thresholdValue <= 0) {
      toast.error('Please enter a valid threshold amount');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to set budgets');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if budget alert for this category already exists
      const { data: existingAlerts } = await supabase
        .from('budget_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category);
      
      let result;
      
      if (existingAlerts && existingAlerts.length > 0) {
        // Update existing alert
        result = await supabase
          .from('budget_alerts')
          .update({ 
            threshold: thresholdValue,
            is_active: true
          })
          .eq('id', existingAlerts[0].id);
      } else {
        // Create new alert
        result = await supabase
          .from('budget_alerts')
          .insert({
            user_id: user.id,
            category,
            threshold: thresholdValue,
            current_spending: 0,
            is_active: true
          });
      }

      if (result.error) throw result.error;
      
      toast.success(`Budget for ${categoryLabels[category]} set successfully!`);
      setThreshold('');
      onBudgetAdded();
    } catch (error) {
      console.error("Error setting budget:", error);
      toast.error('Failed to set budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Set Budget Limit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="budget-category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as TransactionCategory)}
          >
            <SelectTrigger id="budget-category" className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="budget-threshold">Budget Limit (₹)</Label>
          <Input
            id="budget-threshold"
            type="number"
            min="1"
            step="1"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Setting Budget...' : 'Set Budget Limit'}
        </Button>
      </form>
    </Card>
  );
};

export default BudgetForm;
