import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function SectionFaceSwapTypes() {
  const t = useTranslations('FaceSwapTypes');
  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full flex flex-col items-center mt-20 mb-10">
      <h2 className="text-4xl font-extrabold text-lime-400 mb-3 text-center drop-shadow-lg">{t('title')}</h2>
      <p className="text-lg text-neutral-300 mb-12 max-w-3xl text-center">{t('desc')}</p>
      <div className="flex flex-row gap-10 w-full justify-center">
        {/* Card 1: Festive Costume Dress-Up */}
        <div className="flex flex-col items-center w-80">
          {/* 上方图片区域：只显示一张合成效果图 */}
          <div className="relative w-72 h-44 rounded-xl overflow-hidden mb-0 flex items-center justify-center bg-black">
            <Image src="/images/demo7.jpg" alt="celebrity result" fill className="object-contain" />
          </div>
          {/* 下方内容区域 */}
          <div className="w-full bg-[#191a1e] rounded-2xl shadow-xl p-6 flex flex-col items-start mt-0">
            <h3 className="text-xl font-bold text-white mb-2">{t('card1Title')}</h3>
            <p className="text-sm text-neutral-300 mb-4">{t('card1Desc')}</p>
            <button className="w-full bg-lime-400 hover:bg-lime-300 text-[#191a1e] font-bold py-2 rounded-lg mt-auto transition flex items-center justify-center gap-2" onClick={handleScrollToTop}>{t('swapNow')} <span className="text-lg">›</span></button>
          </div>
        </div>
        {/* Card 2: Meme Face Swap */}
        <div className="flex flex-col items-center w-80">
          {/* 上方图片区域：只显示一张合成效果图 */}
          <div className="relative w-72 h-44 rounded-xl overflow-hidden mb-0 flex items-center justify-center bg-black">
            <Image src="/images/demo10.png" alt="movie result" fill className="object-contain" />
          </div>
          {/* 下方内容区域 */}
          <div className="w-full bg-[#191a1e] rounded-2xl shadow-xl p-6 flex flex-col items-start mt-0">
            <h3 className="text-xl font-bold text-white mb-2">{t('card2Title')}</h3>
            <p className="text-sm text-neutral-300 mb-4">{t('card2Desc')}</p>
            <button className="w-full bg-lime-400 hover:bg-lime-300 text-[#191a1e] font-bold py-2 rounded-lg mt-auto transition flex items-center justify-center gap-2" onClick={handleScrollToTop}>{t('swapNow')} <span className="text-lg">›</span></button>
          </div>
        </div>
        {/* Card 3: Anime Face Swap */}
        <div className="flex flex-col items-center w-80">
          {/* 上方图片区域：只显示一张合成效果图 */}
          <div className="relative w-72 h-44 rounded-xl overflow-hidden mb-0 flex items-center justify-center bg-black">
            <Image src="/images/demo6.jpg" alt="anime result" fill className="object-contain" />
          </div>
          {/* 下方内容区域 */}
          <div className="w-full bg-[#191a1e] rounded-2xl shadow-xl p-6 flex flex-col items-start mt-0">
            <h3 className="text-xl font-bold text-white mb-2">{t('card3Title')}</h3>
            <p className="text-sm text-neutral-300 mb-4">{t('card3Desc')}</p>
            <button className="w-full bg-lime-400 hover:bg-lime-300 text-[#191a1e] font-bold py-2 rounded-lg mt-auto transition flex items-center justify-center gap-2" onClick={handleScrollToTop}>{t('swapNow')} <span className="text-lg">›</span></button>
          </div>
        </div>
      </div>
    </section>
  );
} 