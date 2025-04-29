
import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Transaction deleted successfully');
      // Invalidate the query cache to refresh the transactions list
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="finance-card">
        <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
        <p className="text-muted-foreground text-sm">No transactions found.</p>
      </Card>
    );
  }

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium">{transaction.description}</p>
              <div className="flex items-center mt-1">
                <span 
                  className={`category-badge bg-opacity-20 bg-finance-${transaction.category}`}
                  style={{ color: `var(--tw-color-finance-${transaction.category})` }}
                >
                  {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                </span>
                <span className="text-xs text-gray-500 ml-2">{transaction.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className={transaction.amount >= 0 ? "text-finance-income font-medium" : "text-finance-expense font-medium"}
              >
                {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-finance-expense"
                onClick={() => handleDelete(transaction.id)}
                disabled={deletingId === transaction.id}
              >
                {deletingId === transaction.id ? (
                  <div className="h-4 w-4 border-2 border-t-gray-400 rounded-full animate-spin"/>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionList;
