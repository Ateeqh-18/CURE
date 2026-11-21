'use client';

import React, { useState } from 'react';
import {
  PrescriptionData,
  Medicine,
  FoodInstruction,
  SupportedLanguage,
  TimeSlot,
} from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Edit3,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Pill,
  User,
  ShieldAlert,
  FileText,
} from 'lucide-react';

interface ReviewEditSectionProps {
  prescription: PrescriptionData;
  currentLanguage: SupportedLanguage;
  onSave: (updatedData: PrescriptionData) => void;
}

function inferSlotsFromFrequency(freq: string): TimeSlot[] {
  const norm = freq.toLowerCase();
  if (/1-1-1-1|qid|4 times/.test(norm)) return ['morning', 'afternoon', 'evening', 'night'];
  if (/1-1-1|tds|thrice|3 times/.test(norm)) return ['morning', 'afternoon', 'night'];
  if (/1-0-1|bd|twice|2 times/.test(norm)) return ['morning', 'night'];
  if (/0-0-0-1|0-0-1|hs|bedtime|night/.test(norm)) return ['night'];
  if (/0-1-0|afternoon|lunch/.test(norm)) return ['afternoon'];
  if (/1-0-0|od|once|morning/.test(norm)) return ['morning'];
  return [];
}

export const ReviewEditSection: React.FC<ReviewEditSectionProps> = ({
  prescription: initialData,
  currentLanguage,
  onSave,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [data, setData] = useState<PrescriptionData>(initialData);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handlePatientChange = (field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      patientDetails: {
        ...prev.patientDetails,
        [field]: value,
      },
    }));
  };

  const handleAllergyAdd = (allergyText: string) => {
    if (!allergyText.trim()) return;
    setData((prev) => ({
      ...prev,
      patientDetails: {
        ...prev.patientDetails,
        allergies: [...(prev.patientDetails.allergies || []), allergyText.trim()],
      },
    }));
  };

  const handleAllergyRemove = (index: number) => {
    setData((prev) => ({
      ...prev,
      patientDetails: {
        ...prev.patientDetails,
        allergies: prev.patientDetails.allergies.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMedicineChange = (id: string, field: keyof Medicine, value: any) => {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) => {
        if (m.id === id) {
          const updated: Medicine = { ...m, [field]: value };
          if (field === 'frequency' && typeof value === 'string') {
            updated.timeSlots = inferSlotsFromFrequency(value);
          }
          if (field === 'name' || field === 'strength' || field === 'frequency' || field === 'dosage') {
            const remainingUncertain = (m.uncertainFields || []).filter((f) => {
              if (field === 'name' && f.includes('name')) return false;
              if (field === 'strength' && f.includes('strength')) return false;
              if (field === 'frequency' && f.includes('frequency')) return false;
              if (field === 'dosage' && f.includes('dosage')) return false;
              return true;
            });
            updated.uncertainFields = remainingUncertain;
            updated.isUncertain = remainingUncertain.length > 0;
            if (!updated.isUncertain) updated.uncertainReason = undefined;
          }
          return updated;
        }
        return m;
      }),
    }));
  };

  const handleAddMedicine = () => {
    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: 'New Medicine',
      strength: '500 mg',
      dosage: '1 tablet',
      frequency: '1-0-1 (Twice daily)',
      route: 'Oral',
      duration: '5 days',
      foodInstruction: 'After food',
      timeSlots: ['morning', 'night'],
      purposeSimple: 'Prescribed medication as instructed by your doctor.',
      sideEffects: ['Confirm with doctor or pharmacist.'],
      precautions: ['Take as directed.'],
    };

    setData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMed],
    }));
  };

  const handleRemoveMedicine = (id: string) => {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  const handleSave = () => {
    onSave(data);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-teal-600" />
            <span>{t.tabs.review}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.review.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedNotice && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.actions.savedNotice}
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm shadow-teal-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t.actions.saveChanges}</span>
          </button>
        </div>
      </div>

      {/* Vision AI Extraction Metadata Banner (when available) */}
      {data.aiMeta && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xs text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>
                Extracted by{' '}
                {data.aiMeta.provider === 'ollama' ? 'Local Qwen AI (Ollama)' : 'Gemini Cloud Vision'}{' '}
                ({data.aiMeta.model})
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold">
                {data.aiMeta.pagesProcessed} page(s) • {data.aiMeta.durationMs} ms
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase border ${
                  data.aiMeta.overallConfidence === 'high'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : data.aiMeta.overallConfidence === 'medium'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {data.aiMeta.overallConfidence} confidence
              </span>
            </div>
          </div>
          {data.aiMeta.warnings && data.aiMeta.warnings.length > 0 && (
            <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2">
              {data.aiMeta.warnings.join(' • ')}
            </div>
          )}
        </div>
      )}

      {/* Original Typed/Reference Text Viewer (when available) */}
      {data.originalText && (
        <details className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs">
          <summary className="cursor-pointer font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Original Source Text / Notes</span>
          </summary>
          <pre className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl whitespace-pre-wrap font-mono text-[11px] text-slate-700 max-h-64 overflow-y-auto">
            {data.originalText}
          </pre>
        </details>
      )}

      {/* Patient & Clinical Details Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-teal-600" />
          <span>{t.review.patientIdentityTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.fullName}</label>
            <input
              type="text"
              value={data.patientDetails.name || ''}
              onChange={(e) => handlePatientChange('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.age}</label>
            <input
              type="text"
              value={data.patientDetails.age ?? ''}
              onChange={(e) => handlePatientChange('age', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.gender}</label>
            <select
              value={data.patientDetails.gender || 'Not specified'}
              onChange={(e) => handlePatientChange('gender', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Not specified">{t.patient.notSpecified}</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.rxDate}</label>
            <input
              type="text"
              value={data.patientDetails.date || ''}
              onChange={(e) => handlePatientChange('date', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.doctorName}</label>
            <input
              type="text"
              value={data.patientDetails.doctorName || ''}
              onChange={(e) => handlePatientChange('doctorName', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.review.hospitalName}</label>
            <input
              type="text"
              value={data.patientDetails.hospitalName || ''}
              onChange={(e) => handlePatientChange('hospitalName', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
            />
          </div>
        </div>

        {/* Allergies & Allergy Status Editor */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{t.review.allergiesLabel}:</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Allergy Status:</span>
              <select
                value={
                  data.patientDetails.allergyStatus ||
                  (data.patientDetails.allergies?.length ? 'documented' : 'unknown')
                }
                onChange={(e) => handlePatientChange('allergyStatus', e.target.value)}
                className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs font-semibold focus:ring-1 focus:ring-teal-500"
              >
                <option value="unknown">Unknown (Not Mentioned on Rx)</option>
                <option value="none_documented">No Known Allergies (Explicitly Documented / NKDA)</option>
                <option value="documented">Documented Allergies Listed</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.patientDetails.allergies?.map((allergy, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 font-bold text-xs"
              >
                {allergy}
                <button
                  type="button"
                  onClick={() => handleAllergyRemove(idx)}
                  className="text-rose-500 hover:text-rose-800 ms-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              placeholder={t.review.allergyPlaceholder}
              id="new-allergy-input"
              className="px-3 py-1.5 border rounded-lg text-xs flex-1 focus:ring-1 focus:ring-teal-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAllergyAdd((e.target as HTMLInputElement).value);
                  handlePatientChange('allergyStatus', 'documented');
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('new-allergy-input') as HTMLInputElement;
                if (el && el.value) {
                  handleAllergyAdd(el.value);
                  handlePatientChange('allergyStatus', 'documented');
                  el.value = '';
                }
              }}
              className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700"
            >
              {t.actions.addAllergy}
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>
              {t.review.medicinesListTitle} ({data.medicines.length})
            </span>
          </h3>

          <button
            onClick={handleAddMedicine}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 rounded-lg text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actions.addMedicine}</span>
          </button>
        </div>

        {data.medicines.map((med, index) => (
          <div
            key={med.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 ${
              med.isUncertain ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </span>
                <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                {med.originalWrittenName && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    Written: {med.originalWrittenName}
                  </span>
                )}
                {med.confidenceCategory && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      med.confidenceCategory === 'high'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : med.confidenceCategory === 'medium'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {med.confidenceCategory}
                  </span>
                )}
                {med.sourcePage && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    Page {med.sourcePage}
                  </span>
                )}
                {med.isUncertain && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    {t.review.uncertainOcrBadge}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleRemoveMedicine(med.id)}
                className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 text-xs flex items-center gap-1 font-semibold flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.actions.remove}</span>
              </button>
            </div>

            {med.isUncertain && med.uncertainReason && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                ⚠️ {med.uncertainReason}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.genericName}</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(med.id, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.brandNameLabel}</label>
                <input
                  type="text"
                  value={med.brandName || ''}
                  onChange={(e) => handleMedicineChange(med.id, 'brandName', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.strengthLabel}</label>
                <input
                  type="text"
                  value={med.strength}
                  onChange={(e) => handleMedicineChange(med.id, 'strength', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.dosageLabel}</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(med.id, 'dosage', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.frequencyLabel}</label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => handleMedicineChange(med.id, 'frequency', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.foodLabel}</label>
                <select
                  value={med.foodInstruction}
                  onChange={(e) =>
                    handleMedicineChange(med.id, 'foodInstruction', e.target.value as FoodInstruction)
                  }
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                >
                  <option value="After food">{t.foodInstructions.afterFood}</option>
                  <option value="Before food">{t.foodInstructions.beforeFood}</option>
                  <option value="Empty stomach">{t.foodInstructions.emptyStomach}</option>
                  <option value="With food">{t.foodInstructions.withFood}</option>
                  <option value="At bedtime">{t.foodInstructions.atBedtime}</option>
                  <option value="As directed">{t.foodInstructions.asDirected}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.durationLabel}</label>
                <input
                  type="text"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(med.id, 'duration', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.review.routeLabel}</label>
                <input
                  type="text"
                  value={med.route || 'Oral'}
                  onChange={(e) => handleMedicineChange(med.id, 'route', e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">{t.review.purposeLabel}</label>
              <textarea
                rows={2}
                value={med.purposeSimple}
                onChange={(e) => handleMedicineChange(med.id, 'purposeSimple', e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{t.review.saveAndRecalculate}</span>
        </button>
      </div>
    </div>
  );
};
