"use client";

import { Avatar, AvatarFallback } from "~/ui/primitives/avatar";
import { Button } from "~/ui/primitives/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCurrentUserOrRedirect } from '~/lib/supabase-auth-client';
import { useRouter } from "next/navigation";
import { supabase } from '~/lib/supabase-client';

// 全局图片数状态（可用context或localStorage实现，这里用localStorage简单演示）
function useImageCount() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const stored = localStorage.getItem("imageCount");
    setCount(stored ? parseInt(stored, 10) : 5); // 默认5张
  }, []);
  // 提供减少图片数的方法
  const decrement = () => {
    setCount((prev) => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem("imageCount", next.toString());
      return next;
    });
  };
  // 提供充值方法
  const recharge = (num: number) => {
    setCount(num);
    localStorage.setItem("imageCount", num.toString());
  };
  return { count, decrement, recharge };
}

export default function ProfilePageClient() {
  const t = useTranslations();
  const router = useRouter();
  const { isPending, user } = useCurrentUserOrRedirect();
  const { count, recharge } = useImageCount();
  const accountId = user?.id || "-";
  const accountEmail = user?.email || "-";
  const userName = "q az";
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem('isSubscribed') === 'true');

  // 续费提醒
  const showRecharge = count === 0;

  // 订阅按钮点击
  const handleSubscribe = () => {
    router.push('/pricing');
  };

  // 登出方法
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout error: " + error.message);
      return;
    }
    router.push("/");
  };

  // 监听订阅状态（假设/pricing订阅成功后会设置localStorage）
  useEffect(() => {
    const checkSub = () => setIsSubscribed(localStorage.getItem('isSubscribed') === 'true');
    window.addEventListener('storage', checkSub);
    return () => window.removeEventListener('storage', checkSub);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18191A]">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 text-4xl bg-orange-600">
            <AvatarFallback>q</AvatarFallback>
          </Avatar>
          <div className="mt-2 text-white text-lg font-bold">{userName}</div>
        </div>
        <div className="bg-[#232323] rounded-2xl p-6 w-[480px] text-white mb-8">
          <div className="flex justify-between py-2 border-b border-[#333]">
            <span>{t('profile.accountId', {defaultMessage: 'Account ID'})}</span>
            <span className="text-gray-300 break-all max-w-[335px] text-right">{accountId}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#333]">
            <span>{t('profile.account', {defaultMessage: 'Account'})}</span>
            <span className="text-gray-300">{accountEmail}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#333]">
            <span>{t('profile.remainingImages', {defaultMessage: 'Remaining Images'})}</span>
            <span className={count === 0 ? "text-red-400" : "text-yellow-400"}>{count}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>{t('profile.account', {defaultMessage: 'Account'})}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>{t('profile.logout', {defaultMessage: 'Log out'})}</Button>
          </div>
        </div>
        {/* 会员卡片 */}
        {!isSubscribed && (
        <div className="bg-[#232323] rounded-2xl p-8 w-[480px] flex flex-col items-center">
          <div className="flex flex-col items-center mb-4">
            <div className="mb-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#B0B0B0"/></svg>
            </div>
            {showRecharge ? (
              <>
                <div className="text-red-400 text-lg font-bold mb-2">{t('Payment.recharge', {defaultMessage: 'No images left, please recharge!'})}</div>
                <Button className="bg-lime-400 text-black w-full text-lg font-bold rounded-xl py-2 hover:bg-lime-300" onClick={() => recharge(5)}>{t('Payment.rechargeCredits', {defaultMessage: 'Recharge'})}</Button>
              </>
            ) : (
              <>
                <div className="text-white text-lg font-bold mb-2">{t('profile.notMember', {defaultMessage: 'You are not a member yet'})}</div>
                <div className="text-gray-400 text-sm mb-4 text-center">{t('profile.subscribeTip', {defaultMessage: 'Subscribe to access VIP benefits and choose your ideal plan'})}</div>
                <Button className="bg-lime-400 text-black w-full text-lg font-bold rounded-xl py-2 hover:bg-lime-300" onClick={handleSubscribe}>{t('profile.subscribe', {defaultMessage: 'Subscribe'})}</Button>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
