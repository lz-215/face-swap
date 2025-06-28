"use client";

import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase-client";
import { Card, CardHeader, CardTitle, CardContent } from "~/ui/primitives/card";
import { useCurrentUserOrRedirect } from "~/lib/supabase-auth-client";
import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const { user, isPending } = useCurrentUserOrRedirect();
  const t = useTranslations("Navbar");
  const tCommon = useTranslations("common");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("uploads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setHistory(data);
        setLoading(false);
      });
  }, [user?.id]);

  if (isPending) {
    return <div className="p-8 text-center">{tCommon("loading")}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl border-0 bg-white/90">
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-lg text-muted-foreground font-medium">
                {tCommon("loading")}
              </span>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-xl text-muted-foreground font-semibold tracking-wide">
                {t("noData", { defaultMessage: "暂无历史记录" })}
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">{t("preview")}</th>
                    <th className="px-2 py-1 text-left">{t("type")}</th>
                    <th className="px-2 py-1 text-left">{t("uploadedAt")}</th>
                    <th className="px-2 py-1 text-left">{t("credits")}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-2 py-1">
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt="preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="h-12 w-12 object-cover rounded"
                            controls
                          />
                        )}
                      </td>
                      <td className="px-2 py-1">{item.type}</td>
                      <td className="px-2 py-1">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-2 py-1">
                        {item.credit_consumed ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
