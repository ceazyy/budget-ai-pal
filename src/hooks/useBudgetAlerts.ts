
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BudgetAlert, TransactionCategory } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useBudgetAlerts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchAlerts = async () => {
    if (!user) return [];
    
    // Get budget alerts
    const { data: alertsData, error: alertsError } = await supabase
      .from('budget_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);
    
    if (alertsError) throw alertsError;

    // Get current month's transactions for spending calculation
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .neq('category', 'income');
    
    if (transactionsError) throw transactionsError;

    // Calculate current spending by category
    const spendingByCategory: Record<string, number> = {};
    transactions.forEach(tx => {
      spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + tx.amount;
    });

    // Map to BudgetAlert objects
    const alerts: BudgetAlert[] = alertsData.map(alert => {
      const currentSpending = spendingByCategory[alert.category] || 0;
      const percentage = (currentSpending / alert.threshold) * 100;
      
      let severity: 'low' | 'medium' | 'high' = 'low';
      if (percentage >= 90) {
        severity = 'high';
      } else if (percentage >= 70) {
        severity = 'medium';
      }

      let message = '';
      if (percentage >= 90) {
        message = `You've almost reached your ${alert.category} budget`;
      } else if (percentage >= 70) {
        message = `You've spent ${Math.round(percentage)}% of your ${alert.category} budget`;
      } else {
        message = `Your ${alert.category} spending is within budget`;
      }

      return {
        id: alert.id,
        category: alert.category as TransactionCategory,
        threshold: alert.threshold,
        currentSpending,
        severity,
        message
      };
    });

    // Sort alerts by severity (high to low)
    return alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['budgetAlerts'],
    queryFn: fetchAlerts,
    enabled: !!user
  });
  
  // Function to update current spending for a category in Supabase
  const updateCategorySpending = async (category: TransactionCategory, amount: number) => {
    if (!user) return;
    
    try {
      const { data: alerts } = await supabase
        .from('budget_alerts')
        .select('id, current_spending')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('is_active', true);
      
      if (alerts && alerts.length > 0) {
        const newSpending = alerts[0].current_spending + amount;
        await supabase
          .from('budget_alerts')
          .update({ current_spending: newSpending })
          .eq('id', alerts[0].id);
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['budgetAlerts'] });
      }
    } catch (error) {
      console.error('Error updating budget alert spending:', error);
    }
  };
  
  const deleteAlert = async (alertId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('budget_alerts')
        .update({ is_active: false })
        .eq('id', alertId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Budget alert removed successfully');
      queryClient.invalidateQueries({ queryKey: ['budgetAlerts'] });
    } catch (error) {
      console.error('Error deleting budget alert:', error);
      toast.error('Failed to remove budget alert');
    }
  };

  return {
    alerts: data,
    isLoading,
    error,
    refetch,
    updateCategorySpending,
    deleteAlert
  };
};
