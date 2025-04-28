
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { TransactionCategory } from '@/types/finance';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
  }) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('other');
  const [isExpense, setIsExpense] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onAddTransaction({
      description,
      amount: isExpense ? -amountValue : amountValue,
      category: isExpense ? category : 'income',
    });

    toast.success('Transaction added successfully!');
    setDescription('');
    setAmount('');
    setCategory('other');
  };

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={isExpense}
              onChange={() => setIsExpense(true)}
              className="w-4 h-4 text-primary"
            />
            <span>Expense</span>
          </Label>
          <Label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={!isExpense}
              onChange={() => setIsExpense(false)}
              className="w-4 h-4 text-finance-income"
            />
            <span>Income</span>
          </Label>
        </div>

        {isExpense && (
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as TransactionCategory)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Card>
  );
};

export default TransactionForm;
