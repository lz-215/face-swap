"use client";

import { useState } from "react";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Badge } from "~/ui/primitives/badge";
import { useAuth } from "~/hooks/use-auth";
import { useSimpleCredits } from "~/hooks/use-simple-credits";

interface DiagnosticResult {
  name: string;
  status: "success" | "warning" | "error";
  message: string;
  suggestion?: string;
}

export function FaceSwapDebug() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { balance } = useSimpleCredits();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // 1. 检查用户认证
    diagnostics.push({
      name: "用户认证",
      status: isAuthenticated ? "success" : "error",
      message: isAuthenticated
        ? `已登录用户: ${user?.email || "未知"}`
        : "用户未登录",
      suggestion: !isAuthenticated ? "请先登录才能使用换脸功能" : undefined,
    });

    // 2. 检查积分余额
    diagnostics.push({
      name: "积分余额",
      status: balance > 0 ? "success" : balance === 0 ? "warning" : "error",
      message: `当前余额: ${balance} 积分`,
      suggestion: balance <= 0 ? "积分不足，请充值后再使用" : undefined,
    });

    // 3. 检查Face++ API配置
    try {
      const response = await fetch("/api/face-swap/health", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        diagnostics.push({
          name: "Face++ API配置",
          status: data.configured ? "success" : "error",
          message: data.configured
            ? "Face++ API已正确配置"
            : "Face++ API未配置",
          suggestion: !data.configured
            ? "请在环境变量中设置FACEPP_API_KEY和FACEPP_API_SECRET"
            : undefined,
        });
      } else {
        diagnostics.push({
          name: "Face++ API配置",
          status: "error",
          message: "无法检查API配置状态",
          suggestion: "请检查服务器配置",
        });
      }
    } catch (error) {
      diagnostics.push({
        name: "Face++ API配置",
        status: "error",
        message: "API配置检查失败",
        suggestion: "请检查网络连接和服务器状态",
      });
    }

    // 3.5. 测试Face++ API连接
    try {
      const response = await fetch("/api/face-swap/test", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        diagnostics.push({
          name: "Face++ API连接测试",
          status: data.success ? "success" : "error",
          message: data.success
            ? "Face++ API连接正常"
            : `API连接失败: ${data.error}`,
          suggestion: !data.success
            ? `${
                data.details?.errorMessage || "请检查API密钥是否正确或网络连接"
              }`
            : undefined,
        });
      } else {
        diagnostics.push({
          name: "Face++ API连接测试",
          status: "error",
          message: "无法执行API连接测试",
          suggestion: "请检查服务器状态",
        });
      }
    } catch (error) {
      diagnostics.push({
        name: "Face++ API连接测试",
        status: "error",
        message: "API连接测试失败",
        suggestion: "请检查网络连接",
      });
    }

    // 4. 检查网络连接
    try {
      const startTime = Date.now();
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-cache",
      });
      const endTime = Date.now();
      const latency = endTime - startTime;

      diagnostics.push({
        name: "网络连接",
        status: response.ok
          ? latency < 1000
            ? "success"
            : "warning"
          : "error",
        message: response.ok ? `连接正常 (延迟: ${latency}ms)` : "网络连接异常",
        suggestion:
          latency > 1000 ? "网络延迟较高，可能影响换脸速度" : undefined,
      });
    } catch (error) {
      diagnostics.push({
        name: "网络连接",
        status: "error",
        message: "网络连接失败",
        suggestion: "请检查网络连接",
      });
    }

    // 5. 检查浏览器兼容性
    const isCompatible =
      typeof window !== "undefined" &&
      "File" in window &&
      "FileReader" in window &&
      "fetch" in window;

    diagnostics.push({
      name: "浏览器兼容性",
      status: isCompatible ? "success" : "error",
      message: isCompatible ? "浏览器支持所有必要功能" : "浏览器不支持某些功能",
      suggestion: !isCompatible
        ? "请使用现代浏览器（Chrome、Firefox、Safari、Edge）"
        : undefined,
    });

    setResults(diagnostics);
    setIsRunning(false);
  };

  const getStatusColor = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  const getStatusText = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "正常";
      case "warning":
        return "警告";
      case "error":
        return "错误";
      default:
        return "未知";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔧 系统诊断工具</span>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? "诊断中..." : "开始诊断"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 && !isRunning && (
          <div className="text-center text-muted-foreground py-8">
            点击"开始诊断"按钮检查系统配置
          </div>
        )}

        {isRunning && (
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            正在检查系统配置...
          </div>
        )}

        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    result.status
                  )}`}
                ></div>
                <span className="font-medium">{result.name}</span>
                <Badge
                  variant={
                    result.status === "success"
                      ? "default"
                      : result.status === "warning"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {getStatusText(result.status)}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{result.message}</p>

            {result.suggestion && (
              <div className="bg-primary/10 border border-primary/20 text-primary rounded p-2 mt-2">
                <p className="text-sm font-medium">💡 {result.suggestion}</p>
              </div>
            )}
          </div>
        ))}

        {results.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">诊断总结</h4>
            <div className="text-sm space-y-1">
              <div>
                ✅ 正常: {results.filter((r) => r.status === "success").length}{" "}
                项
              </div>
              <div>
                ⚠️ 警告: {results.filter((r) => r.status === "warning").length}{" "}
                项
              </div>
              <div>
                ❌ 错误: {results.filter((r) => r.status === "error").length} 项
              </div>
            </div>

            {results.some((r) => r.status === "error") && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ 发现配置问题，换脸功能可能无法正常工作
                </p>
                <p className="text-xs text-red-600 mt-1">
                  请根据上述建议解决问题后重新测试
                </p>
              </div>
            )}

            {results.every((r) => r.status === "success") && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700 font-medium">
                  🎉 所有检查通过，换脸功能应该可以正常工作！
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-muted-foreground space-y-1">
          <p>💡 如果问题持续存在：</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>查看浏览器控制台的错误信息</li>
            <li>检查环境变量配置</li>
            <li>参考 FACE_SWAP_SETUP.md 文档</li>
            <li>确认Face++账户状态和余额</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
