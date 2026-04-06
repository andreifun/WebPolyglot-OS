#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addLanguage } from './commands/add-language';
import { init } from './commands/init';
import { listLanguages } from './commands/list-languages';

const program = new Command();
const VERSION = '2.0.0';

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

program
  .name('webpolyglot')
  .description('Bootstrap and manage WebPolyglot in React and Next.js apps.')
  .version(VERSION)
  .showSuggestionAfterError()
  .showHelpAfterError();

program
  .command('init')
  .description('Bootstrap WebPolyglot in the current project')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('-f, --framework <framework>', 'Framework (react or nextjs)')
  .option('--default-language <code>', 'Default language code')
  .option('--languages <codes>', 'Comma-separated language codes to generate')
  .option('--dictionaries-dir <directory>', 'Dictionary directory')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-example', 'Skip generating the setup guide')
  .option('--no-prompt', 'Run without interactive prompts')
  .action(async (options) => {
    try {
      await init(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${formatError(error)}`));
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
    } catch (error) {
      console.error(chalk.red(`Error: ${formatError(error)}`));
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
      console.error(chalk.red(`Error: ${formatError(error)}`));
      process.exit(1);
    }
  });

program.parse();
