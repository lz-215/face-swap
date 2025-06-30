"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

import { SEO_CONFIG } from "~/app";
import { supabaseAuth } from "~/lib/supabase-auth-client";
import { GitHubIcon } from "~/ui/components/icons/github";
import { GoogleIcon } from "~/ui/components/icons/google";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";

interface SignInPageClientProps {
  signInTitle: string;
  signInSubtitle: string;
  githubButton: string;
  googleButton: string;
  githubLoginError: string;
  googleLoginError: string;
  thirdPartyLoginError: string;
  termsText: string;
  termsLink: string;
  andText: string;
  privacyLink: string;
}

export function SignInPageClient({
  signInTitle,
  signInSubtitle,
  githubButton,
  googleButton,
  githubLoginError,
  googleLoginError,
  thirdPartyLoginError,
  termsText,
  termsLink,
  andText,
  privacyLink,
}: SignInPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as "en" | "zh";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 检查 URL 参数中是否有错误信息
  const errorFromParams = searchParams.get("error");

  useEffect(() => {
    if (errorFromParams === "callback_error") {
      setError(thirdPartyLoginError);
    }
  }, [errorFromParams, thirdPartyLoginError]);

  const handleGitHubLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await supabaseAuth.signInWithOAuth("github");
    } catch (err) {
      setError(githubLoginError);
      console.error(err);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await supabaseAuth.signInWithOAuth("google");
    } catch (err) {
      setError(googleLoginError);
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900" />

      {/* 动态背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full md:grid-cols-2">
        {/* Left side - Enhanced Image */}
        <div className="relative hidden md:flex md:items-center md:justify-center">
          <div className="relative w-full h-full">
            <Image
              alt="Sign-in background image"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 0vw, 50vw"
              src="https://images.unsplash.com/photo-1719811059181-09032aef07b8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/30 to-indigo-800/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Brand overlay */}
            <div className="absolute bottom-12 left-12 z-20">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  {SEO_CONFIG.name[locale]}
                </h1>
                <p className="max-w-md text-lg text-white/90 drop-shadow-md">
                  {SEO_CONFIG.slogan[locale]}
                </p>
                <div className="flex items-center space-x-2 text-white/80">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  <span className="text-sm font-medium">AI驱动的创新体验</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced Login form */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                <svg
                  className="w-8 h-8 text-white"
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {signInTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {signInSubtitle}
              </p>
            </div>

            {/* Login Card */}
            <Card className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 shadow-2xl">
              <CardContent className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">
                      {error}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* GitHub Button */}
                  <Button
                    className="group relative w-full h-14 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                    disabled={loading}
                    onClick={handleGitHubLogin}
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      <GitHubIcon className="h-5 w-5" />
                      <span className="font-semibold">{githubButton}</span>
                    </div>
                    {loading && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </Button>

                  {/* Google Button */}
                  <Button
                    className="group relative w-full h-14 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    size="lg"
                    variant="outline"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 dark:from-gray-700 dark:to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      <GoogleIcon className="h-5 w-5" />
                      <span className="font-semibold">{googleButton}</span>
                    </div>
                    {loading && (
                      <div className="absolute inset-0 bg-white/50 dark:bg-gray-700/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {termsText}{" "}
                <a
                  href="/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {termsLink}
                </a>{" "}
                {andText}{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {privacyLink}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
