'use client';

import React from 'react';
import { Investigation, FollowUp, SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  CheckSquare,
  Calendar,
  FileCheck,
  CheckCircle2,
  CalendarCheck2,
} from 'lucide-react';

interface InvestigationTrackerProps {
  investigations: Investigation[];
  followUp: FollowUp;
  currentLanguage: SupportedLanguage;
  completedMap: Record<string, boolean>;
  onToggleInvestigation: (id: string) => void;
  followUpCompleted: boolean;
  onToggleFollowUp: () => void;
}

export const InvestigationTracker: React.FC<InvestigationTrackerProps> = ({
  investigations,
  followUp,
  currentLanguage,
  completedMap,
  onToggleInvestigation,
  followUpCompleted,
  onToggleFollowUp,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const isCompleted = (inv: Investigation) =>
    completedMap[inv.id] !== undefined ? completedMap[inv.id] : inv.completed;

  const completedCount = investigations.filter(isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-600" />
              <span>{t.sections.investigationsTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{t.investigations.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl w-fit">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>
              {completedCount} / {investigations.length} {t.investigations.testsDone}
            </span>
          </div>
        </div>
      </div>

      {/* Doctor Follow-Up Appointment Card */}
      <div
        className={`rounded-2xl border p-6 shadow-sm transition-all ${
          followUpCompleted ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-teal-200'
        }`}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 flex-shrink-0">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg text-slate-900">{t.sections.followUpTitle}</h3>
                {followUp.appointmentDate ? (
                  <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200">
                    {t.investigations.scheduled}: {followUp.appointmentDate}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300">
                    {t.investigations.dateNotSpecified}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                {followUp.doctorName && (
                  <div className="font-semibold text-slate-800">
                    {t.investigations.consultant}: {followUp.doctorName}
                  </div>
                )}
                {followUp.department && (
                  <div className="text-slate-500">
                    {t.investigations.department}: {followUp.department}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onToggleFollowUp}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
              followUpCompleted
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{followUpCompleted ? t.actions.attended : t.actions.markAttended}</span>
          </button>
        </div>

        {followUp.instructions && (
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl text-xs text-slate-700 leading-relaxed">
            <strong className="font-bold text-slate-800">
              {t.investigations.preVisitInstructions}:{' '}
            </strong>
            <span>{followUp.instructions}</span>
          </div>
        )}
      </div>

      {/* Diagnostic Tests List */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-teal-600" />
          <span>
            {t.investigations.diagnosticTestsTitle} ({investigations.length})
          </span>
        </h3>

        {investigations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
            {t.investigations.noTestsListed}
          </div>
        ) : (
          investigations.map((inv) => {
            const done = isCompleted(inv);
            return (
              <div
                key={inv.id}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  done ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onToggleInvestigation(inv.id)}
                    className="w-5 h-5 mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    id={`inv-${inv.id}`}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={`inv-${inv.id}`}
                      className={`font-bold text-sm sm:text-base cursor-pointer ${
                        done ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {inv.name}
                    </label>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-700">{t.investigations.purposeLabel}: </strong>
                      {inv.purpose}
                    </p>

                    {inv.instructions && (
                      <p className="text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80 inline-block font-medium">
                        ⚠️ {t.investigations.preparationLabel}: {inv.instructions}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                  {inv.dueDate && (
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {t.investigations.dueLabel}: {inv.dueDate}
                    </span>
                  )}

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      done
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {done ? t.status.completed : t.status.pending}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
