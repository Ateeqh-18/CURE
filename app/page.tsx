'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  DoseStatusEntry,
  PrescriptionData,
  SafetyAlert,
} from '@/lib/types';
import { DEMO_PRESCRIPTIONS } from '@/lib/demo-data';
import { runMedicationSafetyCheck } from '@/lib/safety-engine';
import { SUPPORTED_LANGUAGES } from '@/lib/translations';

// Global Language Provider
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';

// Components
import { Navbar } from '@/components/Navbar';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { PatientSummaryCard } from '@/components/PatientSummaryCard';
import { TreatmentGuideSection } from '@/components/TreatmentGuideSection';
import { MedicineCard } from '@/components/MedicineCard';
import { MedicationPlanner } from '@/components/MedicationPlanner';
import { SafetyDashboard } from '@/components/SafetyDashboard';
import { InvestigationTracker } from '@/components/InvestigationTracker';
import { ReviewEditSection } from '@/components/ReviewEditSection';
import { UploadSection } from '@/components/UploadSection';
import { DemoSelector } from '@/components/DemoSelector';

// Icons
import {
  Stethoscope,
  Pill,
  CheckSquare,
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  AlertOctagon,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface CureShellProps {
  basePrescription: PrescriptionData;
  onPrescriptionChange: (rx: PrescriptionData, resetTrackers?: boolean) => void;
  doseStatusMap: Record<string, DoseStatusEntry>;
  onDoseStatusChange: (key: string, status: 'taken' | 'missed' | 'pending') => void;
  onResetDoses: () => void;
  investigationCompletedMap: Record<string, boolean>;
  onToggleInvestigation: (id: string) => void;
  followUpCompleted: boolean;
  onToggleFollowUp: () => void;
}

const CureWorkspace: React.FC<CureShellProps> = ({
  basePrescription,
  onPrescriptionChange,
  doseStatusMap,
  onDoseStatusChange,
  onResetDoses,
  investigationCompletedMap,
  onToggleInvestigation,
  followUpCompleted,
  onToggleFollowUp,
}) => {
  const {
    currentLanguage,
    setLanguage,
    t,
    isTranslating,
    translationError,
    displayPrescription,
    displayAlerts,
    retryTranslation,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const criticalAlerts = displayAlerts.filter((a) => a.severity === 'critical');
  const highAlerts = displayAlerts.filter((a) => a.severity === 'high');

  const diagnoses =
    displayPrescription.localizedDiagnosis && displayPrescription.localizedDiagnosis.length > 0
      ? displayPrescription.localizedDiagnosis
      : displayPrescription.diagnosis;

  const handleSelectCase = (rx: PrescriptionData) => {
    onPrescriptionChange(rx, true);
    setActiveTab('dashboard');
  };

  const handleUploadSuccess = (newRx: PrescriptionData) => {
    onPrescriptionChange(newRx, true);
    setShowUploadModal(false);
    setActiveTab('review');
  };

  const handleSaveReviewedData = (updatedRx: PrescriptionData) => {
    // Keep existing tracking state when editing details
    onPrescriptionChange(updatedRx, false);
  };

  const handleDownloadPdf = useCallback(async () => {
    setIsGeneratingPdf(true);
    setPdfError(null);
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescription: displayPrescription,
          alerts: displayAlerts,
          language: currentLanguage,
        }),
      });

      if (!res.ok) {
        let errText = t.pdf.errorGenerating;
        try {
          const errJson = await res.json();
          if (errJson?.error) errText = errJson.error;
        } catch {
          // ignore
        }
        throw new Error(errText);
      }

      const blob = await res.blob();
      if (blob.size < 500) {
        throw new Error('Generated PDF appears empty. Please retry.');
      }

      const langInfo =
        SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
      const fileName = `Cure_Treatment_Report_${langInfo.name}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setPdfError(err?.message || t.pdf.errorGenerating);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [displayPrescription, displayAlerts, currentLanguage, t.pdf.errorGenerating]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'upload') {
            setShowUploadModal(true);
          } else {
            setActiveTab(tab);
            setShowUploadModal(false);
          }
        }}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenUpload={() => setShowUploadModal(true)}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        isDemoActive={displayPrescription.isDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Translation Status / Error Banners */}
        {isTranslating && (
          <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-900 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
            <span>{t.translation.translatingNotice}</span>
          </div>
        )}

        {translationError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{translationError}</span>
            </div>
            <button
              onClick={retryTranslation}
              className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.actions.retryTranslation}</span>
            </button>
          </div>
        )}

        {pdfError && activeTab !== 'guide' && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{pdfError}</span>
            </div>
            <button onClick={() => setPdfError(null)} className="underline text-xs font-semibold">
              ×
            </button>
          </div>
        )}

        {/* Prominent Medical Disclaimer Banner */}
        <MedicalDisclaimer currentLanguage={currentLanguage} />

        {/* Upload View */}
        {showUploadModal ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                ← {t.actions.back}
              </button>
            </div>
            <UploadSection
              onSuccess={handleUploadSuccess}
              onOpenDemo={() => {
                setShowUploadModal(false);
                setIsDemoModalOpen(true);
              }}
              currentLanguage={currentLanguage}
            />
          </div>
        ) : (
          <>
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <PatientSummaryCard
                  patientDetails={displayPrescription.patientDetails}
                  confidence={displayPrescription.extractionConfidence}
                  overallConfidenceCategory={displayPrescription.overallConfidenceCategory}
                  aiMeta={displayPrescription.aiMeta}
                  uncertainFields={displayPrescription.uncertainFields}
                  currentLanguage={currentLanguage}
                  isDemo={displayPrescription.isDemo}
                />

                {/* Critical Safety Notice */}
                {(criticalAlerts.length > 0 || highAlerts.length > 0) && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-200 text-rose-800 rounded-xl flex-shrink-0 mt-0.5">
                        <AlertOctagon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-rose-950 text-sm sm:text-base">
                          {criticalAlerts.length > 0
                            ? t.dashboard.criticalConcernTitle
                            : t.dashboard.highRiskTitle}
                        </h4>
                        <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                          {criticalAlerts[0]?.title || highAlerts[0]?.title}:{' '}
                          {criticalAlerts[0]?.description || highAlerts[0]?.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('safety')}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {t.dashboard.reviewAlertsBtn} ({displayAlerts.length})
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Quick Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1: Diagnosis */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {t.dashboard.diagnosisLabel}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {diagnoses?.length || 0} {t.dashboard.conditionsCount}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {diagnoses?.[0] || t.dashboard.clinicalReviewFallback}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {displayPrescription.diagnosisSimplified}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('guide')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-2 border-t border-slate-100"
                    >
                      <span>{t.tabs.treatmentGuide}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Active Medications */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5" />
                          {t.dashboard.activeMedications}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {displayPrescription.medicines?.length || 0} {t.dashboard.prescribedCount}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {displayPrescription.medicines?.slice(0, 3).map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-xs gap-2">
                            <span className="font-semibold text-slate-800 truncate">
                              {m.localizedName || m.name}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px] flex-shrink-0">
                              {m.strength}
                            </span>
                          </div>
                        ))}
                        {(displayPrescription.medicines?.length || 0) > 3 && (
                          <p className="text-[11px] text-slate-400">
                            + {(displayPrescription.medicines?.length || 0) - 3}{' '}
                            {t.dashboard.moreMedications}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('medicines')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-2 border-t border-slate-100"
                    >
                      <span>{t.dashboard.viewMedicineDetailsBtn}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3: Follow-up & Tests */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                          <CalendarCheck className="w-3.5 h-3.5" />
                          {t.dashboard.nextFollowUp}
                        </span>
                        {displayPrescription.followUp.appointmentDate ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {displayPrescription.followUp.appointmentDate}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {t.dashboard.asAdvised}
                          </span>
                        )}
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="font-bold text-slate-800">
                          {displayPrescription.followUp.doctorName || t.dashboard.consultantFallback}
                        </div>
                        <p className="text-slate-500 line-clamp-2">
                          {displayPrescription.followUp.instructions}
                        </p>
                      </div>

                      <div className="pt-1 text-xs text-slate-600 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {displayPrescription.investigations?.length || 0}{' '}
                          {t.dashboard.testsAdvised}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('investigations')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-2 border-t border-slate-100"
                    >
                      <span>{t.dashboard.trackTestsBtn}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Embedded Daily Schedule Tracker */}
                <div className="pt-2">
                  <MedicationPlanner
                    medicines={displayPrescription.medicines}
                    currentLanguage={currentLanguage}
                    doseStatusMap={doseStatusMap}
                    onStatusChange={onDoseStatusChange}
                    onResetAll={onResetDoses}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PATIENT TREATMENT GUIDE */}
            {activeTab === 'guide' && (
              <TreatmentGuideSection
                prescription={displayPrescription}
                currentLanguage={currentLanguage}
                onDownloadPdf={handleDownloadPdf}
                isGeneratingPdf={isGeneratingPdf}
                pdfError={pdfError}
                onEditReview={() => setActiveTab('review')}
              />
            )}

            {/* TAB 3: MEDICINES */}
            {activeTab === 'medicines' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-600" />
                      <span>{t.sections.medicineCardsTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{t.guide.medicineCardsSubtitle}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('review')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors w-fit"
                  >
                    {t.actions.editDetails}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {displayPrescription.medicines?.map((med) => (
                    <MedicineCard
                      key={med.id}
                      medicine={med}
                      currentLanguage={currentLanguage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SCHEDULE & PLANNER */}
            {activeTab === 'schedule' && (
              <MedicationPlanner
                medicines={displayPrescription.medicines}
                currentLanguage={currentLanguage}
                doseStatusMap={doseStatusMap}
                onStatusChange={onDoseStatusChange}
                onResetAll={onResetDoses}
              />
            )}

            {/* TAB 5: SAFETY DASHBOARD */}
            {activeTab === 'safety' && (
              <SafetyDashboard alerts={displayAlerts} currentLanguage={currentLanguage} />
            )}

            {/* TAB 6: INVESTIGATIONS & FOLLOW-UP */}
            {activeTab === 'investigations' && (
              <InvestigationTracker
                investigations={displayPrescription.investigations || []}
                followUp={displayPrescription.followUp}
                currentLanguage={currentLanguage}
                completedMap={investigationCompletedMap}
                onToggleInvestigation={onToggleInvestigation}
                followUpCompleted={followUpCompleted}
                onToggleFollowUp={onToggleFollowUp}
              />
            )}

            {/* TAB 7: REVIEW & EDIT (always edits canonical basePrescription!) */}
            {activeTab === 'review' && (
              <ReviewEditSection
                prescription={basePrescription}
                currentLanguage={currentLanguage}
                onSave={handleSaveReviewedData}
              />
            )}
          </>
        )}
      </main>

      {/* Demo Selector Modal */}
      <DemoSelector
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectCase={handleSelectCase}
        currentLanguage={currentLanguage}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">{t.footer.tagline}</p>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">{t.footer.capabilities}</p>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  const [basePrescription, setBasePrescription] = useState<PrescriptionData>(
    DEMO_PRESCRIPTIONS.cardio_diabetic
  );

  // Lifted tracking states so switching languages or tabs NEVER resets user progress!
  const [doseStatusMap, setDoseStatusMap] = useState<Record<string, DoseStatusEntry>>({});
  const [investigationCompletedMap, setInvestigationCompletedMap] = useState<
    Record<string, boolean>
  >({});
  const [followUpCompleted, setFollowUpCompleted] = useState<boolean>(false);

  const baseAlerts: SafetyAlert[] = useMemo(() => {
    return runMedicationSafetyCheck(
      basePrescription.medicines,
      basePrescription.patientDetails
    );
  }, [basePrescription.medicines, basePrescription.patientDetails]);

  const handlePrescriptionChange = useCallback(
    (newRx: PrescriptionData, resetTrackers: boolean = false) => {
      setBasePrescription(newRx);
      if (resetTrackers) {
        setDoseStatusMap({});
        setInvestigationCompletedMap({});
        setFollowUpCompleted(false);
      }
    },
    []
  );

  const handleDoseStatusChange = useCallback(
    (key: string, status: 'taken' | 'missed' | 'pending') => {
      setDoseStatusMap((prev) => ({
        ...prev,
        [key]: {
          status,
          takenAt:
            status === 'taken'
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
        },
      }));
    },
    []
  );

  const handleResetDoses = useCallback(() => {
    setDoseStatusMap({});
  }, []);

  const handleToggleInvestigation = useCallback((id: string) => {
    setInvestigationCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleToggleFollowUp = useCallback(() => {
    setFollowUpCompleted((prev) => !prev);
  }, []);

  return (
    <LanguageProvider basePrescription={basePrescription} baseAlerts={baseAlerts}>
      <CureWorkspace
        basePrescription={basePrescription}
        onPrescriptionChange={handlePrescriptionChange}
        doseStatusMap={doseStatusMap}
        onDoseStatusChange={handleDoseStatusChange}
        onResetDoses={handleResetDoses}
        investigationCompletedMap={investigationCompletedMap}
        onToggleInvestigation={handleToggleInvestigation}
        followUpCompleted={followUpCompleted}
        onToggleFollowUp={handleToggleFollowUp}
      />
    </LanguageProvider>
  );
}
