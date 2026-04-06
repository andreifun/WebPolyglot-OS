import { LANGUAGES } from '../../cli/src/languages';

describe('CLI language catalog', () => {
  it('contains unique language codes', () => {
    const codes = LANGUAGES.map((language) => language.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
