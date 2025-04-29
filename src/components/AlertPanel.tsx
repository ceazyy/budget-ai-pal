
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BudgetAlert } from '@/types/finance';
import { AlertCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface AlertPanelProps {
  alerts: BudgetAlert[];
  onDeleteAlert?: (alertId: string) => Promise<void>;
  isLoading?: boolean;
}

const AlertPanel = ({ alerts, onDeleteAlert, isLoading = false }: AlertPanelProps) => {
  if (isLoading) {
    return (
      <Card className="finance-card">
        <h2 className="text-lg font-medium mb-4">Budget Alerts</h2>
        <div className="flex items-center justify-center p-4">
          <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin mr-2"></div>
          <p>Loading alerts...</p>
        </div>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="finance-card">
        <h2 className="text-lg font-medium mb-4">Budget Alerts</h2>
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          <Info className="mr-2 h-5 w-5" />
          <p>No active alerts. Set budget limits to see alerts here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="finance-card">
      <h2 className="text-lg font-medium mb-4">Budget Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const percentage = Math.round((alert.currentSpending / alert.threshold) * 100);
          
          // Determine progress bar color based on severity
          const progressBarColor = 
            alert.severity === 'high' 
              ? 'bg-finance-expense' 
              : alert.severity === 'medium' 
                ? 'bg-finance-utilities' 
                : 'bg-finance-other';
          
          return (
            <div key={alert.id} className="border-l-4 pl-4 py-1 bg-gray-50 rounded flex flex-col" 
              style={{ 
                borderLeftColor: 
                  alert.severity === 'high' 
                    ? 'var(--tw-color-finance-expense)' 
                    : alert.severity === 'medium' 
                      ? 'var(--tw-color-finance-utilities)' 
                      : 'var(--tw-color-finance-other)' 
              }}
            >
              <div className="flex items-start">
                {alert.severity === 'high' ? (
                  <AlertCircle className="h-5 w-5 text-finance-expense shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-finance-utilities shrink-0 mt-0.5" />
                )}
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="mt-2 mb-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>
                        {formatCurrency(alert.currentSpending)} of {formatCurrency(alert.threshold)}
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-1.5 ${progressBarColor}`} 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 capitalize">Category: {alert.category}</p>
                    {onDeleteAlert && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteAlert(alert.id)}
                        className="h-7 px-2 text-gray-500 hover:text-finance-expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AlertPanel;
