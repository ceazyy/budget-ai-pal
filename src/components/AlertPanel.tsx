
import { Card } from '@/components/ui/card';
import { BudgetAlert } from '@/types/finance';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface AlertPanelProps {
  alerts: BudgetAlert[];
}

const AlertPanel = ({ alerts }: AlertPanelProps) => {
  if (alerts.length === 0) {
    return (
      <Card className="finance-card">
        <h2 className="text-lg font-medium mb-4">Budget Alerts</h2>
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          <Info className="mr-2 h-5 w-5" />
          <p>No active alerts</p>
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
            <div key={alert.id} className="border-l-4 pl-4 py-1 bg-gray-50 rounded" 
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
                  <p className="text-xs text-gray-500">Category: {alert.category}</p>
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
