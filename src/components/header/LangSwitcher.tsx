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
      className="rounded-xl border border-black text-black h-[25px] w-[60px] focus:border-blue-600 focus:outline-none"
    >
      <option value="en">en</option>
      <option value="ru">ru</option>
    </select>
  );
};
