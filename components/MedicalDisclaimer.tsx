'use client';

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

interface MedicalDisclaimerProps {
  currentLanguage: SupportedLanguage;
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  currentLanguage,
  compact = false,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  if (compact) {
    return (
      <div className="bg-amber-50 border-s-4 border-amber-500 p-2.5 rounded-e-md text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t.disclaimerText}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-teal-100 rounded-lg text-teal-700 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
            <span>{t.disclaimerTitle}</span>
            <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">
              {t.disclaimerTag}
            </span>
          </h4>
          <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
            {t.disclaimerText}
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {t.disclaimerBullets.map((b, i) => (
              <span key={i}>• {b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
