
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Language } from '../i18n';
import { translateText } from '../lib/translate';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultText?: string) => string;
    translate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('app-language');
        return (saved as Language) || 'id';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
    }, [language]);

    const t = (key: string, defaultText: string = '') => {
        return dictionary[language]?.[key] || defaultText || key;
    };

    const translate = async (text: string) => {
        if (language === 'id') return text; // Assuming source is ID
        return await translateText(text, language);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
