import { BarChart, LogOut, Crown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { supabaseAuth } from "~/lib/supabase-auth-client";
import { useSubscription } from "~/lib/hooks/use-subscription";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { CurrentUserAvatar } from "../current-user-avatar";

interface HeaderUserDropdownProps {
  isDashboard: boolean;
  userEmail: string;
  userImage?: null | string;
  userName: string;
}

export function HeaderUserDropdown({
  isDashboard = false,
  userEmail,
  userImage,
  userName,
}: HeaderUserDropdownProps) {
  const t = useTranslations("Navbar");
  const { hasActiveSubscription, subscriptions, isLoading } = useSubscription();

  const handleSignOut = async () => {
    try {
      await supabaseAuth.signOutWithRedirect();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // 获取当前活跃订阅信息
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active"
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative overflow-hidden rounded-full"
          size="icon"
          variant="ghost"
        >
          <CurrentUserAvatar />
          {/* 会员标识小图标 */}
          {hasActiveSubscription && !isLoading && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <div className="flex items-center gap-2">
              {userName && <p className="font-medium">{userName}</p>}
              {/* 会员标识徽章 */}
              {hasActiveSubscription && !isLoading && (
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {t("member", { defaultMessage: "会员" })}
                </Badge>
              )}
            </div>
            {userEmail && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {userEmail}
              </p>
            )}
            {/* 订阅状态信息 */}
            {!isLoading && activeSubscription && (
              <div className="text-xs text-muted-foreground">
                <p className="text-green-600 font-medium">
                  {t("activeSubscription", { defaultMessage: "订阅已激活" })}
                </p>
                {activeSubscription.productId && (
                  <p className="truncate">
                    {t("plan", { defaultMessage: "套餐" })}:{" "}
                    {activeSubscription.productId}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Dashboard 链接 */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <BarChart className="mr-2 h-4 w-4" />
            {t("dashboard")}
          </Link>
        </DropdownMenuItem>

        {/* 会员中心/账单管理 */}
        {hasActiveSubscription && !isLoading && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/billing">
              <Crown className="mr-2 h-4 w-4" />
              {t("memberCenter", { defaultMessage: "会员中心" })}
            </Link>
          </DropdownMenuItem>
        )}

        {/* 充值/升级 */}
        {!hasActiveSubscription && !isLoading && (
          <DropdownMenuItem asChild>
            <Link href="/pricing">
              <Crown className="mr-2 h-4 w-4" />
              {t("upgradeToMember", { defaultMessage: "升级会员" })}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* 退出登录 */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
