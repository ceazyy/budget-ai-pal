
import React from 'react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  onSignOut: () => Promise<void>;
}

const PageHeader = ({ onSignOut }: PageHeaderProps) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="mt-1 text-gray-500">Your collaborative personal finance manager</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <Button className="bg-primary text-white">Sync Accounts</Button>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
