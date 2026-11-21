import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cure — Multilingual Prescription & Medication Safety Assistant',
  description:
    'AI-powered multilingual prescription and hospital discharge-summary understanding platform for patients in India. Supports 12 Indian languages, multi-page OCR, medication planning, clinical safety checks, and multilingual PDF reports.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
