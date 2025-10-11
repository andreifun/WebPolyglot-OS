export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  countries: string[];
  rtl?: boolean;
}

// Simplified language database for the main package
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', countries: ['US', 'GB', 'AU', 'CA', 'NZ', 'IE', 'ZA'] },
  { code: 'es', name: 'Spanish', nativeName: 'Español', countries: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR'] },
  { code: 'fr', name: 'French', nativeName: 'Français', countries: ['FR', 'CA', 'BE', 'CH', 'LU', 'MC', 'SN', 'CI', 'ML', 'BF', 'NE', 'TD', 'MG', 'CM', 'CD', 'RW', 'BI', 'DJ', 'KM', 'SC'] },
  { code: 'de', name: 'German', nativeName: 'Deutsch', countries: ['DE', 'AT', 'CH', 'LI', 'BE', 'LU'] },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', countries: ['IT', 'CH', 'SM', 'VA'] },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', countries: ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'] },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', countries: ['RU', 'BY', 'KZ', 'KG', 'TJ', 'UZ', 'AM', 'AZ', 'GE', 'MD', 'UA'] },
  { code: 'zh', name: 'Chinese', nativeName: '中文', countries: ['CN', 'TW', 'HK', 'MO', 'SG'] },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', countries: ['JP'] },
  { code: 'ko', name: 'Korean', nativeName: '한국어', countries: ['KR', 'KP'] },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', countries: ['SA', 'EG', 'AE', 'JO', 'LB', 'SY', 'IQ', 'KW', 'QA', 'BH', 'OM', 'YE', 'LY', 'TN', 'DZ', 'MA', 'SD', 'SO', 'DJ', 'KM', 'ER'], rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', countries: ['IN'] },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', countries: ['TR', 'CY'] },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', countries: ['PL'] },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', countries: ['NL', 'BE', 'SR', 'CW', 'AW'] },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', countries: ['SE', 'FI'] },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', countries: ['DK', 'GL'] },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', countries: ['NO'] },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', countries: ['FI'] },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', countries: ['GR', 'CY'] },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', countries: ['IL'], rtl: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', countries: ['TH'] },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', countries: ['VN'] },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', countries: ['ID'] },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', countries: ['MY', 'BN', 'SG'] },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', countries: ['PH'] },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', countries: ['UA'] },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', countries: ['CZ'] },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', countries: ['HU'] },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', countries: ['RO', 'MD'] },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', countries: ['BG'] },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', countries: ['HR', 'BA'] },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', countries: ['SK'] },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', countries: ['SI'] },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', countries: ['EE'] },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', countries: ['LV'] },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', countries: ['LT'] },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', countries: ['MT'] },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', countries: ['IE'] },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', countries: ['GB'] },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', countries: ['ES', 'FR'] },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', countries: ['ES', 'AD', 'FR', 'IT'] },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', countries: ['ES'] },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', countries: ['IS'] },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', countries: ['MK'] },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', countries: ['AL', 'XK', 'MK'] },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', countries: ['RS', 'BA', 'ME', 'XK'] },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', countries: ['BA'] },
  { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski', countries: ['ME'] },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', countries: ['LK'] },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', countries: ['IN', 'LK', 'SG', 'MY'] },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', countries: ['IN'] },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', countries: ['IN'] },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', countries: ['IN'] },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', countries: ['IN'] },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', countries: ['IN', 'PK'] },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', countries: ['IN'] },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', countries: ['IN'] },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', countries: ['NP', 'IN'] },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', countries: ['MM'] },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', countries: ['KH'] },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', countries: ['LA'] },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', countries: ['GE'] },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', countries: ['AM'] },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', countries: ['AZ', 'IR'] },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', countries: ['KZ'] },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', countries: ['KG'] },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', countries: ['UZ'] },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', countries: ['TJ'] },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', countries: ['MN'] },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་ཡིག', countries: ['CN'] },
  { code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ', countries: ['BT'] },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', countries: ['TZ', 'KE', 'UG', 'RW', 'BI', 'CD', 'SO', 'MW', 'ZM', 'ZW'] },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', countries: ['ET'] },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', countries: ['ER', 'ET'] },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', countries: ['ET', 'KE'] },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', countries: ['SO', 'ET', 'KE', 'DJ'] },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', countries: ['NG', 'NE', 'GH', 'BF', 'CM', 'TD'] },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', countries: ['NG', 'BJ', 'TG'] },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', countries: ['NG'] },
  { code: 'zu', name: 'Zulu', nativeName: 'IsiZulu', countries: ['ZA'] },
  { code: 'xh', name: 'Xhosa', nativeName: 'IsiXhosa', countries: ['ZA'] },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', countries: ['ZA', 'NA'] },
  { code: 'st', name: 'Sotho', nativeName: 'Sesotho', countries: ['ZA', 'LS'] },
  { code: 'tn', name: 'Tswana', nativeName: 'Setswana', countries: ['ZA', 'BW'] },
  { code: 'ss', name: 'Swati', nativeName: 'SiSwati', countries: ['ZA', 'SZ'] },
  { code: 've', name: 'Venda', nativeName: 'Tshivenḓa', countries: ['ZA'] },
  { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga', countries: ['ZA'] },
  { code: 'nr', name: 'Ndebele', nativeName: 'IsiNdebele', countries: ['ZA'] },
  { code: 'nso', name: 'Northern Sotho', nativeName: 'Sesotho sa Leboa', countries: ['ZA'] }
];

export function getLanguageByCode(code: string): LanguageInfo | undefined {
  return LANGUAGES.find(lang => lang.code === code);
}

export function getLanguagesByCountry(countryCode: string): LanguageInfo[] {
  return LANGUAGES.filter(lang => lang.countries.includes(countryCode.toUpperCase()));
}

export function searchLanguages(query: string): LanguageInfo[] {
  const lowerQuery = query.toLowerCase();
  return LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.nativeName.toLowerCase().includes(lowerQuery) ||
    lang.code.toLowerCase().includes(lowerQuery)
  );
}

export function getPopularLanguages(): LanguageInfo[] {
  // Most commonly used languages globally
  const popularCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'tr', 'pl', 'nl'];
  return LANGUAGES.filter(lang => popularCodes.includes(lang.code));
}
