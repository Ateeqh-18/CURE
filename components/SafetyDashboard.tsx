'use client';

import React from 'react';
import { SafetyAlert, AlertSeverity, SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Info,
  PhoneCall,
  FileText,
  Stethoscope,
  Pill,
} from 'lucide-react';

interface SafetyDashboardProps {
  alerts: SafetyAlert[];
  currentLanguage: SupportedLanguage;
}

export const SafetyDashboard: React.FC<SafetyDashboardProps> = ({
  alerts,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const moderateCount = alerts.filter((a) => a.severity === 'moderate').length;
  const unverifiedCount = alerts.filter((a) => a.severity === 'unverified').length;

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: t.severities.critical,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          cardBorder: 'border-rose-300 ring-1 ring-rose-200',
          icon: AlertOctagon,
          iconColor: 'text-rose-600',
        };
      case 'high':
        return {
          label: t.severities.high,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          cardBorder: 'border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'moderate':
        return {
          label: t.severities.moderate,
          badgeClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          cardBorder: 'border-yellow-200',
          icon: Info,
          iconColor: 'text-yellow-600',
        };
      case 'unverified':
      default:
        return {
          label: t.severities.unverified,
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
          cardBorder: 'border-slate-200',
          icon: HelpCircle,
          iconColor: 'text-slate-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <span>{t.sections.safetyAlertsTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{t.sections.safetySubtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold w-fit">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>{t.safety.ruleEngineBadge}</span>
          </div>
        </div>

        {/* Severity Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`p-3.5 rounded-xl border text-center ${
              criticalCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-rose-700">{t.safety.criticalRisks}</div>
            <div className={`text-2xl font-black mt-0.5 ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
              {criticalCount}
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-center ${
              highCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-amber-800">{t.safety.highRisks}</div>
            <div className={`text-2xl font-black mt-0.5 ${highCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
              {highCount}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-600">{t.safety.moderateConcerns}</div>
            <div className="text-2xl font-black text-slate-700 mt-0.5">{moderateCount}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-600">{t.safety.incompleteChecks}</div>
            <div className="text-2xl font-black text-slate-600 mt-0.5">{unverifiedCount}</div>
          </div>
        </div>

        {/* Responsible AI Guidance Callout */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">{t.safety.protocolTitle}: </strong>
            <span>{t.safety.protocolDesc}</span>
          </div>
        </div>
      </div>

      {/* Safety Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">{t.safety.noConflictsTitle}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{t.safety.noConflictsDesc}</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = getSeverityBadge(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3.5 transition-shadow hover:shadow-md ${config.cardBorder}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{alert.title}</h3>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border w-fit ${config.badgeClass}`}>
                    {config.label}
                  </span>
                </div>

                {alert.medicinesInvolved && alert.medicinesInvolved.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-slate-400" />
                      {t.safety.medicinesInvolved}:
                    </span>
                    {alert.medicinesInvolved.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-bold text-slate-800"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {alert.description}
                </p>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-2.5 text-xs text-teal-950">
                  <PhoneCall className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">{t.safety.recommendedNextStep}: </strong>
                    <span>{alert.recommendation}</span>
                  </div>
                </div>

                {alert.source && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>
                      {t.safety.evidenceReference}: {alert.source}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
