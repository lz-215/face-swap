import { useTranslations } from "next-intl";
import { SYSTEM_CONFIG } from "~/app";
import { getCurrentSupabaseUserOrRedirect } from "~/lib/supabase-auth";

import { SignInPageClient } from "./page.client";

export default async function SignInPage() {
  await getCurrentSupabaseUserOrRedirect(
    undefined,
    SYSTEM_CONFIG.redirectAfterSignIn,
    true
  );
  const t = useTranslations("SignIn");

  return (
    <SignInPageClient
      signInTitle={t("signInTitle")}
      signInSubtitle={t("signInSubtitle")}
      emailLabel={t("emailLabel")}
      emailPlaceholder={t("emailPlaceholder")}
      passwordLabel={t("passwordLabel")}
      forgotPasswordLink={t("forgotPasswordLink")}
      signInButton={t("signInButton")}
      signingInButton={t("signingInButton")}
      continueWithSeparator={t("continueWithSeparator")}
      githubButton={t("githubButton")}
      googleButton={t("googleButton")}
      noAccountPrompt={t("noAccountPrompt")}
      signUpLink={t("signUpLink")}
      successMessage={t("successMessage")}
      invalidCredentialsError={t("invalidCredentialsError")}
      githubLoginError={t("githubLoginError")}
      googleLoginError={t("googleLoginError")}
      thirdPartyLoginError={t("thirdPartyLoginError")}
    />
  );
}
