'use client';

import React from 'react';
import { PrescriptionData, SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { MedicineCard } from './MedicineCard';
import {
  Stethoscope,
  Apple,
  ShieldCheck,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface TreatmentGuideSectionProps {
  prescription: PrescriptionData;
  currentLanguage: SupportedLanguage;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
  pdfError?: string | null;
  onEditReview?: () => void;
}

export const TreatmentGuideSection: React.FC<TreatmentGuideSectionProps> = ({
  prescription,
  currentLanguage,
  onDownloadPdf,
  isGeneratingPdf = false,
  pdfError,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const diagnoses =
    prescription.localizedDiagnosis && prescription.localizedDiagnosis.length > 0
      ? prescription.localizedDiagnosis
      : prescription.diagnosis;

  return (
    <div className="space-y-6">
      {/* Header Bar with Real Multilingual PDF Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span>{t.tabs.treatmentGuide}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.guide.subtitle}</p>
        </div>

        <button
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white transition-colors shadow-sm shadow-teal-600/25 w-fit cursor-pointer disabled:cursor-wait"
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isGeneratingPdf ? t.actions.generatingPdf : t.actions.downloadReport}</span>
        </button>
      </div>

      {pdfError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{pdfError}</span>
        </div>
      )}

      {/* Part A: Understanding Your Diagnosis */}
      <div className="bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-white border border-teal-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <h3 className="font-bold text-lg text-slate-900">{t.sections.diagnosisTitle}</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {diagnoses?.map((diag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-white border border-teal-300 text-teal-900 font-bold rounded-lg text-xs shadow-2xs"
            >
              {diag}
            </span>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-teal-100 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
            {t.sections.diagnosisSubtitle}
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {prescription.diagnosisSimplified}
          </p>
        </div>

        {prescription.symptoms && prescription.symptoms.length > 0 && (
          <div className="mt-4 pt-3 border-t border-teal-100 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
            <span className="font-bold text-slate-700">{t.sections.symptoms}:</span>
            {prescription.symptoms.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Part B: Daily Treatment Instructions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            B
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{t.guide.dailyCareTitle}</h3>
            <p className="text-xs text-slate-500">{t.guide.dailyCareSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t.guide.morningRoutineTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.guide.morningRoutineDesc}</p>
          </div>

          <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>{t.guide.afternoonRoutineTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.guide.afternoonRoutineDesc}</p>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{t.guide.nightRoutineTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.guide.nightRoutineDesc}</p>
          </div>
        </div>
      </div>

      {/* Part C: Medicine Cards List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
            C
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {t.sections.medicineCardsTitle} ({prescription.medicines?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">{t.guide.medicineCardsSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {prescription.medicines?.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
              {t.medicine.noMedicines}
            </div>
          ) : (
            prescription.medicines?.map((med) => (
              <MedicineCard
                key={med.id}
                medicine={med}
                currentLanguage={currentLanguage}
              />
            ))
          )}
        </div>
      </div>

      {/* General Precautions & Dietary Advice */}
      {(prescription.generalPrecautions?.length > 0 || prescription.dietaryAdvice?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{t.sections.generalPrecautions}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {prescription.generalPrecautions?.map((prec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{prec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              <span>{t.sections.dietaryAdvice}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {prescription.dietaryAdvice?.map((diet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{diet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
