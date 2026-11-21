'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  PrescriptionData,
  SafetyAlert,
  SupportedLanguage,
  TranslationMeta,
} from '@/lib/types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, TranslationDictionary } from '@/lib/translations';

interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: 'ltr' | 'rtl';
  t: TranslationDictionary;
  isTranslating: boolean;
  translationError: string | null;
  translationMeta: TranslationMeta | null;
  displayPrescription: PrescriptionData;
  displayAlerts: SafetyAlert[];
  retryTranslation: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  basePrescription: PrescriptionData;
  baseAlerts: SafetyAlert[];
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  basePrescription,
  baseAlerts,
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [displayPrescription, setDisplayPrescription] = useState<PrescriptionData>(basePrescription);
  const [displayAlerts, setDisplayAlerts] = useState<SafetyAlert[]>(baseAlerts);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationMeta, setTranslationMeta] = useState<TranslationMeta | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  // Cache translated bundles by content fingerprint + language so switching back is instant
  const cacheRef = useRef<
    Map<string, { prescription: PrescriptionData; alerts: SafetyAlert[]; meta: TranslationMeta }>
  >(new Map());

  const contentSignature = React.useMemo(() => {
    return JSON.stringify({
      id: basePrescription.id,
      patient: basePrescription.patientDetails,
      diagnosis: basePrescription.diagnosis,
      meds: basePrescription.medicines.map((m) => ({
        id: m.id,
        name: m.name,
        brandName: m.brandName,
        strength: m.strength,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        food: m.foodInstruction,
        purpose: m.purposeSimple,
      })),
      alertCount: baseAlerts.length,
      alertIds: baseAlerts.map((a) => a.title),
    });
  }, [basePrescription, baseAlerts]);

  useEffect(() => {
    let cancelled = false;

    async function syncTranslation() {
      if (currentLanguage === 'en') {
        setDisplayPrescription(basePrescription);
        setDisplayAlerts(baseAlerts);
        setTranslationError(null);
        setTranslationMeta({
          language: 'en',
          provider: 'identity',
          fallbackUsed: false,
          translatedAt: new Date().toISOString(),
        });
        setIsTranslating(false);
        return;
      }

      const cacheKey = `${currentLanguage}::${contentSignature}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached && retryCounter === 0) {
        setDisplayPrescription(cached.prescription);
        setDisplayAlerts(cached.alerts);
        setTranslationMeta(cached.meta);
        setTranslationError(null);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      setTranslationError(null);

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prescription: basePrescription,
            alerts: baseAlerts,
            targetLanguage: currentLanguage,
          }),
        });

        const json = await res.json();

        if (cancelled) return;

        if (!res.ok || !json.success) {
          // Preserve original content and display clear warning with retry option
          setDisplayPrescription(basePrescription);
          setDisplayAlerts(baseAlerts);
          setTranslationMeta(json.meta || null);
          setTranslationError(
            json.error ||
              TRANSLATIONS[currentLanguage]?.translation.failedWarning ||
              TRANSLATIONS.en.translation.failedWarning
          );
        } else {
          cacheRef.current.set(cacheKey, {
            prescription: json.prescription,
            alerts: json.alerts,
            meta: json.meta,
          });
          setDisplayPrescription(json.prescription);
          setDisplayAlerts(json.alerts);
          setTranslationMeta(json.meta);
          setTranslationError(null);
        }
      } catch (err: any) {
        if (cancelled) return;
        setDisplayPrescription(basePrescription);
        setDisplayAlerts(baseAlerts);
        setTranslationError(
          err?.message ||
            TRANSLATIONS[currentLanguage]?.translation.failedWarning ||
            TRANSLATIONS.en.translation.failedWarning
        );
      } finally {
        if (!cancelled) setIsTranslating(false);
      }
    }

    syncTranslation();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage, contentSignature, basePrescription, baseAlerts, retryCounter]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setRetryCounter(0);
    setCurrentLanguage(lang);
  }, []);

  const retryTranslation = useCallback(() => {
    setRetryCounter((c) => c + 1);
  }, []);

  const langInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        dir: langInfo.dir,
        t,
        isTranslating,
        translationError,
        translationMeta,
        displayPrescription,
        displayAlerts,
        retryTranslation,
      }}
    >
      <div dir={langInfo.dir} lang={currentLanguage} className="min-h-screen flex flex-col">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
