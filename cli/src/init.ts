#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { LANGUAGES, getPopularLanguages, searchLanguages, getLanguagesByCountry } from './languages';

export interface InitOptions {
  dir: string;
  framework: string;
}

export async function init(options: InitOptions) {
  const { dir, framework } = options;
  const projectPath = path.resolve(dir);

  console.log(chalk.blue('🚀 Initializing WebPolyglot...'));

  // Check if package.json exists
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No package.json found. Please run this command in a Node.js project.');
  }

  // Interactive setup
  let defaultLanguage = 'en';
  let selectedLanguages: string[] = [];

  // Get default language
  const defaultLangAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultLanguage',
      message: 'What is your default language?',
      choices: [
        ...getPopularLanguages().map(lang => ({
          name: `${lang.name} (${lang.nativeName}) - ${lang.code}`,
          value: lang.code
        })),
        new inquirer.Separator(),
        { name: '🔍 Search for a language...', value: 'search' },
        { name: '➕ Create custom language...', value: 'custom' }
      ],
      default: 'en'
    }
  ]);

  if (defaultLangAnswer.defaultLanguage === 'search') {
    const searchAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Search for a language:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a search term';
          return true;
        }
      }
    ]);

    const searchResults = searchLanguages(searchAnswer.searchQuery);
    if (searchResults.length === 0) {
      console.log(chalk.yellow('No languages found. Using English as default.'));
      defaultLanguage = 'en';
    } else {
      const searchChoice = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedLanguage',
          message: 'Select a language:',
          choices: searchResults.map(lang => ({
            name: `${lang.name} (${lang.nativeName}) - ${lang.code}`,
            value: lang.code
          }))
        }
      ]);
      defaultLanguage = searchChoice.selectedLanguage;
    }
  } else if (defaultLangAnswer.defaultLanguage === 'custom') {
    const customAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'code',
        message: 'Language code (e.g., en, es, fr):',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a language code';
          if (LANGUAGES.find(lang => lang.code === input)) {
            return 'This language code already exists. Please choose a different one.';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Language name in English:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a language name';
          return true;
        }
      },
      {
        type: 'input',
        name: 'nativeName',
        message: 'Language name in its native script:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter the native name';
          return true;
        }
      },
      {
        type: 'input',
        name: 'countries',
        message: 'Country codes (comma-separated, e.g., US,GB,AU):',
        default: '',
        filter: (input: string) => input.split(',').map(c => c.trim().toUpperCase()).filter(c => c)
      }
    ]);
    
    defaultLanguage = customAnswer.code;
    // Add custom language to the list for later use
    LANGUAGES.push({
      code: customAnswer.code,
      name: customAnswer.name,
      nativeName: customAnswer.nativeName,
      countries: customAnswer.countries
    });
  } else {
    defaultLanguage = defaultLangAnswer.defaultLanguage;
  }

  // Get additional languages
  const additionalLanguages = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Which additional languages do you want to support?',
      choices: [
        ...getPopularLanguages()
          .filter(lang => lang.code !== defaultLanguage)
          .map(lang => ({
            name: `${lang.name} (${lang.nativeName}) - ${lang.code}`,
            value: lang.code
          })),
        new inquirer.Separator(),
        { name: '🔍 Search for more languages...', value: 'search' },
        { name: '➕ Add custom language...', value: 'custom' }
      ],
      default: []
    }
  ]);

  selectedLanguages = [defaultLanguage, ...additionalLanguages.languages];

  // Handle search for additional languages
  if (additionalLanguages.languages.includes('search')) {
    const searchAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Search for additional languages:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a search term';
          return true;
        }
      }
    ]);

    const searchResults = searchLanguages(searchAnswer.searchQuery)
      .filter(lang => !selectedLanguages.includes(lang.code));
    
    if (searchResults.length > 0) {
      const searchChoice = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedLanguages',
          message: 'Select additional languages:',
          choices: searchResults.map(lang => ({
            name: `${lang.name} (${lang.nativeName}) - ${lang.code}`,
            value: lang.code
          }))
        }
      ]);
      selectedLanguages.push(...searchChoice.selectedLanguages);
    }
  }

  // Handle custom additional languages
  if (additionalLanguages.languages.includes('custom')) {
    const customAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'code',
        message: 'Language code (e.g., en, es, fr):',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a language code';
          if (selectedLanguages.includes(input)) {
            return 'This language is already selected';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Language name in English:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter a language name';
          return true;
        }
      },
      {
        type: 'input',
        name: 'nativeName',
        message: 'Language name in its native script:',
        validate: (input: string) => {
          if (!input.trim()) return 'Please enter the native name';
          return true;
        }
      },
      {
        type: 'input',
        name: 'countries',
        message: 'Country codes (comma-separated, e.g., US,GB,AU):',
        default: '',
        filter: (input: string) => input.split(',').map(c => c.trim().toUpperCase()).filter(c => c)
      }
    ]);
    
    selectedLanguages.push(customAnswer.code);
    LANGUAGES.push({
      code: customAnswer.code,
      name: customAnswer.name,
      nativeName: customAnswer.nativeName,
      countries: customAnswer.countries
    });
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'dictionariesDir',
      message: 'Where should dictionary files be stored?',
      default: 'dictionaries'
    },
    {
      type: 'confirm',
      name: 'installPackage',
      message: 'Install webpolyglot package?',
      default: true
    }
  ]);

  // Create dictionaries directory
  const dictionariesDir = path.join(projectPath, answers.dictionariesDir);
  await fs.ensureDir(dictionariesDir);

  // Create initial dictionary files
  const initialKeys = {
    welcome: '',
    navigation: {
      home: '',
      about: '',
      contact: ''
    },
    buttons: {
      save: '',
      cancel: '',
      submit: ''
    },
    common: {
      loading: '',
      error: '',
      success: ''
    }
  };

  for (const lang of selectedLanguages) {
    const filePath = path.join(dictionariesDir, `${lang}.json`);
    await fs.writeJson(filePath, initialKeys, { spaces: 2 });
    console.log(chalk.green(`✅ Created ${lang}.json`));
  }

  // Create example usage file
  const exampleContent = generateExampleContent(framework, defaultLanguage, selectedLanguages, answers.dictionariesDir);
  const examplePath = path.join(projectPath, 'webpolyglot-example.tsx');
  await fs.writeFile(examplePath, exampleContent);
  console.log(chalk.green('✅ Created example usage file'));

  // Install package if requested
  if (answers.installPackage) {
    console.log(chalk.blue('📦 Installing webpolyglot package...'));
    try {
      execSync('npm install webpolyglot', { cwd: projectPath, stdio: 'inherit' });
      console.log(chalk.green('✅ Package installed successfully'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Failed to install package automatically. Please run: npm install webpolyglot'));
    }
  }

  // Create webpolyglot config file
  const config = {
    defaultLanguage,
    languages: selectedLanguages,
    dictionariesDir: answers.dictionariesDir,
    framework
  };

  const configPath = path.join(projectPath, 'webpolyglot.config.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
  console.log(chalk.green('✅ Created webpolyglot.config.json'));

  console.log(chalk.blue('\n🎉 WebPolyglot setup complete!'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('1. Review and fill in your dictionary files'));
  console.log(chalk.gray('2. Check the example usage file'));
  console.log(chalk.gray('3. Integrate WebPolyglot into your app'));
  console.log(chalk.gray('\nCommands:'));
  console.log(chalk.gray('  webpolyglot add <language>  - Add a new language'));
  console.log(chalk.gray('  webpolyglot list           - List all languages'));
}

function generateExampleContent(framework: string, defaultLanguage: string, languages: string[], dictionariesDir: string): string {
  if (framework === 'nextjs') {
    return `// pages/_app.tsx - Next.js App Router example
import { I18nProvider } from 'webpolyglot';

export default function App({ Component, pageProps }) {
  return (
    <I18nProvider 
      languages={['${languages.join("', '")}']}
      config={{
        defaultLanguage: '${defaultLanguage}',
        storageKey: 'my-app-language'
      }}
    >
      <Component {...pageProps} />
    </I18nProvider>
  );
}

// Example component
import { useTranslation } from 'webpolyglot';

export function MyComponent() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <nav>
        <a href="/">{t('navigation.home')}</a>
        <a href="/about">{t('navigation.about')}</a>
        <a href="/contact">{t('navigation.contact')}</a>
      </nav>
      
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        {availableLanguages.map(lang => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}`;
  } else {
    return `// App.tsx - React example
import React from 'react';
import { I18nProvider, useTranslation } from 'webpolyglot';

function MyComponent() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <nav>
        <a href="/">{t('navigation.home')}</a>
        <a href="/about">{t('navigation.about')}</a>
        <a href="/contact">{t('navigation.contact')}</a>
      </nav>
      
      <div>
        <button>{t('buttons.save')}</button>
        <button>{t('buttons.cancel')}</button>
        <button>{t('buttons.submit')}</button>
      </div>
      
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        {availableLanguages.map(lang => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider 
      languages={['${languages.join("', '")}']}
      config={{
        defaultLanguage: '${defaultLanguage}',
        storageKey: 'my-app-language'
      }}
    >
      <MyComponent />
    </I18nProvider>
  );
}`;
  }
}
