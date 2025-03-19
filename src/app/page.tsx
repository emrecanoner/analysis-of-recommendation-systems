'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight py-2"
          >
            {t('home.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/research"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t('home.explore')}
            </a>
            <a
              href="/methodology"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
            >
              {t('home.methodology')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {t('home.features.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(`home.features.feature${index}.title`)}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t(`home.features.feature${index}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('home.cta.description')}
            </p>
            <a
              href="/methodology"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t('home.cta.button')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
