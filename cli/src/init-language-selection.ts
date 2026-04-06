import inquirer from 'inquirer';
import chalk from 'chalk';
import { LANGUAGES, LanguageInfo } from './languages';

export const RESERVED_CHOICES = new Set(['search', 'custom']);
const POPULAR_LANGUAGE_CODES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'tr', 'pl', 'nl'];
const LANGUAGE_CODE_PATTERN = /^[a-z]{2,3}(?:-[a-z0-9]+)?$/;

export function normalizeLanguageCode(input: string): string {
  return input.trim().toLowerCase();
}

export function sanitizeSelectedLanguages(languages: string[]): string[] {
  const uniqueLanguages: string[] = [];
  const seen = new Set<string>();

  for (const language of languages) {
    const normalized = normalizeLanguageCode(language);
    if (!normalized || RESERVED_CHOICES.has(normalized)) {
      continue;
    }

    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLanguages.push(normalized);
    }
  }

  return uniqueLanguages;
}

interface LanguageSelectionResult {
  defaultLanguage: string;
  selectedLanguages: string[];
}

function getLanguageCatalog(customLanguages: LanguageInfo[]): LanguageInfo[] {
  return [...LANGUAGES, ...customLanguages];
}

function getPopularLanguagesFromCatalog(customLanguages: LanguageInfo[]): LanguageInfo[] {
  return getLanguageCatalog(customLanguages).filter((language) => POPULAR_LANGUAGE_CODES.includes(language.code));
}

function searchCatalog(query: string, customLanguages: LanguageInfo[]): LanguageInfo[] {
  const lowerQuery = query.toLowerCase();
  return getLanguageCatalog(customLanguages).filter((language) =>
    language.name.toLowerCase().includes(lowerQuery) ||
    language.nativeName.toLowerCase().includes(lowerQuery) ||
    language.code.toLowerCase().includes(lowerQuery)
  );
}

function validateCustomCode(input: string, existingCodes: string[]): true | string {
  const code = normalizeLanguageCode(input);
  if (!code) return 'Please enter a language code';
  if (RESERVED_CHOICES.has(code)) return 'This name is reserved. Please choose a different language code.';
  if (!LANGUAGE_CODE_PATTERN.test(code)) return 'Use a valid code like "en", "pt-br", or "zh-hant".';
  if (existingCodes.includes(code)) return 'This language code already exists. Please choose a different one.';
  return true;
}

async function promptCustomLanguage(existingCodes: string[]): Promise<LanguageInfo> {
  const customAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: 'Language code (e.g., en, es, fr):',
      validate: (input: string) => validateCustomCode(input, existingCodes),
      filter: normalizeLanguageCode,
    },
    {
      type: 'input',
      name: 'name',
      message: 'Language name in English:',
      validate: (input: string) => (input.trim() ? true : 'Please enter a language name'),
    },
    {
      type: 'input',
      name: 'nativeName',
      message: 'Language name in its native script:',
      validate: (input: string) => (input.trim() ? true : 'Please enter the native name'),
    },
    {
      type: 'input',
      name: 'countries',
      message: 'Country codes (comma-separated, e.g., US,GB,AU):',
      default: '',
      filter: (input: string) => input.split(',').map((country) => country.trim().toUpperCase()).filter((country) => country),
    },
  ]);

  return {
    code: customAnswer.code,
    name: customAnswer.name,
    nativeName: customAnswer.nativeName,
    countries: customAnswer.countries,
  };
}

export async function promptLanguageSelection(): Promise<LanguageSelectionResult> {
  const customLanguages: LanguageInfo[] = [];
  let defaultLanguage = 'en';
  let selectedLanguages: string[] = [];

  const defaultLangAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultLanguage',
      message: 'What is your default language?',
      choices: [
        ...getPopularLanguagesFromCatalog(customLanguages).map((language) => ({
          name: `${language.name} (${language.nativeName}) - ${language.code}`,
          value: language.code,
        })),
        new inquirer.Separator(),
        { name: '🔍 Search for a language...', value: 'search' },
        { name: '➕ Create custom language...', value: 'custom' },
      ],
      default: 'en',
    },
  ]);

  if (defaultLangAnswer.defaultLanguage === 'search') {
    const searchAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Search for a language:',
        validate: (input: string) => (input.trim() ? true : 'Please enter a search term'),
      },
    ]);

    const searchResults = searchCatalog(searchAnswer.searchQuery, customLanguages);
    if (searchResults.length === 0) {
      console.log(chalk.yellow('No languages found. Using English as default.'));
      defaultLanguage = 'en';
    } else {
      const searchChoice = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedLanguage',
          message: 'Select a language:',
          choices: searchResults.map((language) => ({
            name: `${language.name} (${language.nativeName}) - ${language.code}`,
            value: language.code,
          })),
        },
      ]);

      defaultLanguage = normalizeLanguageCode(searchChoice.selectedLanguage);
    }
  } else if (defaultLangAnswer.defaultLanguage === 'custom') {
    const customLanguage = await promptCustomLanguage(getLanguageCatalog(customLanguages).map((language) => language.code));
    customLanguages.push(customLanguage);
    defaultLanguage = customLanguage.code;
  } else {
    defaultLanguage = normalizeLanguageCode(defaultLangAnswer.defaultLanguage);
  }

  const additionalLanguages = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Which additional languages do you want to support?',
      choices: [
        ...getPopularLanguagesFromCatalog(customLanguages)
          .filter((language) => language.code !== defaultLanguage)
          .map((language) => ({
            name: `${language.name} (${language.nativeName}) - ${language.code}`,
            value: language.code,
          })),
        new inquirer.Separator(),
        { name: '🔍 Search for more languages...', value: 'search' },
        { name: '➕ Add custom language...', value: 'custom' },
      ],
      default: [],
    },
  ]);

  selectedLanguages = [defaultLanguage, ...additionalLanguages.languages];

  if (additionalLanguages.languages.includes('search')) {
    const searchAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Search for additional languages:',
        validate: (input: string) => (input.trim() ? true : 'Please enter a search term'),
      },
    ]);

    const searchResults = searchCatalog(searchAnswer.searchQuery, customLanguages).filter(
      (language) => !selectedLanguages.includes(language.code)
    );

    if (searchResults.length > 0) {
      const searchChoice = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedLanguages',
          message: 'Select additional languages:',
          choices: searchResults.map((language) => ({
            name: `${language.name} (${language.nativeName}) - ${language.code}`,
            value: language.code,
          })),
        },
      ]);

      selectedLanguages.push(...searchChoice.selectedLanguages.map(normalizeLanguageCode));
    }
  }

  if (additionalLanguages.languages.includes('custom')) {
    const customLanguage = await promptCustomLanguage(sanitizeSelectedLanguages([
      ...getLanguageCatalog(customLanguages).map((language) => language.code),
      ...selectedLanguages,
    ]));
    customLanguages.push(customLanguage);
    selectedLanguages.push(customLanguage.code);
  }

  selectedLanguages = sanitizeSelectedLanguages([defaultLanguage, ...selectedLanguages]);
  if (selectedLanguages.length === 0) {
    throw new Error('No valid languages selected. Please select at least one language.');
  }

  return {
    defaultLanguage: selectedLanguages[0],
    selectedLanguages,
  };
}
