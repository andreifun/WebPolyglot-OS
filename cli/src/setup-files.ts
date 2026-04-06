import fs from 'fs-extra';
import path from 'path';
import type { SupportedFramework } from './config';
import { getPrimaryEntryFile, usesNextAppRouter } from './framework';

interface SetupFileResult {
  providerFilePath: string;
  instructionsFilePath?: string;
  entryFilePath: string | null;
}

export async function writeSetupFiles(
  projectPath: string,
  framework: SupportedFramework,
  defaultLanguage: string,
  languages: string[],
  dictionariesDir: string,
  createInstructions: boolean
): Promise<SetupFileResult> {
  const providerFilePath = getProviderFilePath(projectPath, framework);
  const providerContent = buildProviderContent(
    projectPath,
    providerFilePath,
    framework,
    defaultLanguage,
    languages,
    dictionariesDir
  );

  await fs.ensureDir(path.dirname(providerFilePath));
  await fs.writeFile(providerFilePath, providerContent);

  const entryFilePath = getPrimaryEntryFile(projectPath, framework);
  let instructionsFilePath: string | undefined;

  if (createInstructions) {
    instructionsFilePath = path.join(projectPath, 'webpolyglot.setup.md');
    await fs.writeFile(
      instructionsFilePath,
      buildInstructionsContent(projectPath, framework, providerFilePath, defaultLanguage, entryFilePath)
    );
  }

  return {
    providerFilePath,
    instructionsFilePath,
    entryFilePath,
  };
}

function getProviderFilePath(projectPath: string, framework: SupportedFramework): string {
  if (framework === 'nextjs') {
    const baseDir = usesNextAppRouter(projectPath) ? 'app' : 'pages';
    return path.join(projectPath, baseDir, 'webpolyglot-provider.tsx');
  }

  const baseDir = fs.existsSync(path.join(projectPath, 'src')) ? 'src' : '.';
  return path.join(projectPath, baseDir, 'webpolyglot-provider.tsx');
}

function buildProviderContent(
  projectPath: string,
  providerFilePath: string,
  framework: SupportedFramework,
  defaultLanguage: string,
  languages: string[],
  dictionariesDir: string
): string {
  const dictionariesPath = path.join(projectPath, dictionariesDir);
  const importBase = toPosixPath(path.relative(path.dirname(providerFilePath), dictionariesPath));
  const normalizedImportBase = importBase.startsWith('.') ? importBase : `./${importBase}`;
  const imports = languages
    .map((language) => {
      const identifier = toIdentifier(language);
      return `import ${identifier} from '${normalizedImportBase}/${language}.json';`;
    })
    .join('\n');
  const translationsObject = languages
    .map((language) => `  '${language}': ${toIdentifier(language)}`)
    .join(',\n');

  const header = framework === 'nextjs' ? `'use client';\n\n` : '';

  return `${header}import type { ReactNode } from 'react';
import { I18nProvider } from 'webpolyglot';
${imports}

const translations = {
${translationsObject}
};

export function WebPolyglotProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider translations={translations} config={{ defaultLanguage: '${defaultLanguage}' }}>
      {children}
    </I18nProvider>
  );
}
`;
}

function buildInstructionsContent(
  projectPath: string,
  framework: SupportedFramework,
  providerFilePath: string,
  defaultLanguage: string,
  entryFilePath: string | null
): string {
  const title = `# WebPolyglot setup\n\nGenerated provider: \`${path.relative(projectPath, providerFilePath)}\`\nDefault language: \`${defaultLanguage}\`\n`;

  if (framework === 'nextjs') {
    return `${title}
Update your Next.js entry file and wrap the app inside \`<body>\`.

\`\`\`tsx
import { WebPolyglotProvider } from '${buildImportPath(entryFilePath, providerFilePath)}';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="${defaultLanguage}">
      <body>
        <WebPolyglotProvider>{children}</WebPolyglotProvider>
      </body>
    </html>
  );
}
\`\`\`
`;
  }

  return `${title}
Wrap your React app entry with the generated provider.

\`\`\`tsx
import { WebPolyglotProvider } from '${buildImportPath(entryFilePath, providerFilePath)}';

root.render(
  <WebPolyglotProvider>
    <App />
  </WebPolyglotProvider>
);
\`\`\`
`;
}

function buildImportPath(fromFile: string | null, toFile: string): string {
  if (!fromFile) {
    return './webpolyglot-provider';
  }

  const relative = toPosixPath(path.relative(path.dirname(fromFile), toFile)).replace(/\.tsx$/, '');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function toIdentifier(language: string): string {
  return `lang_${language.replace(/[^a-zA-Z0-9_$]/g, '_')}`;
}

function toPosixPath(value: string): string {
  return value.replace(/\\/g, '/');
}
