import { getCurrentSupabaseUser } from "~/lib/supabase-auth";
import { StripePricingTable } from "~/components/payment/stripe-pricing-table";

export default async function TestPricingPage() {
  const user = await getCurrentSupabaseUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          积分充值测试页面
        </h1>

        {user ? (
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              用户信息
            </h2>
            <div className="space-y-2 text-sm text-green-700">
              <p>
                <strong>用户ID:</strong> {user.id}
              </p>
              <p>
                <strong>邮箱:</strong> {user.email}
              </p>
              <p>
                <strong>用户名:</strong>{" "}
                {user.user_metadata?.name ||
                  user.user_metadata?.full_name ||
                  "未设置"}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              未登录
            </h2>
            <p className="text-yellow-700">请先登录以测试积分充值功能。</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">测试说明</h2>
          <div className="prose text-gray-600">
            <p>此页面用于测试 Stripe 定价表的积分充值功能：</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>✅ 用户认证检查 - 确保只有登录用户可以购买</li>
              <li>✅ 自动创建 Stripe 客户 - 与用户账户关联</li>
              <li>✅ 传递用户信息 - customer-email 和 client-reference-id</li>
              <li>✅ Webhook 处理 - 订阅成功后自动增加积分</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">积分充值</h2>
          <StripePricingTable className="w-full" />
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">预期行为</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>1. 完成支付后，Stripe 会发送 webhook 事件到服务器</p>
            <p>2. 服务器会根据订阅金额自动计算并添加相应积分</p>
            <p>3. 积分会立即添加到您的账户余额中</p>
            <p>4. 您可以在用户面板中查看积分余额变化</p>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              开发者信息
            </h3>
            <div className="space-y-2 text-sm text-gray-600 font-mono">
              <p>Stripe 测试模式: 使用测试卡号 4242 4242 4242 4242</p>
              <p>Webhook 端点: /api/webhooks/stripe</p>
              <p>积分服务: /api/credits/*</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
