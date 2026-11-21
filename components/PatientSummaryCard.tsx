'use client';

import React from 'react';
import {
  AiProcessingMeta,
  ConfidenceCategory,
  PatientDetails,
  SupportedLanguage,
} from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  User,
  Hospital,
  Calendar,
  AlertTriangle,
  Pill,
  ShieldAlert,
  FileCheck2,
  Cloud,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface PatientSummaryCardProps {
  patientDetails: PatientDetails;
  confidence?: number;
  overallConfidenceCategory?: ConfidenceCategory;
  aiMeta?: AiProcessingMeta;
  uncertainFields: string[];
  currentLanguage: SupportedLanguage;
  isDemo?: boolean;
}

function deriveCategory(
  explicit?: ConfidenceCategory,
  numeric?: number
): ConfidenceCategory {
  if (explicit) return explicit;
  if (typeof numeric === 'number') {
    if (numeric >= 85) return 'high';
    if (numeric >= 60) return 'medium';
    return 'low';
  }
  return 'medium';
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patientDetails,
  confidence,
  overallConfidenceCategory,
  aiMeta,
  uncertainFields,
  currentLanguage,
  isDemo,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const hasAllergies = patientDetails.allergies && patientDetails.allergies.length > 0;
  const isExplicitNoneAllergies =
    !hasAllergies && patientDetails.allergyStatus === 'none_documented';
  const hasExistingMeds =
    patientDetails.existingMedications && patientDetails.existingMedications.length > 0;

  const category = deriveCategory(overallConfidenceCategory, confidence);
  const categoryStyle =
    category === 'high'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : category === 'medium'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-rose-50 border-rose-200 text-rose-900';

  const categoryLabel =
    category === 'high' ? 'High Confidence' : category === 'medium' ? 'Medium — Review Needed' : 'Low — Verify Carefully';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Patient Identity */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-slate-900">
                {patientDetails.name || t.patient.notSpecified}
              </h3>
              {(patientDetails.age || patientDetails.gender) && (
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                  {patientDetails.age
                    ? `${patientDetails.age} ${t.patient.yearsOld}`
                    : t.patient.notSpecified}
                  {' / '}
                  {patientDetails.gender || t.patient.notSpecified}
                </span>
              )}
              {isDemo && (
                <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-semibold">
                  {t.patient.sampleCaseTag}
                </span>
              )}
              {aiMeta && (
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1 ${
                    aiMeta.provider === 'ollama'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}
                >
                  {aiMeta.provider === 'ollama' ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Cloud className="w-3 h-3" />
                  )}
                  {aiMeta.provider === 'ollama' ? 'Local Qwen AI' : 'Gemini Cloud'} •{' '}
                  {aiMeta.pagesProcessed}p
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              {patientDetails.hospitalName && (
                <span className="flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-slate-400" />
                  {patientDetails.hospitalName}
                </span>
              )}
              {patientDetails.doctorName && (
                <span className="text-slate-600 font-medium">• {patientDetails.doctorName}</span>
              )}
              {patientDetails.uhid && (
                <span className="text-slate-400">
                  • {t.patient.uhid}: {patientDetails.uhid}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Categorical Confidence & Date */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`px-3 py-2 border rounded-xl flex items-center gap-2 ${categoryStyle}`}>
            <FileCheck2 className="w-4 h-4 flex-shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                {t.patient.clinicalConfidence}
              </div>
              <div className="text-xs font-bold">{categoryLabel}</div>
            </div>
          </div>

          {patientDetails.date && (
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 text-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{patientDetails.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Allergies and Existing Meds Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
        <div
          className={`p-3 rounded-xl border text-xs ${
            hasAllergies
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : isExplicitNoneAllergies
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/60 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1.5">
            {hasAllergies ? (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            ) : isExplicitNoneAllergies ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{t.patient.documentedAllergies}:</span>
          </div>
          {hasAllergies ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {patientDetails.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold border border-rose-200"
                >
                  {allergy}
                </span>
              ))}
            </div>
          ) : isExplicitNoneAllergies ? (
            <p className="text-emerald-800">
              No known drug allergies explicitly documented on prescription (NKDA).
            </p>
          ) : (
            <p className="text-amber-800">{t.patient.noAllergiesRecorded}</p>
          )}
        </div>

        <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-xs text-slate-800">
          <div className="flex items-center gap-1.5 font-bold mb-1.5 text-slate-700">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>{t.patient.existingMedications}:</span>
          </div>
          {hasExistingMeds ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {patientDetails.existingMedications.map((med, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-slate-300 text-slate-800 rounded font-medium"
                >
                  {med}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">{t.patient.noExistingMeds}</p>
          )}
        </div>
      </div>

      {/* Uncertain fields alert */}
      {uncertainFields && uncertainFields.length > 0 && (
        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t.patient.reviewRequiredFor}: </span>
            <span>{uncertainFields.join(' • ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
