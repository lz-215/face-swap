"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";

import { SEO_CONFIG } from "~/app";
import { supabaseAuth } from "~/lib/supabase-auth-client";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";

interface ForgotPasswordPageClientProps {
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendResetButton: string;
  sendingResetButton: string;
  successMessage: string;
  errorMessage: string;
  backToSignIn: string;
}

export function ForgotPasswordPageClient({
  forgotPasswordTitle,
  forgotPasswordSubtitle,
  emailLabel,
  emailPlaceholder,
  sendResetButton,
  sendingResetButton,
  successMessage,
  errorMessage,
  backToSignIn,
}: ForgotPasswordPageClientProps) {
  const locale = useLocale() as "en" | "zh";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: resetError } = await supabaseAuth.resetPassword(email);

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err) {
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        grid h-screen w-screen
        md:grid-cols-2
      `}
    >
      {/* Left side - Image */}
      <div
        className={`
          relative hidden
          md:block
        `}
      >
        <Image
          alt="Forgot password background image"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 0vw, 50vw"
          src="https://images.unsplash.com/photo-1719811059181-09032aef07b8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
        />
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-background/80 to-transparent
          `}
        />
        <div className="absolute bottom-8 left-8 z-10 text-white">
          <h1 className="text-3xl font-bold">{SEO_CONFIG.name[locale]}</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            {SEO_CONFIG.slogan[locale]}
          </p>
        </div>
      </div>
      {/* Right side - Forgot password form */}
      <div
        className={`
          flex items-center justify-center p-4
          md:p-8
        `}
      >
        <div className="w-full max-w-md space-y-4">
          <div
            className={`
              space-y-4 text-center
              md:text-left
            `}
          >
            <h2 className="text-3xl font-bold">{forgotPasswordTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {forgotPasswordSubtitle}
            </p>
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="pt-2">
              {success ? (
                <div className="space-y-4 text-center">
                  <div className="text-sm font-medium text-green-600">
                    {successMessage}
                  </div>
                  <Link
                    className={`
                      text-primary underline-offset-4
                      hover:underline
                    `}
                    href="/auth/sign-in"
                  >
                    {backToSignIn}
                  </Link>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="email">{emailLabel}</Label>
                    <Input
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={emailPlaceholder}
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  {error && (
                    <div className="text-sm font-medium text-destructive">
                      {error}
                    </div>
                  )}
                  <Button className="w-full" disabled={loading} type="submit">
                    {loading ? sendingResetButton : sendResetButton}
                  </Button>
                </form>
              )}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                  className={`
                    text-primary underline-offset-4
                    hover:underline
                  `}
                  href="/auth/sign-in"
                >
                  {backToSignIn}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
