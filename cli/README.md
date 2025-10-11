# WebPolyglot CLI

Command-line tool for managing WebPolyglot i18n projects.

## Installation

```bash
npm install -g webpolyglot-cli
```

Or use directly with npx:

```bash
npx webpolyglot-init
```

## Commands

### Initialize Project

```bash
npx webpolyglot-init
```

Interactive setup that:
- Creates `dictionaries/` folder with language files
- Installs the `webpolyglot` package
- Generates example usage code
- Creates configuration file

### Add Language

```bash
webpolyglot add <language-code>
```

Examples:
```bash
webpolyglot add es        # Spanish
webpolyglot add fr        # French  
webpolyglot add de        # German
webpolyglot add zh        # Chinese
```

Creates a new dictionary file with all existing keys.

### List Languages

```bash
webpolyglot list
```

Shows all available languages in your project with key counts and file sizes.

## Options

All commands support:
- `-d, --dir <directory>` - Specify project directory (default: current directory)

## License

MIT
