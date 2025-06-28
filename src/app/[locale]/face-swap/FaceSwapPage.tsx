"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const demoOrigin = "/face-demo-origin.jpg";
const demoFace = "/face-demo-face.jpg";
const demoResult = "/face-demo-result.jpg";
const demoTemplates = [
  "/images/temp1.png",
  "/images/temp2.png",
  "/images/temp3.png",
  "/images/temp4.png",
  "/images/temp5.png",
  "/images/temp6.png",
  "/images/temp7.png",
  "/images/temp8.png",
  "/images/temp9.png",
];

// 引入图片数hook
function useImageCount() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const stored = localStorage.getItem("imageCount");
    setCount(stored ? parseInt(stored, 10) : 5);
  }, []);
  const decrement = () => {
    setCount((prev) => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem("imageCount", next.toString());
      return next;
    });
  };
  return { count, decrement };
}

export default function FaceSwapPage() {
  const [origin, setOrigin] = useState<string | null>(null);
  const [face, setFace] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [split, setSplit] = useState(50); // 百分比
  const [fullscreen, setFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [templateClickStep, setTemplateClickStep] = useState<0 | 1>(0); // 0: origin, 1: face
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("FaceSwap");
  const router = useRouter();
  const { count, decrement } = useImageCount();

  useEffect(() => {
    const template = searchParams.get("template");
    if (template) {
      setOrigin(template);
    }
    // eslint-disable-next-line
  }, []);

  // 处理图片上传
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "origin" | "face"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "origin") setOrigin(url);
      else setFace(url);
    }
  };

  // 换脸
  const handleSwap = async () => {
    // 检查剩余图片数
    if (count <= 0) {
      alert(
        t("Payment.recharge", {
          defaultMessage: "No images left, please recharge!",
        })
      );
      return;
    }
    // 检查登录状态（用localStorage的token或session，实际可用更安全的方式）
    const isLoggedIn = !!localStorage.getItem("sb-access-token");
    if (!isLoggedIn) {
      router.push("/auth/sign-up"); // 跳转到注册页
      return;
    }
    if (!origin || !face) return;
    setLoading(true);
    try {
      // 获取图片文件对象
      const originFile = await urlToFile(origin, "origin.jpg");
      const faceFile = await urlToFile(face, "face.jpg");
      const formData = new FormData();
      formData.append("origin", originFile);
      formData.append("face", faceFile);
      const res = await fetch("/api/face-swap", {
        method: "POST",
        body: formData,
      });
      const data: any = await res.json();
      if (data.result) {
        setResult(`data:image/jpeg;base64,${data.result}`);
        decrement(); // 换脸成功后图片数减一
      } else {
        alert(data.error || "Face swap failed");
      }
    } catch (e) {
      alert("Face swap error");
    }
    setLoading(false);
  };

  // 辅助函数：将本地URL转为File对象
  async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  // 拖动分割线
  const handleDrag = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let percent = (x / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSplit(percent);
  };

  // 下载图片
  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "face-swap-result.png";
    link.click();
  };

  // 新增模板点击处理函数
  const handleTemplateClick = (tpl: string) => {
    if (templateClickStep === 0) {
      setOrigin(tpl);
      setTemplateClickStep(1);
    } else {
      setFace(tpl);
      setTemplateClickStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#191a1e] text-white flex flex-col items-center py-4 font-sans">
      {/* Top Title */}
      <h1 className="text-5xl font-extrabold text-lime-400 mb-2 text-center drop-shadow-2xl">
        {t("mainTitle")}
      </h1>
      <p className="text-lg text-neutral-300 mb-6 max-w-2xl text-center font-medium">
        {t("mainDesc")}
      </p>
      {/* Tabs */}
      <div className="flex flex-row gap-3 mb-8">
        <button className="bg-lime-400 text-[#191a1e] font-bold px-5 py-2 rounded-lg shadow-lg hover:bg-lime-300 transition">
          {t("tabPhoto")}
        </button>
        {/* <button className="bg-neutral-800 text-lime-400 font-bold px-5 py-2 rounded-lg border border-lime-400 hover:bg-neutral-700 transition">{t('tabVideo')}</button> */}
        {/* <button className="bg-neutral-800 text-lime-400 font-bold px-5 py-2 rounded-lg border border-lime-400 hover:bg-neutral-700 transition">{t('tabMultiple')}</button> */}
      </div>
      {/* Main Card */}
      <div className="flex flex-row gap-8 bg-[#23242a] rounded-3xl p-4 shadow-2xl mb-8 border-2 border-neutral-700 max-w-5xl w-full">
        {/* Left Steps */}
        <div className="flex flex-col gap-6 w-[254px]">
          {/* Step 1 */}
          <div className="bg-[#23242a] rounded-xl flex flex-row px-0 py-0">
            <div className="flex flex-col items-center justify-start px-3 pt-1">
              <span className="w-9 h-9 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center font-extrabold text-lg bg-transparent">
                1
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 justify-center">
              <span className="font-extrabold text-base text-white leading-tight">
                {t("step1Title")}
              </span>
              <div className="flex items-center gap-2 mt-2 mb-1">
                {origin && (
                  <img
                    src={origin}
                    alt="origin-thumb"
                    className="w-10 h-10 rounded-full object-cover border-2 border-lime-400"
                  />
                )}
                <label className="w-[150px] bg-lime-400 text-[#191a1e] font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-lime-300 transition shadow-lg text-[15px] cursor-pointer whitespace-nowrap">
                  {origin ? t("changeImage") : t("uploadImage")}{" "}
                  <span className="text-lg">⬆️</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "origin")}
                  />
                </label>
              </div>
              <div className="text-xs text-neutral-400">
                {t("uploadFormats")}
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="bg-[#23242a] rounded-xl flex flex-row px-0 py-0">
            <div className="flex flex-col items-center justify-start px-3 pt-1">
              <span className="w-9 h-9 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center font-extrabold text-lg bg-transparent">
                2
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 justify-center">
              <span className="font-extrabold text-base text-white leading-tight">
                {t("step2Title")}
              </span>
              <div className="flex items-center gap-2 mt-2 mb-1">
                {face && (
                  <img
                    src={face}
                    alt="face-thumb"
                    className="w-10 h-10 rounded-full object-cover border-2 border-lime-400"
                  />
                )}
                <label
                  className={`w-[150px] ${
                    origin
                      ? "bg-lime-400 text-[#191a1e] hover:bg-lime-300 cursor-pointer"
                      : "bg-lime-900 text-lime-400 cursor-not-allowed opacity-60"
                  } font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg text-[15px] whitespace-nowrap`}
                >
                  {face ? t("changeImage") : t("uploadImage")}{" "}
                  <span className="text-lg">⬆️</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleUpload(e, "face")}
                    disabled={!origin}
                  />
                </label>
              </div>
              <div className="text-xs text-neutral-400">PNG/JPG/JPEG/WEBP</div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="bg-[#23242a] rounded-xl flex flex-row px-0 py-0">
            <div className="flex flex-col items-center justify-start px-3 pt-1">
              <span className="w-9 h-9 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center font-extrabold text-lg bg-transparent">
                3
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-1 justify-center">
              <span className="font-extrabold text-base text-white leading-tight">
                {t("step3Title")}
              </span>
              <button
                className={`w-[180px] ml-0 font-bold py-2 rounded-lg mt-2 flex items-center justify-center gap-2 shadow-lg text-base ${
                  origin && face && !loading
                    ? "bg-lime-400 text-[#191a1e] hover:bg-lime-300 cursor-pointer transition"
                    : "bg-lime-400 text-[#191a1e] opacity-60 cursor-not-allowed"
                }`}
                onClick={origin && face && !loading ? handleSwap : undefined}
                disabled={!(origin && face) || loading}
              >
                {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                {t("swapBtn")}
              </button>
            </div>
          </div>
        </div>
        {/* Right Preview */}
        <div className="flex flex-col items-center justify-center w-[680px] h-[416px] p-4">
          <div
            ref={previewRef}
            className={`relative w-full h-full bg-neutral-700 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-neutral-600 shadow-lg ${
              fullscreen ? "scale-125" : ""
            }`}
            style={{ transition: "transform 0.2s" }}
          >
            {/* 联动：未换脸前只显示原图，换脸后显示分割对比 */}
            {loading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-lime-400 text-2xl animate-spin mb-2">
                  ⏳
                </span>
                <span className="text-neutral-300">{t("swapping")}</span>
              </div>
            ) : origin && result ? (
              <>
                {/* Before图层 */}
                <img
                  src={origin}
                  alt="before"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                />
                {/* After图层 */}
                <img
                  src={result}
                  alt="after"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{ clipPath: `inset(0 0 0 ${split}%)` }}
                />
                {/* 分割线 */}
                <div
                  className="absolute top-0 left-0 h-full w-0.5 bg-lime-400 z-10"
                  style={{
                    left: `${split}%`,
                    width: "3px",
                    marginLeft: "-1.5px",
                    cursor: "ew-resize",
                  }}
                  onMouseDown={() => setDragging(true)}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime-400 rounded-full w-8 h-8 flex items-center justify-center text-[#191a1e] font-bold text-2xl shadow-lg border-2 border-white cursor-ew-resize select-none">
                    ↔
                  </div>
                </div>
                {/* Before/After 标签 */}
                <span className="absolute top-2 left-4 bg-black/60 px-2 py-1 rounded text-xs font-bold">
                  {t("before", { defaultMessage: "Before" })}
                </span>
                <span className="absolute top-2 right-4 bg-black/60 px-2 py-1 rounded text-xs font-bold">
                  {t("after", { defaultMessage: "After" })}
                </span>
              </>
            ) : origin ? (
              <img
                src={origin}
                alt="origin-preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-neutral-400 text-lg">
                {t("pleaseUpload")}
              </span>
            )}
          </div>
          {/* 拖动事件监听 */}
          {dragging && !loading && (
            <div
              className="fixed inset-0 z-50"
              style={{ cursor: "ew-resize" }}
              onMouseMove={handleDrag}
              onMouseUp={() => setDragging(false)}
            />
          )}
          {/* 操作按钮 */}
          <div className="flex flex-row gap-4 mt-4">
            <button
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 transition"
              onClick={() => setFullscreen(true)}
              disabled={loading}
            >
              🔍 {t("zoomIn", { defaultMessage: "Zoom In" })}
            </button>
            {origin && result && !loading && (
              <button
                className="bg-lime-400 text-[#191a1e] px-4 py-2 rounded-lg font-bold hover:bg-lime-300 transition flex items-center gap-2"
                onClick={handleDownload}
              >
                <span>{t("download", { defaultMessage: "Download" })}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Unlock Features */}
      <div className="bg-[#191a1e] rounded-xl flex flex-col gap-2 w-full max-w-3xl mb-8">
        <div className="flex flex-row w-full items-end gap-8">
          <div className="flex-1 flex flex-col items-start">
            <span className="text-lime-400 text-xl font-bold flex items-center gap-2 mb-4">
              {" "}
              <span className="text-2xl">💎</span>{" "}
              {t("unlockAllFeatures", {
                defaultMessage: "Unlock all features",
              })}
            </span>
            <div className="flex flex-col gap-1 text-lime-400 text-sm w-[366px] h-[81px] mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-lime-400">✔</span> {t("featureImage")}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-400">✔</span>{" "}
                {t("featureNoWatermark")}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end flex-1">
            <button className="bg-lime-400 hover:bg-lime-300 text-[#191a1e] font-bold px-6 py-2 rounded-lg shadow transition flex items-center gap-2 mb-4 self-start">
              <span>{t("upgradeNow", { defaultMessage: "Upgrade Now" })}</span>
              <span className="text-lg">▼</span>
            </button>
            <div className="flex flex-col gap-1 text-lime-400 text-sm w-[366px] h-[81px] mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-lime-400">✔</span> {t("featurePriority")}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-400">✔</span> {t("feature120Images")}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Templates */}
      <div className="flex flex-row gap-5 mt-2 mb-8">
        {demoTemplates.map((tpl, i) => (
          <div
            key={i}
            className="w-[81px] h-[81px] rounded-xl overflow-hidden bg-neutral-700 flex items-center justify-center border-2 border-neutral-600 hover:border-lime-400 transition cursor-pointer"
            onClick={() => handleTemplateClick(tpl)}
          >
            <Image
              src={tpl}
              alt={`template${i + 1}`}
              width={81}
              height={81}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <button
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 transition"
              onClick={() => {
                setFullscreen(false);
                setDragging(false);
              }}
            >
              {t("close", { defaultMessage: "Close" })}
            </button>
          </div>
          <div
            ref={previewRef}
            className="relative w-[80vw] h-[80vh] bg-neutral-700 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-neutral-600 shadow-lg"
            style={{ maxWidth: 1200, maxHeight: 800 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-lime-400 text-2xl animate-spin mb-2">
                  ⏳
                </span>
                <span className="text-neutral-300">{t("swapping")}</span>
              </div>
            ) : origin && result ? (
              <>
                <img
                  src={origin}
                  alt="before"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                />
                <img
                  src={result}
                  alt="after"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{ clipPath: `inset(0 0 0 ${split}%)` }}
                />
                <div
                  className="absolute top-0 left-0 h-full w-0.5 bg-lime-400 z-10"
                  style={{
                    left: `${split}%`,
                    width: "3px",
                    marginLeft: "-1.5px",
                    cursor: "ew-resize",
                  }}
                  onMouseDown={() => setDragging(true)}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lime-400 rounded-full w-8 h-8 flex items-center justify-center text-[#191a1e] font-bold text-2xl shadow-lg border-2 border-white cursor-ew-resize select-none">
                    ↔
                  </div>
                </div>
                <span className="absolute top-2 left-4 bg-black/60 px-2 py-1 rounded text-xs font-bold">
                  {t("before", { defaultMessage: "Before" })}
                </span>
                <span className="absolute top-2 right-4 bg-black/60 px-2 py-1 rounded text-xs font-bold">
                  {t("after", { defaultMessage: "After" })}
                </span>
              </>
            ) : origin ? (
              <img
                src={origin}
                alt="origin-preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-neutral-400 text-lg">
                {t("pleaseUpload")}
              </span>
            )}
            {dragging && !loading && (
              <div
                className="fixed inset-0 z-50"
                style={{ cursor: "ew-resize" }}
                onMouseMove={handleDrag}
                onMouseUp={() => setDragging(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
