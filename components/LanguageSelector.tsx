'use client';

import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/translations';
import { SupportedLanguage } from '@/lib/types';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = ''
}) => {
  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex items-center gap-1.5 bg-white border border-teal-200 hover:border-teal-400 rounded-lg px-3 py-1.5 shadow-sm transition-all text-sm font-medium text-slate-700">
        <Globe className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="appearance-none bg-transparent pr-5 py-0.5 focus:outline-none cursor-pointer font-medium text-slate-800"
          aria-label="Select preferred language"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-800 py-1">
              {lang.flag} {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};
