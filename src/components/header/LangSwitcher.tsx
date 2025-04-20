'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LangSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    const currentLocale = pathname.split('/')[1];

    setLocale(currentLocale);
  }, [pathname]);

  const changeLang = (newLocale: string) => {
    if (newLocale !== locale) {
      const newPathname = pathname.replace(/^\/(en|ru)/, `/${newLocale}`);

      router.push(newPathname);
    }
  };

  return (
    <select
      value={locale}
      onChange={(e) => changeLang(e.target.value)}
      className="rounded-md border border-black text-black h-[31px] w-[60px] focus:border-blue-600 focus:outline-none"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
    </select>
  );
};
