"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useMounted } from "~/lib/hooks/use-mounted";
import { supabaseAuth } from "~/lib/supabase-auth-client";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

export function SignOutPageClient() {
  const router = useRouter();
  const mounted = useMounted();
  const t = useTranslations("Navigation");

  const handlePageBack = async () => {
    router.back();
  };

  const handleSignOut = async () => {
    try {
      await supabaseAuth.signOutWithRedirect();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div
      className={`
        flex w-auto flex-col-reverse justify-center gap-2
        sm:flex-row
      `}
    >
      <Button onClick={handlePageBack} size="default" variant="outline">
        Go back
        <span className="sr-only">Previous page</span>
      </Button>
      {mounted ? (
        <Button onClick={handleSignOut} size="default" variant="secondary">
          {t("signOut")}
          <span className="sr-only">
            This action will log you out of your account.
          </span>
        </Button>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "default", variant: "secondary" }),
            "bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
    </div>
  );
}
