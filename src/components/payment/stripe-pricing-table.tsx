"use client";

import React, { useEffect } from "react";

interface StripePricingTableProps {
  pricingTableId?: string;
  publishableKey?: string;
  className?: string;
}

export function StripePricingTable({
  pricingTableId = "prctbl_1RfcfrP9YNEyAXtbdnk9VKvw",
  publishableKey = "pk_test_51RR7rMP9YNEyAXtb8NSf2BNWkL0qepSqdJKuTNMNrSJoGOVoRjeuqTh2HoRDUCaMiuuhAaoB3WkjUNNHczHmezrA00BXOxxszr",
  className = "",
}: StripePricingTableProps) {
  useEffect(() => {
    // 检查是否已经加载了 Stripe 定价表脚本
    if (
      !document.querySelector(
        'script[src="https://js.stripe.com/v3/pricing-table.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://js.stripe.com/v3/pricing-table.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={className}>
      {React.createElement("stripe-pricing-table", {
        "pricing-table-id": pricingTableId,
        "publishable-key": publishableKey,
      })}
    </div>
  );
}

export default StripePricingTable;
