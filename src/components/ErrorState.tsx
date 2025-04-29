
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-finance-expense mb-4">Error loading your financial data</p>
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
