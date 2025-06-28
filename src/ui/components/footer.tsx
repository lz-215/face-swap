import Link from "next/link";
import { useTranslations } from 'next-intl';

export function Footer({ className }: { className?: string }) {
  const t = useTranslations();
  return (
    <footer className={`w-full border-t bg-[#181818] py-6 ${className ?? ""}`}>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-row gap-6 text-sm text-muted-foreground">
          <Link
            href="/terms"
            className="hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
            legacyBehavior>
            {t('TermsOfService.title')}
          </Link>
          <span>|</span>
          <Link
            href="/privacy"
            className="hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
            legacyBehavior>
            {t('PrivacyPolicy.title')}
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
} 