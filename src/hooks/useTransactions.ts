
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        toast.error('Failed to load transactions');
        throw error;
      }
      
      return data as Transaction[];
    },
    enabled: !!user, // Only run query if user is logged in
  });
};
