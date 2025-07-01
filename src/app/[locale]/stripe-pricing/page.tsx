import { useTranslations } from "next-intl";
import { StripePricingTable } from "~/components/payment/stripe-pricing-table";

export default function StripePricingPage() {
  const t = useTranslations("Payment");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {t("choosePlan", { defaultMessage: "Choose Your Plan" })}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pricingSubtitle", {
              defaultMessage:
                "Select the perfect plan for your needs. All plans include our core features with different usage limits.",
            })}
          </p>
        </div>

        {/* Stripe 定价表组件 */}
        <div className="flex justify-center">
          <StripePricingTable
            className="w-full max-w-5xl"
            pricingTableId="prctbl_1RfcfrP9YNEyAXtbdnk9VKvw"
            publishableKey="pk_test_51RR7rMP9YNEyAXtb8NSf2BNWkL0qepSqdJKuTNMNrSJoGOVoRjeuqTh2HoRDUCaMiuuhAaoB3WkjUNNHczHmezrA00BXOxxszr"
          />
        </div>

        {/* 额外的信息部分 */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("instantAccess", { defaultMessage: "Instant Access" })}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("instantAccessDesc", {
                  defaultMessage:
                    "Start using all features immediately after subscription",
                })}
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("securePayments", { defaultMessage: "Secure Payments" })}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("securePaymentsDesc", {
                  defaultMessage:
                    "Your payment information is protected by Stripe's security",
                })}
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("cancelAnytime", { defaultMessage: "Cancel Anytime" })}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("cancelAnytimeDesc", {
                  defaultMessage:
                    "No long-term commitments. Cancel your subscription anytime",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
