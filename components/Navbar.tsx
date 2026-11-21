'use client';

import React from 'react';
import Link from 'next/link';
import { SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { LanguageSelector } from './LanguageSelector';
import {
  HeartPulse,
  Upload,
  Sparkles,
  LayoutDashboard,
  FileText,
  Pill,
  CalendarClock,
  ShieldCheck,
  CheckSquare,
  Edit3,
  Download,
  Loader2,
  ScanSearch,
} from 'lucide-react';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenDemo: () => void;
  onOpenUpload: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
  isDemoActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenDemo,
  onOpenUpload,
  onDownloadPdf,
  isGeneratingPdf = false,
  isDemoActive,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navItems = [
    { id: 'dashboard', label: t.tabs.dashboard, icon: LayoutDashboard },
    { id: 'guide', label: t.tabs.treatmentGuide, icon: FileText },
    { id: 'medicines', label: t.tabs.medications, icon: Pill },
    { id: 'schedule', label: t.tabs.schedule, icon: CalendarClock },
    { id: 'safety', label: t.tabs.safety, icon: ShieldCheck },
    { id: 'investigations', label: t.tabs.investigations, icon: CheckSquare },
    { id: 'review', label: t.tabs.review, icon: Edit3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-2 flex-wrap">
          {/* Logo & Brand: Cure */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight">
                  {t.appTitle}
                </span>
                {isDemoActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    {t.demoBadge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & Language Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors shadow-sm"
              title={t.actions.downloadReport}
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isGeneratingPdf ? t.actions.generatingPdf : t.actions.downloadReport}
              </span>
              <span className="md:hidden">PDF</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.actions.sampleCases}</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm shadow-teal-600/25"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.actions.uploadPrescription}</span>
            </button>

            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 text-sm">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <Link
            href="/ai-diagnostics"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-teal-700 hover:bg-teal-50 whitespace-nowrap transition-colors"
            title="AI Provider Diagnostics"
          >
            <ScanSearch className="w-3.5 h-3.5" />
            <span>AI Diagnostics</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
