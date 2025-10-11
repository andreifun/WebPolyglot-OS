#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addLanguage } from './commands/add-language';
import { init } from './commands/init';
import { listLanguages } from './commands/list-languages';

const program = new Command();

program
  .name('webpolyglot')
  .description('CLI tool for WebPolyglot i18n framework')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize WebPolyglot in your project')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('-f, --framework <framework>', 'Framework (react, nextjs)', 'react')
  .action(async (options) => {
    try {
      await init(options);
      console.log(chalk.green('✅ WebPolyglot initialized successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error initializing WebPolyglot:'), error);
      process.exit(1);
    }
  });

program
  .command('add <language>')
  .description('Add a new language to your project')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .action(async (language, options) => {
    try {
      await addLanguage(language, options);
      console.log(chalk.green(`✅ Language '${language}' added successfully!`));
    } catch (error) {
      console.error(chalk.red('❌ Error adding language:'), error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all available languages in your project')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .action(async (options) => {
    try {
      await listLanguages(options);
    } catch (error) {
      console.error(chalk.red('❌ Error listing languages:'), error);
      process.exit(1);
    }
  });

program.parse();
