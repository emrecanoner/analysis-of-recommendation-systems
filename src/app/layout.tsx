'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

function Navbar() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MUBI Analizi
          </a>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <a href="/" className="hover:text-blue-600 transition-colors">{t('common.home')}</a>
              <a href="/research" className="hover:text-blue-600 transition-colors">{t('common.research')}</a>
              <a href="/methodology" className="hover:text-blue-600 transition-colors">{t('common.methodology')}</a>
              <a href="/results" className="hover:text-blue-600 transition-colors">{t('common.results')}</a>
              <a href="/resources" className="hover:text-blue-600 transition-colors">{t('common.resources')}</a>
            </div>
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('common.copyright')}
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
