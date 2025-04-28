
import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
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
            <div>
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
            <div 
              className={transaction.amount >= 0 ? "text-finance-income font-medium" : "text-finance-expense font-medium"}
            >
              {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionList;
