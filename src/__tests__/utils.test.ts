import { 
  getNestedTranslation, 
  getBrowserLanguage, 
  getStoredLanguage, 
  saveLanguage 
} from '../utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('utils', () => {
  describe('getNestedTranslation', () => {
    const translations = {
      simple: 'Hello',
      nested: {
        level1: 'World',
        level2: {
          deep: 'Deep value'
        }
      }
    };

    it('should return simple translation', () => {
      expect(getNestedTranslation(translations, 'simple')).toBe('Hello');
    });

    it('should return nested translation', () => {
      expect(getNestedTranslation(translations, 'nested.level1')).toBe('World');
    });

    it('should return deeply nested translation', () => {
      expect(getNestedTranslation(translations, 'nested.level2.deep')).toBe('Deep value');
    });

    it('should return key when translation not found', () => {
      expect(getNestedTranslation(translations, 'nonexistent')).toBe('nonexistent');
      expect(getNestedTranslation(translations, 'nested.nonexistent')).toBe('nested.nonexistent');
    });

    it('should return key when path is incomplete', () => {
      expect(getNestedTranslation(translations, 'nested')).toBe('nested');
    });
  });

  describe('getBrowserLanguage', () => {
    it('should return browser language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'es-ES',
        writable: true
      });
      expect(getBrowserLanguage()).toBe('es');
    });

    it('should return en as fallback', () => {
      Object.defineProperty(navigator, 'language', {
        value: '',
        writable: true
      });
      expect(getBrowserLanguage()).toBe('en');
    });
  });

  describe('getStoredLanguage', () => {
    beforeEach(() => {
      mockLocalStorage.clear.mockClear();
      mockLocalStorage.getItem.mockClear();
      mockLocalStorage.setItem.mockClear();
    });

    it('should return stored language', () => {
      mockLocalStorage.getItem.mockReturnValue('fr');
      expect(getStoredLanguage()).toBe('fr');
    });

    it('should return null when no language stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(getStoredLanguage()).toBe(null);
    });

    it('should return null when localStorage throws', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      expect(getStoredLanguage()).toBe(null);
    });
  });

  describe('saveLanguage', () => {
    beforeEach(() => {
      mockLocalStorage.clear.mockClear();
      mockLocalStorage.setItem.mockClear();
    });

    it('should save language to localStorage', () => {
      saveLanguage('es');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'es');
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      expect(() => saveLanguage('es')).not.toThrow();
    });
  });
});
