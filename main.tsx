"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of your translations
export interface Translations {
  [key: string]: string | Translations;
}

// Available languages
export type Language = 'en' | 'es' | 'fr'; // Add more as needed

// Translation files
const translations: Record<Language, Translations> = {
  en: {
    account: {
        signin: "Sign In",
        signup: "Sign Up",
        required: "You need to be signed in to continue.",
    },
    // Upload page
    upload: {
      title: "Upload a Document to Post",
      signInRequired: "You Need to be Signed in to do this.",
    },
    // PDF Reader
    reader: {
      startingUp: "Starting up...",
      pages: "Pages",
      tools: "Tools",
      goBack: "Go Back",
      tool1: "Tool 1",
      tool2: "Tool 2",
      tool1Description: "Download the current page as a PDF.",
      useTool: "Use Tool",
      learnMore: "Learn More",
      // Tooltips
      tooltips: {
        pages: "Pages",
        addToContinue: "Add to Continue Reading.",
        saveToFolder: "Save to a Folder.",
        toggleTheme: "Toggle Theme.",
        fullscreen: "Fullscreen.",
        tools: "Tools"
      }
    }
  },
  es: {
    upload: {
      title: "Subir un Documento para Publicar",
      signInRequired: "Necesitas estar registrado para hacer esto.",
    },
    reader: {
      startingUp: "Iniciando...",
      pages: "Páginas",
      tools: "Herramientas",
      goBack: "Volver",
      tool1: "Herramienta 1",
      tool2: "Herramienta 2",
      tool1Description: "Descargar la página actual como PDF.",
      useTool: "Usar Herramienta",
      learnMore: "Saber Más",
      tooltips: {
        pages: "Páginas",
        addToContinue: "Agregar a Continuar Leyendo.",
        saveToFolder: "Guardar en una Carpeta.",
        toggleTheme: "Cambiar Tema.",
        fullscreen: "Pantalla Completa.",
        tools: "Herramientas"
      }
    }
  },
  fr: {
    upload: {
      title: "Télécharger un Document à Publier",
      signInRequired: "Vous devez être connecté pour faire cela.",
    },
    reader: {
      startingUp: "Démarrage...",
      pages: "Pages",
      tools: "Outils",
      goBack: "Retour",
      tool1: "Outil 1",
      tool2: "Outil 2",
      tool1Description: "Télécharger la page actuelle en PDF.",
      useTool: "Utiliser l'Outil",
      learnMore: "En Savoir Plus",
      tooltips: {
        pages: "Pages",
        addToContinue: "Ajouter à Continuer la Lecture.",
        saveToFolder: "Sauvegarder dans un Dossier.",
        toggleTheme: "Basculer le Thème.",
        fullscreen: "Plein Écran.",
        tools: "Outils"
      }
    }
  }
};

// Context type
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to get nested translation
function getNestedTranslation(translations: Translations, key: string): string {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof current === 'string' ? current : key;
}

// Provider component
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
