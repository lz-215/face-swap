import { getTranslations } from "next-intl/server";
import { SignUpForm } from "~/ui/components/sign-up-form";

export default async function Page() {
  const t = await getTranslations("SignUpPage");
  const dictionary = {
    pageTitle: t("pageTitle"),
    pageDescription: t("pageDescription"),
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    passwordLabel: t("passwordLabel"),
    emailInUseError: t("emailInUseError"),
    signUpError: t("signUpError"),
    githubSignUpError: t("githubSignUpError"),
    googleSignUpError: t("googleSignUpError"),
    createAccountButton: t("createAccountButton"),
    creatingAccountButton: t("creatingAccountButton"),
    orContinueWith: t("orContinueWith"),
    haveAccount: t("haveAccount"),
    signIn: t("signIn"),
  };
  return <SignUpForm dictionary={dictionary} />;
}
