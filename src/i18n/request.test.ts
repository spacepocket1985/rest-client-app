import { describe, it, expect, vi } from 'vitest';
import requestConfig from './request';
import { routing } from './routing';

vi.mock('next-intl/server', () => ({
  getRequestConfig: (fn: () => void) => fn,
}));
vi.mock('next-intl', () => ({
  hasLocale: (locales: string[], locale: string) => locales.includes(locale),
}));

vi.mock('../messages/en.json', () => ({ default: { greeting: 'Hello' } }));
vi.mock('../messages/ru.json', () => ({ default: { greeting: 'Zdorov' } }));

routing.locales = ['en', 'ru'];
routing.defaultLocale = 'en';

describe('request config', () => {
  it('returns messages for a supported locale', async () => {
    const config = await requestConfig({ requestLocale: Promise.resolve('ru') });

    expect(config.locale).toBe('ru');
    expect(config.messages!.greeting).toBe('Zdorov');
  });

  it('returns defaultLocale for an unsupported locale', async () => {
    const config = await requestConfig({ requestLocale: Promise.resolve('fr') });

    expect(config.locale).toBe(routing.defaultLocale);
    expect(config.messages!.greeting).toBe('Hello');
  });
});
