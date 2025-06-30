import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import { supabaseClient } from '~/lib/supabase-auth-client';

interface CreditsState {
  balance: number;
  isLoading: boolean;
  error: string | null;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: 'recharge' | 'consumption' | 'refund' | 'bonus' | 'subscription' | 'expiration';
  description?: string;
  createdAt: string;
  balanceAfter: number;
}

export function useCredits() {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<CreditsState>({
    balance: 0,
    isLoading: true,
    error: null,
  });

  // 获取用户积分余额
  const fetchCredits = async () => {
    if (!user || !isAuthenticated) {
      setCredits({ balance: 0, isLoading: false, error: null });
      return;
    }

    try {
      setCredits(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabaseClient
        .from('user_credit_balance')
        .select('balance')
        .eq('userId', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 用户积分记录不存在，创建初始记录
          const { data: newBalance, error: createError } = await supabaseClient
            .from('user_credit_balance')
            .insert({
              id: crypto.randomUUID(),
              userId: user.id,
              balance: 5, // 新用户赠送5个积分
              totalRecharged: 5,
              totalConsumed: 0,
            })
            .select('balance')
            .single();

          if (createError) {
            throw createError;
          }

          setCredits({
            balance: newBalance?.balance || 5,
            isLoading: false,
            error: null,
          });
        } else {
          throw error;
        }
      } else {
        setCredits({
          balance: data?.balance || 0,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setCredits({
        balance: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load credits',
      });
    }
  };

  // 消费积分
  const consumeCredits = async (amount: number, description?: string): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      throw new Error('User not authenticated');
    }

    if (credits.balance < amount) {
      throw new Error('Insufficient credits');
    }

    try {
      // 开始事务：更新余额并记录交易
      const { data, error } = await supabaseClient.rpc('consume_credits', {
        user_id: user.id,
        amount_to_consume: amount,
        transaction_description: description || 'Face swap operation',
      });

      if (error) {
        throw error;
      }

      // 更新本地状态
      setCredits(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - amount),
      }));

      return true;
    } catch (error) {
      console.error('Failed to consume credits:', error);
      throw error;
    }
  };

  // 获取积分交易历史
  const getCreditHistory = async (): Promise<CreditTransaction[]> => {
    if (!user || !isAuthenticated) {
      return [];
    }

    try {
      const { data, error } = await supabaseClient
        .from('credit_transaction')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch credit history:', error);
      return [];
    }
  };

  // 充值积分
  const rechargeCredits = async (amount: number, paymentIntentId: string): Promise<boolean> => {
    if (!user || !isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabaseClient.rpc('recharge_credits', {
        user_id: user.id,
        amount_to_add: amount,
        payment_intent_id: paymentIntentId,
      });

      if (error) {
        throw error;
      }

      // 刷新积分余额
      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Failed to recharge credits:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user, isAuthenticated]);

  return {
    balance: credits.balance,
    isLoading: credits.isLoading,
    error: credits.error,
    consumeCredits,
    rechargeCredits,
    getCreditHistory,
    refreshCredits: fetchCredits,
  };
}

// 为了向后兼容，保留原有的useImageCount接口
export function useImageCount() {
  const { balance, consumeCredits } = useCredits();
  
  return {
    count: balance,
    decrement: () => consumeCredits(1, 'Face swap operation'),
  };
} 