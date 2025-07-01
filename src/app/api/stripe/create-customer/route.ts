import { type NextRequest, NextResponse } from "next/server";

import { createCustomer } from "~/api/payments/stripe-service";
import { getCurrentSupabaseUser } from "~/lib/supabase-auth";

/**
 * 创建 Stripe 客户的 API 端点
 * 确保客户与当前登录用户正确关联
 */
export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const user = await getCurrentSupabaseUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 },
      );
    }

    const { email, name } = await request.json().catch(() => ({}));
    
    // 使用用户信息或传入的信息
    const customerEmail = email || user.email;
    const customerName = name || user.user_metadata?.name || user.user_metadata?.full_name || customerEmail?.split('@')[0];

    if (!customerEmail) {
      return NextResponse.json(
        { error: "邮箱地址是必需的" },
        { status: 400 },
      );
    }

    console.log(`[create-customer] 为用户 ${user.id} 创建 Stripe 客户`, {
      userId: user.id,
      email: customerEmail,
      name: customerName,
    });

    // 创建 Stripe 客户
    const customer = await createCustomer(user.id, customerEmail, customerName);

    console.log(`[create-customer] Stripe 客户创建成功: ${customer.id}`);

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
    });

  } catch (error: any) {
    console.error("[create-customer] 创建 Stripe 客户失败:", error);
    
    return NextResponse.json(
      { 
        error: error.message || "创建客户失败",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
} 