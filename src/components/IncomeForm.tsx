
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { TransactionCategory } from '@/types/finance';

interface IncomeFormProps {
  onAddIncome: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
  }) => void;
}

const IncomeForm = ({ onAddIncome }: IncomeFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

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

    onAddIncome({
      description,
      amount: amountValue,
      category: 'income',
    });

    toast.success('Income added successfully!');
    setDescription('');
    setAmount('');
  };

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="income-description">Income Source</Label>
          <Input
            id="income-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Salary, Freelance"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="income-amount">Amount (₹)</Label>
          <Input
            id="income-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full bg-finance-income hover:bg-finance-income/90">
          Add Income
        </Button>
      </form>
    </Card>
  );
};

export default IncomeForm;
