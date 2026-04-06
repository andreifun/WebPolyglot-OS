import { getBrowserLanguageWithFallback, getTimezoneBasedLanguages } from '../location-detection';

describe('location detection', () => {
  it('returns timezone-based language for known timezone', () => {
    const dateTimeFormatSpy = jest.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
      resolvedOptions: () => ({ timeZone: 'Europe/Paris' }),
    } as Intl.DateTimeFormat);

    expect(getTimezoneBasedLanguages()).toEqual(['fr']);
    dateTimeFormatSpy.mockRestore();
  });

  it('falls back to english for unknown timezone', () => {
    const dateTimeFormatSpy = jest.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
      resolvedOptions: () => ({ timeZone: 'Unknown/Zone' }),
    } as Intl.DateTimeFormat);

    expect(getTimezoneBasedLanguages()).toEqual(['en']);
    dateTimeFormatSpy.mockRestore();
  });

  it('returns first valid browser language code from navigator.languages', () => {
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: { languages: ['fr-CA', 'en-US'], language: 'en-US' },
      configurable: true,
    });

    expect(getBrowserLanguageWithFallback()).toBe('fr');

    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('falls back to english when navigator is unavailable', () => {
    const originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      configurable: true,
    });

    expect(getBrowserLanguageWithFallback()).toBe('en');

    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });
});
