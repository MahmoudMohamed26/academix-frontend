'use client';

import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLanguage = pathname?.split('/')[1] || 'en';

  const changeLanguage = (newLocale: string) => {
    if (!pathname) return;
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    
    router.push(newPathname);
  };

  return { 
    changeLanguage, 
    currentLanguage 
  };
};