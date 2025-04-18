import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <p className="mt-2">{t('description')}</p>
      <Link
        href="/"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
