import Link from "next/link";
import { CheckCircle, Crown, CreditCard, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function PaymentSuccessPage() {
  const t = useTranslations("PaymentSuccess");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800 mb-2">
              {t("paymentSuccess", { defaultMessage: "支付成功！" })}
            </CardTitle>
            <div className="flex justify-center">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Crown className="w-3 h-3 mr-1" />
                {t("membershipActivated", { defaultMessage: "会员已激活" })}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-700 text-lg">
                {t("paymentProcessed", {
                  defaultMessage: "您的支付已成功处理，会员特权已生效！",
                })}
              </p>
              <p className="text-gray-500 text-sm">
                {t("creditsNote", {
                  defaultMessage: "积分将在几分钟内自动添加到您的账户",
                })}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                {t("memberBenefits", { defaultMessage: "会员特权" })}
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {t("benefit1", { defaultMessage: "更多积分赠送" })}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {t("benefit2", { defaultMessage: "优先客服支持" })}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  {t("benefit3", { defaultMessage: "专属功能访问" })}
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/dashboard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t("viewDashboard", { defaultMessage: "查看仪表板" })}
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/billing">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t("manageMembership", { defaultMessage: "管理会员" })}
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                {t("thankYou", { defaultMessage: "感谢您选择我们的服务！" })}
              </p>
              <Link
                href="/face-swap"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
              >
                {t("startUsing", { defaultMessage: "开始使用AI换脸" })}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
