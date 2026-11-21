'use client';

import React from 'react';
import { DEMO_PRESCRIPTIONS } from '@/lib/demo-data';
import { PrescriptionData, SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { localizeDiseaseName } from '@/lib/clinical-translator';
import { Sparkles, X, User, ArrowRight } from 'lucide-react';

interface DemoSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (prescription: PrescriptionData) => void;
  currentLanguage: SupportedLanguage;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  currentLanguage,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const cases = [
    {
      key: 'cardio_diabetic',
      title: 'Cardio-Diabetic Discharge Summary',
      hospital: 'Manipal Hospital, Bengaluru',
      patient: 'Ramesh Kumar (58/M)',
      diagnosis: [
        'Type 2 Diabetes Mellitus',
        'Essential Hypertension',
        'Dyslipidemia',
      ]
        .map((d) => localizeDiseaseName(d, currentLanguage))
        .join(', '),
      highlights: [
        '5 Indian medications (Glycomet 500 SR, Amaryl 1mg, Telma 40, Atorva 20, Pan 40)',
        'Pre & Post Meal Schedule + Sulfa allergy review',
        'Scheduled HbA1c & Fasting blood sugar tests',
      ],
      tag: 'Chronic Care & Discharge',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      key: 'bronchitis_allergy_risk',
      title: 'Acute Bronchitis (Critical Allergy Conflict)',
      hospital: 'Apollo Clinic, Mumbai',
      patient: 'Priya Sharma (34/F)',
      diagnosis: ['Acute Bacterial Bronchitis', 'High Grade Pyrexia']
        .map((d) => localizeDiseaseName(d, currentLanguage))
        .join(', '),
      highlights: [
        'Penicillin allergy vs Prescribed Augmentin 625 Duo (Amoxicillin)',
        'Safety Engine flags critical allergic cross-reactivity',
        'Dolo 650 + Montair LC + CBC & Chest X-Ray',
      ],
      tag: 'Critical Allergy Warning Demo',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      key: 'ortho_duplicate_nsaid',
      title: 'Orthopedic Knee Care (Duplicate Paracetamol)',
      hospital: 'Fortis Healthcare, New Delhi',
      patient: 'Harpreet Singh (62/M)',
      diagnosis: localizeDiseaseName('Severe Osteoarthritis Right Knee', currentLanguage),
      highlights: [
        'Prescribed Dolo 650 AND Combiflam simultaneously',
        'Safety Engine flags duplicate Paracetamol active ingredient',
        'Unrecorded allergy vigilance alert + Knee X-Ray tracking',
      ],
      tag: 'Duplicate Ingredient Warning Demo',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute end-5 top-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.demo.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.demo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.demo.subtitle}</p>
        </div>

        <div className="space-y-3.5">
          {cases.map((c) => {
            const rxData = DEMO_PRESCRIPTIONS[c.key];
            return (
              <div
                key={c.key}
                onClick={() => {
                  if (rxData) {
                    onSelectCase(rxData);
                    onClose();
                  }
                }}
                className="group border border-slate-200 hover:border-teal-400 rounded-2xl p-4 sm:p-5 bg-slate-50/50 hover:bg-teal-50/30 cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                    {c.title}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border w-fit ${c.tagColor}`}
                  >
                    {c.tag}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{c.patient}</span>
                    <span className="text-slate-400">• {c.hospital}</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-800">{t.demo.diagnosisLabel}: </strong>
                    {c.diagnosis}
                  </div>
                </div>

                <ul className="text-xs text-slate-600 space-y-1 ps-4 list-disc border-t border-slate-200/60 pt-2.5">
                  {c.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-end text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                  <span>{t.actions.loadCase}</span>
                  <ArrowRight className="w-3.5 h-3.5 ms-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          <strong className="font-bold">{t.demo.syntheticNoticeTitle}: </strong>
          {t.demo.syntheticNoticeDesc}
        </div>
      </div>
    </div>
  );
};
