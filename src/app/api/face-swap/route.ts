import { NextRequest, NextResponse } from "next/server";

const FACEPP_API_KEY = "p7Z__8_rUR-lC8iaG2xM7n-0tFNPistX";
const FACEPP_API_SECRET = "Gn22mMIoMexwd8WQlLmCx7q4sBk2W6pz"; // TODO: 填写您的api_secret  "https://api-cn.faceplusplus.com/imagepp/v1/mergeface"; 
const FACEPP_MERGEFACE_URL = "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const origin = formData.get("origin") as File;
    const face = formData.get("face") as File;
    if (!origin || !face) {
      return NextResponse.json({ error: "缺少图片参数" }, { status: 400 });
    }

    // 构造Face++ API请求
    const apiForm = new FormData();
    apiForm.append("api_key", FACEPP_API_KEY);
    apiForm.append("api_secret", FACEPP_API_SECRET);
    apiForm.append("template_file", origin);
    apiForm.append("merge_file", face);
    apiForm.append("merge_rate", "100"); // 合成比例100%

    const faceppRes = await fetch(FACEPP_MERGEFACE_URL, {
      method: "POST",
      body: apiForm,
    });
    const faceppData = (await faceppRes.json()) as { result?: string; error_message?: string };
    if (!faceppData.result) {
      return NextResponse.json({ error: faceppData.error_message || "Face++换脸失败" }, { status: 500 });
    }

    // 返回base64图片或可选上传到Supabase后返回URL
    return NextResponse.json({ result: faceppData.result });
  } catch (err) {
    console.error("Face++换脸API错误", err);
    return NextResponse.json({ error: "服务端错误" }, { status: 500 });
  }
} 