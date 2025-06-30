"use client";

import { useTranslations } from "next-intl";

interface FeaturePromotionProps {
  onUpgrade?: () => void;
  className?: string;
}

export function FeaturePromotion({
  onUpgrade,
  className = "",
}: FeaturePromotionProps) {
  const t = useTranslations("FaceSwap");

  const containerClasses = `bg-white rounded-xl flex flex-col gap-2 w-full max-w-3xl p-6 border-2 border-slate-200 ${className}`;
  const titleClasses =
    "text-slate-900 text-xl font-bold flex items-center gap-2 mb-4";
  const featureListClasses =
    "flex flex-col gap-1 text-slate-600 text-sm w-[366px] h-[81px] mt-auto";
  const checkmarkIconClasses = "text-green-500";

  return (
    <div className={containerClasses}>
      <div className="flex flex-row w-full items-end gap-8">
        <div className="flex-1 flex flex-col items-start">
          <span className={titleClasses}>
            <span className="text-2xl">💎</span>
            {t("unlockAllFeatures", {
              defaultMessage: "Unlock all features",
            })}
          </span>
          <div className={featureListClasses}>
            <div className="flex items-center gap-2">
              <span className={checkmarkIconClasses}>✔</span>{" "}
              {t("featureImage")}
            </div>
            <div className="flex items-center gap-2">
              <span className={checkmarkIconClasses}>✔</span>
              {t("featureNoWatermark")}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded-lg shadow transition flex items-center gap-2 mb-4 self-start"
            onClick={onUpgrade}
          >
            <span>{t("upgradeNow", { defaultMessage: "Upgrade Now" })}</span>
            <span className="text-lg">▼</span>
          </button>
          <div className={featureListClasses}>
            <div className="flex items-center gap-2">
              <span className={checkmarkIconClasses}>✔</span>{" "}
              {t("featurePriority")}
            </div>
            <div className="flex items-center gap-2">
              <span className={checkmarkIconClasses}>✔</span>{" "}
              {t("feature120Images")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
