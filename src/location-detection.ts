import { getLanguagesByCountry, LanguageInfo } from './languages';

/**
 * Get user's location-based language preferences
 * @returns Array of language codes based on user's location
 */
export async function getLocationBasedLanguages(): Promise<string[]> {
  try {
    // Try to get location from browser geolocation API
    const position = await getCurrentPosition();
    const countryCode = await getCountryFromCoordinates(position.coords.latitude, position.coords.longitude);
    
    if (countryCode) {
      const languages = getLanguagesByCountry(countryCode);
      return languages.map((lang: LanguageInfo) => lang.code);
    }
  } catch (error) {
    console.warn('Could not get location-based languages:', error);
  }

  // Fallback to timezone-based detection
  return getTimezoneBasedLanguages();
}

/**
 * Get languages based on user's timezone
 * @returns Array of language codes based on timezone
 */
export function getTimezoneBasedLanguages(): string[] {
  if (typeof Intl === 'undefined') {
    return ['en'];
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Map common timezones to countries and their languages
  const timezoneToLanguages: Record<string, string[]> = {
    // Americas
    'America/New_York': ['en'],
    'America/Los_Angeles': ['en'],
    'America/Chicago': ['en'],
    'America/Denver': ['en'],
    'America/Toronto': ['en', 'fr'],
    'America/Mexico_City': ['es'],
    'America/Sao_Paulo': ['pt'],
    'America/Buenos_Aires': ['es'],
    'America/Santiago': ['es'],
    'America/Lima': ['es'],
    'America/Bogota': ['es'],
    'America/Caracas': ['es'],
    
    // Europe
    'Europe/London': ['en'],
    'Europe/Paris': ['fr'],
    'Europe/Berlin': ['de'],
    'Europe/Rome': ['it'],
    'Europe/Madrid': ['es'],
    'Europe/Amsterdam': ['nl'],
    'Europe/Stockholm': ['sv'],
    'Europe/Oslo': ['no'],
    'Europe/Copenhagen': ['da'],
    'Europe/Helsinki': ['fi'],
    'Europe/Warsaw': ['pl'],
    'Europe/Prague': ['cs'],
    'Europe/Budapest': ['hu'],
    'Europe/Bucharest': ['ro'],
    'Europe/Sofia': ['bg'],
    'Europe/Zagreb': ['hr'],
    'Europe/Bratislava': ['sk'],
    'Europe/Ljubljana': ['sl'],
    'Europe/Tallinn': ['et'],
    'Europe/Riga': ['lv'],
    'Europe/Vilnius': ['lt'],
    'Europe/Athens': ['el'],
    'Europe/Istanbul': ['tr'],
    'Europe/Moscow': ['ru'],
    'Europe/Kiev': ['uk'],
    
    // Asia
    'Asia/Tokyo': ['ja'],
    'Asia/Seoul': ['ko'],
    'Asia/Shanghai': ['zh'],
    'Asia/Hong_Kong': ['zh'],
    'Asia/Taipei': ['zh'],
    'Asia/Singapore': ['en', 'zh', 'ms'],
    'Asia/Bangkok': ['th'],
    'Asia/Jakarta': ['id'],
    'Asia/Manila': ['tl'],
    'Asia/Kolkata': ['hi', 'en'],
    'Asia/Karachi': ['ur'],
    'Asia/Tehran': ['fa'],
    'Asia/Dubai': ['ar'],
    'Asia/Riyadh': ['ar'],
    'Asia/Jerusalem': ['he'],
    
    // Africa
    'Africa/Cairo': ['ar'],
    'Africa/Lagos': ['en'],
    'Africa/Johannesburg': ['en', 'af', 'zu', 'xh'],
    'Africa/Nairobi': ['en', 'sw'],
    'Africa/Addis_Ababa': ['am'],
    
    // Oceania
    'Australia/Sydney': ['en'],
    'Australia/Melbourne': ['en'],
    'Pacific/Auckland': ['en'],
    'Pacific/Fiji': ['en'],
  };

  return timezoneToLanguages[timezone] || ['en'];
}

/**
 * Get current position using geolocation API
 */
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Get country code from coordinates using reverse geocoding
 * This is a simplified version - in production you'd use a proper geocoding service
 */
async function getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    return data.countryCode || null;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Get browser language with fallback
 */
export function getBrowserLanguageWithFallback(): string {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  // Try to get the most specific language first
  const languages = navigator.languages || [navigator.language];
  
  for (const lang of languages) {
    const code = lang.split('-')[0];
    if (code && code.length === 2) {
      return code;
    }
  }
  
  return 'en';
}
