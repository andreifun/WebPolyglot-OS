import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export interface ListLanguagesOptions {
  dir: string;
}

export async function listLanguages(options: ListLanguagesOptions) {
  const { dir } = options;
  const projectPath = path.resolve(dir);

  // Check if webpolyglot config exists
  const configPath = path.join(projectPath, 'webpolyglot.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('WebPolyglot not initialized. Please run "webpolyglot init" first.');
  }

  const config = await fs.readJson(configPath);
  const dictionariesDir = path.join(projectPath, config.dictionariesDir);

  console.log(chalk.blue('📋 WebPolyglot Languages:'));
  console.log(chalk.gray(`Default: ${config.defaultLanguage}`));
  console.log(chalk.gray(`Directory: ${config.dictionariesDir}`));
  console.log('');

  const languages = await fs.readdir(dictionariesDir);
  const jsonFiles = languages.filter((file: string) => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.log(chalk.yellow('No language files found.'));
    return;
  }

  for (const file of jsonFiles) {
    const language = file.replace('.json', '');
    const filePath = path.join(dictionariesDir, file);
    const stats = await fs.stat(filePath);
    const content = await fs.readJson(filePath);
    const keyCount = countKeys(content);
    
    const isDefault = language === config.defaultLanguage;
    const status = isDefault ? chalk.green('(default)') : '';
    
    console.log(`  ${isDefault ? '⭐' : '  '} ${chalk.cyan(language)} ${status}`);
    console.log(`     ${chalk.gray(`${keyCount} keys, ${formatFileSize(stats.size)}`)}`);
  }

  console.log('');
  console.log(chalk.gray('Commands:'));
  console.log(chalk.gray('  webpolyglot add <language>  - Add a new language'));
  console.log(chalk.gray('  webpolyglot init           - Reinitialize project'));
}

function countKeys(obj: any): number {
  let count = 0;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      count++;
    } else if (typeof value === 'object' && value !== null) {
      count += countKeys(value);
    }
  }
  
  return count;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}