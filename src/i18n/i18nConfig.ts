import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'zh'];
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

// 定义路由配置，不使用URL前缀
export const routing = defineRouting({
  defaultLocale,
  localePrefix: 'never', // 不在URL中显示语言前缀
  locales,
});

// 创建导航函数
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

// 本地存储的键名
export const LOCALE_STORAGE_KEY = 'preferred-locale';

// 获取浏览器语言偏好
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const browserLang = navigator.language.split('-')[0];
  return locales.includes(browserLang as Locale) ? (browserLang as Locale) : defaultLocale;
}

// 获取当前应该使用的语言
export function getCurrentLocale(): Locale {
  // 优先使用本地存储的设置
  const stored = getStoredLocale();
  if (stored) {
    return stored;
  }

  // 其次使用浏览器语言偏好
  return getBrowserLocale();
}

// 获取本地存储的语言设置
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }

  return null;
}

// 设置本地存储的语言设置
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to save locale to localStorage:', error);
  }
}
