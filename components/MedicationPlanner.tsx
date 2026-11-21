'use client';

import React, { useMemo } from 'react';
import {
  DoseStatusEntry,
  Medicine,
  ScheduleItem,
  SupportedLanguage,
  TimeSlot,
} from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { localizeFoodInstruction } from '@/lib/clinical-translator';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Sun,
  Sunset,
  Moon,
  Sunrise,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

interface MedicationPlannerProps {
  medicines: Medicine[];
  currentLanguage: SupportedLanguage;
  doseStatusMap: Record<string, DoseStatusEntry>;
  onStatusChange: (scheduleKey: string, status: 'taken' | 'missed' | 'pending') => void;
  onResetAll: () => void;
}

export const MedicationPlanner: React.FC<MedicationPlannerProps> = ({
  medicines,
  currentLanguage,
  doseStatusMap,
  onStatusChange,
  onResetAll,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const { schedule, ambiguousMedicines } = useMemo(() => {
    const items: ScheduleItem[] = [];
    const ambiguous: Medicine[] = [];

    for (const med of medicines) {
      const slots = med.timeSlots || [];
      if (slots.length === 0 || (med.isUncertain && med.uncertainFields?.includes('frequency'))) {
        ambiguous.push(med);
        continue;
      }

      for (const slot of slots) {
        let defaultTime = '08:30 AM';
        if (slot === 'afternoon') defaultTime = '01:30 PM';
        if (slot === 'evening') defaultTime = '06:00 PM';
        if (slot === 'night') defaultTime = '09:30 PM';

        const key = `${med.id}::${slot}`;
        const saved = doseStatusMap[key];

        items.push({
          id: key,
          medicineId: med.id,
          medicineName: med.name,
          localizedMedicineName: med.localizedName,
          brandName: med.brandName,
          dosage: `${med.dosage} (${med.strength})`,
          slot,
          time: defaultTime,
          foodInstruction: med.foodInstruction,
          localizedFoodInstruction:
            med.localizedFoodInstruction ||
            localizeFoodInstruction(med.foodInstruction, currentLanguage),
          status: saved?.status || 'pending',
          takenAt: saved?.takenAt,
          isAmbiguous: med.isUncertain,
        });
      }
    }
    return { schedule: items, ambiguousMedicines: ambiguous };
  }, [medicines, doseStatusMap, currentLanguage]);

  const totalDoses = schedule.length;
  const takenCount = schedule.filter((s) => s.status === 'taken').length;
  const missedCount = schedule.filter((s) => s.status === 'missed').length;
  const pendingCount = schedule.filter((s) => s.status === 'pending').length;
  const progressPercent = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

  const slotsOrder: { slot: TimeSlot; title: string; icon: any; color: string }[] = [
    { slot: 'morning', title: t.timeSlots.morning, icon: Sunrise, color: 'border-amber-200 bg-amber-50/40 text-amber-800' },
    { slot: 'afternoon', title: t.timeSlots.afternoon, icon: Sun, color: 'border-sky-200 bg-sky-50/40 text-sky-800' },
    { slot: 'evening', title: t.timeSlots.evening, icon: Sunset, color: 'border-orange-200 bg-orange-50/40 text-orange-800' },
    { slot: 'night', title: t.timeSlots.night, icon: Moon, color: 'border-indigo-200 bg-indigo-50/40 text-indigo-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Daily Progress Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-teal-600" />
              <span>{t.sections.todaySchedule}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{t.planner.subtitle}</p>
          </div>

          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.actions.resetToday}</span>
          </button>
        </div>

        {/* Progress Bar & Badges */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t.sections.todayProgress}</span>
            <span className="text-teal-700 text-sm font-extrabold">
              {progressPercent}% {t.planner.adherence}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">{t.planner.totalDoses}</div>
              <div className="text-base font-extrabold text-slate-800">{totalDoses}</div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-[10px] text-emerald-700 uppercase font-bold">{t.status.taken}</div>
              <div className="text-base font-extrabold text-emerald-800">{takenCount}</div>
            </div>
            <div className="p-2 bg-sky-50 rounded-lg border border-sky-200">
              <div className="text-[10px] text-sky-700 uppercase font-bold">{t.status.pending}</div>
              <div className="text-base font-extrabold text-sky-800">{pendingCount}</div>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
              <div className="text-[10px] text-rose-700 uppercase font-bold">{t.status.missed}</div>
              <div className="text-base font-extrabold text-rose-800">{missedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambiguous / Unscheduled Medicines Warning */}
      {ambiguousMedicines.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t.planner.ambiguousTitle}</span>
          </div>
          <p className="leading-relaxed">{t.planner.ambiguousDesc}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {ambiguousMedicines.map((m) => (
              <span
                key={m.id}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg font-bold text-amber-900"
              >
                {m.localizedName || m.name} ({m.strength}) — {m.localizedFrequency || m.frequency}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timetable by Time Slots */}
      <div className="space-y-5">
        {slotsOrder.map(({ slot, title, icon: Icon, color }) => {
          const items = schedule.filter((item) => item.slot === slot);
          if (items.length === 0) return null;

          return (
            <div key={slot} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className={`p-4 border-b flex items-center justify-between ${color}`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base">{title}</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                  {items.length}{' '}
                  {items.length === 1 ? t.planner.medicineSingular : t.planner.medicinePlural}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      item.status === 'taken'
                        ? 'bg-emerald-50/30'
                        : item.status === 'missed'
                        ? 'bg-rose-50/20'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.localizedMedicineName || item.medicineName}
                        </span>
                        <span className="text-xs font-bold text-teal-700">{item.dosage}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Utensils className="w-3 h-3 text-amber-600" />
                          {item.localizedFoodInstruction}
                        </span>
                        {item.status === 'taken' && item.takenAt && (
                          <span className="text-emerald-700 font-semibold">
                            ✓ {t.planner.takenAt} {item.takenAt}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.status === 'taken' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            {t.status.taken}
                          </span>
                          <button
                            onClick={() => onStatusChange(item.id, 'pending')}
                            className="text-xs text-slate-400 hover:text-slate-600 underline"
                          >
                            {t.actions.undo}
                          </button>
                        </div>
                      ) : item.status === 'missed' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            {t.status.missed}
                          </span>
                          <button
                            onClick={() => onStatusChange(item.id, 'pending')}
                            className="text-xs text-slate-400 hover:text-slate-600 underline"
                          >
                            {t.actions.undo}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onStatusChange(item.id, 'taken')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.actions.markTaken}</span>
                          </button>

                          <button
                            onClick={() => onStatusChange(item.id, 'missed')}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{t.actions.markMissed}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
