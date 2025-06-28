'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '~/ui/primitives/button';

export function FinalVideoSection() {
  const t = useTranslations('Home');

  return (
    <section
      className={`
        from-primary to-primary/80 py-20
        dark:bg-black bg-[#181818]
      `}
    >
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* 顶部大标题和副标题 */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-lime-400 mb-2 text-center">
          {t('finalVideoTitle')}
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-10 text-center max-w-2xl">
          {t('finalVideoDesc')}
        </p>
        {/* 视频区域 */}
        <div className="w-full max-w-3xl bg-[#232323] rounded-2xl shadow-lg p-6 flex flex-col items-center mb-10">
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
            className="rounded-xl w-full max-h-[420px] bg-black"
            poster="https://zvcxdyuidlhzvmhsviwc.supabase.co/storage/v1/object/public/images/colorized-2.png"
          />
        </div>
        {/* 底部按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <Button
            asChild
            className="px-8 py-4 text-lg font-semibold bg-lime-400 hover:bg-lime-500 text-black"
            size="lg"
            variant="secondary"
          >
            <Link href="/face-swap" legacyBehavior>
              {t('getStartNow')}
            </Link>
          </Button>
          <Button
            asChild
            className="px-8 py-4 text-lg font-semibold border border-lime-400 text-lime-400 bg-transparent hover:bg-lime-400 hover:text-black"
            size="lg"
            variant="outline"
          >
            <Link href="/pricing" legacyBehavior>
              {t('getPremium')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
