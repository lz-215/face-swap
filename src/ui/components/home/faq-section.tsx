'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

// Neon green plus icon
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M16 7v18M7 16h18" stroke="#B6FF1C" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
// Neon green minus icon
function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M7 16h18" stroke="#B6FF1C" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function FAQSection() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
  ];

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[#191b1c] w-full py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-center text-4xl font-extrabold mb-12 text-[#B6FF1C]">{t('faqsTitle')}</h2>
        <ul className="space-y-7">
          {faqs.map((item, i) => (
            <li key={i} className="flex flex-col gap-2 text-lg md:text-xl text-white">
              <button
                className="flex items-center gap-4 w-full text-left focus:outline-none"
                onClick={() => handleToggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="flex-shrink-0">
                  {openIndex === i ? <MinusIcon /> : <PlusIcon />}
                </span>
                <span className="cursor-pointer">{item.q}</span>
              </button>
              {openIndex === i && (
                <div
                  id={`faq-answer-${i}`}
                  className="pl-12 pr-2 pt-1 pb-2 text-base md:text-lg text-neutral-200 animate-fade-in"
                >
                  {item.a}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
} 