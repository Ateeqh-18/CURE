'use client';

import React from 'react';
import { Medicine, SupportedLanguage, TimeSlot } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { localizeFoodInstruction } from '@/lib/clinical-translator';
import {
  Pill,
  Utensils,
  AlertCircle,
  ShieldAlert,
  Info,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  currentLanguage: SupportedLanguage;
  onEdit?: () => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const getFoodBadgeColor = (instruction: string) => {
    switch (instruction) {
      case 'Empty stomach':
      case 'Before food':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'After food':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'At bedtime':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const localizedSlot = (slot: TimeSlot) => {
    switch (slot) {
      case 'morning':
        return t.timeSlots.morning;
      case 'afternoon':
        return t.timeSlots.afternoon;
      case 'evening':
        return t.timeSlots.evening;
      case 'night':
        return t.timeSlots.night;
    }
  };

  const foodDisplay =
    medicine.localizedFoodInstruction ||
    localizeFoodInstruction(medicine.foodInstruction, currentLanguage);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
        medicine.isUncertain ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
      }`}
    >
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/70 to-white">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 flex-shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-lg text-slate-900 tracking-tight">
                {medicine.localizedName || medicine.name}
              </h4>
              {medicine.strength && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {medicine.strength}
                </span>
              )}
              {medicine.confidenceCategory && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    medicine.confidenceCategory === 'high'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : medicine.confidenceCategory === 'medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {medicine.confidenceCategory} confidence
                </span>
              )}
              {medicine.sourcePage && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Page {medicine.sourcePage}
                </span>
              )}
              {medicine.isUncertain && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {t.medicine.manualVerificationNeeded}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              <span>{t.review.genericName}: </span>
              <span className="text-slate-800 font-semibold">{medicine.name}</span>
              {medicine.brandName && (
                <>
                  {' • '}
                  <span>{t.medicine.brandName}: </span>
                  <span className="text-slate-800 font-semibold">{medicine.brandName}</span>
                </>
              )}
              {medicine.originalWrittenName &&
                medicine.originalWrittenName.toLowerCase() !== medicine.name.toLowerCase() && (
                  <>
                    {' • '}
                    <span>Written on Rx: </span>
                    <span className="font-mono text-slate-700">{medicine.originalWrittenName}</span>
                  </>
                )}
            </p>
          </div>
        </div>

        {/* Food instruction & Route badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${getFoodBadgeColor(
              medicine.foodInstruction
            )}`}
          >
            <Utensils className="w-3.5 h-3.5" />
            {foodDisplay}
          </span>
          {(medicine.localizedRoute || medicine.route) && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              {medicine.localizedRoute || medicine.route}
            </span>
          )}
        </div>
      </div>

      {/* Uncertainty Notice */}
      {medicine.isUncertain && medicine.uncertainReason && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>{medicine.uncertainReason}</span>
        </div>
      )}

      {/* Body content */}
      <div className="p-5 space-y-4">
        {/* Purpose */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            {t.sections.purpose}
          </h5>
          <p className="text-sm text-slate-700 leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100">
            {medicine.purposeSimple}
          </p>
        </div>

        {/* Administration details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">{t.sections.dosage}</div>
            <div className="font-bold text-slate-800 mt-0.5">{medicine.dosage}</div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">{t.sections.frequency}</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {medicine.localizedFrequency || medicine.frequency}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">{t.sections.duration}</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {medicine.localizedDuration || medicine.duration}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">{t.sections.dailySlots}</div>
            <div className="font-bold text-teal-700 mt-0.5">
              {medicine.timeSlots && medicine.timeSlots.length > 0
                ? medicine.timeSlots.map(localizedSlot).join(', ')
                : t.actions.verifyWithDoctor}
            </div>
          </div>
        </div>

        {medicine.additionalInstructions && (
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900">
            <strong>{t.medicine.additionalInstructions}: </strong>
            {medicine.additionalInstructions}
          </div>
        )}

        {/* Side effects & Precautions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>{t.sections.precautions}</span>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc ps-4">
              {medicine.precautions?.map((p, idx) => (
                <li key={idx} className="leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-slate-500" />
              <span>{t.sections.sideEffects}</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc ps-4">
              {medicine.sideEffects?.map((s, idx) => (
                <li key={idx} className="leading-relaxed">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
