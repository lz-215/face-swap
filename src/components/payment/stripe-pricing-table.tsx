"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "~/lib/hooks/use-auth";

interface StripePricingTableProps {
  pricingTableId?: string;
  publishableKey?: string;
  className?: string;
  customerEmail?: string;
}

interface CreateCustomerResponse {
  success: boolean;
  customerId: string;
  email: string;
  name: string;
  error?: string;
}

export function StripePricingTable({
  pricingTableId = "prctbl_1RfcfrP9YNEyAXtbdnk9VKvw",
  publishableKey = "pk_test_51RR7rMP9YNEyAXtb8NSf2BNWkL0qepSqdJKuTNMNrSJoGOVoRjeuqTh2HoRDUCaMiuuhAaoB3WkjUNNHczHmezrA00BXOxxszr",
  className = "",
  customerEmail,
}: StripePricingTableProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // 加载 Stripe 定价表脚本
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://js.stripe.com/v3/pricing-table.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://js.stripe.com/v3/pricing-table.js";
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Stripe pricing table script");
        setCustomerError("无法加载支付组件");
      };
      document.head.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  // 当用户登录后，创建或获取 Stripe 客户
  useEffect(() => {
    if (isAuthenticated && user?.email && !customerId && !customerError) {
      const createOrGetCustomer = async () => {
        try {
          console.log(
            "[StripePricingTable] 正在创建 Stripe 客户...",
            user.email
          );

          const response = await fetch("/api/stripe/create-customer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: customerEmail || user.email,
              name:
                user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                user.email?.split("@")[0],
            }),
          });

          const data = (await response.json()) as CreateCustomerResponse;

          if (!response.ok) {
            throw new Error(data.error || "创建客户失败");
          }

          console.log(
            "[StripePricingTable] Stripe 客户创建成功:",
            data.customerId
          );
          setCustomerId(data.customerId);
        } catch (error) {
          console.error("[StripePricingTable] 创建 Stripe 客户失败:", error);
          setCustomerError(
            error instanceof Error ? error.message : "创建客户失败"
          );
        }
      };

      createOrGetCustomer();
    }
  }, [isAuthenticated, user, customerId, customerError, customerEmail]);

  // 加载状态
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div
        className={`text-center p-8 bg-gray-50 rounded-lg border ${className}`}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          请先登录以查看价格方案
        </h3>
        <p className="text-gray-600 mb-4">您需要登录后才能购买积分套餐</p>
        <a
          href="/auth/sign-in"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          立即登录
        </a>
      </div>
    );
  }

  // 错误状态
  if (customerError) {
    return (
      <div
        className={`text-center p-8 bg-red-50 rounded-lg border border-red-200 ${className}`}
      >
        <h3 className="text-lg font-semibold text-red-900 mb-2">加载失败</h3>
        <p className="text-red-600 mb-4">{customerError}</p>
        <button
          onClick={() => {
            setCustomerError(null);
            setCustomerId(null);
          }}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 正在创建客户
  if (!customerId) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在准备支付方案...</p>
        </div>
      </div>
    );
  }

  // 用户已登录且客户已创建，渲染定价表
  const effectiveCustomerEmail = customerEmail || user?.email || "";

  return (
    <div className={className}>
      {isScriptLoaded && effectiveCustomerEmail && customerId ? (
        React.createElement("stripe-pricing-table", {
          "pricing-table-id": pricingTableId,
          "publishable-key": publishableKey,
          "customer-email": effectiveCustomerEmail,
          "client-reference-id": user?.id, // 传递用户 ID 作为参考
          "customer-id": customerId, // 传递 Stripe 客户 ID
        })
      ) : (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载定价表...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StripePricingTable;
