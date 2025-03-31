import { useTranslations } from 'next-intl';

export default function WelcomePage() {
  const t = useTranslations('WelcomePage');

  return (
    <>
      <div className={'welcomeWrapper'}>
        <h2>{t('title')}</h2>
        <h4>{t('welcome')}</h4>
      </div>
    </>
  );
}
