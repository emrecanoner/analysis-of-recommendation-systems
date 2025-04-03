'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Research() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="prose dark:prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('research.title')}
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('research.sections.intro.title')}</h2>
            <p>
              MUBI, geleneksel akış platformlarının aksine film tavsiyelerinde ağır şekilde algoritmalara bel bağlamaz. 
              Kuruluşundan itibaren <span className="text-emerald-600 dark:text-emerald-400 font-semibold">"kürasyon" odaklı bir model benimseyen MUBI</span>, 
              her kullanıcıya aynı anda sınırlı sayıdaki seçkin filmi sunarak insan eliyle seçilmiş içerik vurgusu yapar.
            </p>
            <p className="mt-4">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">MUBI kurucusu Efe Cakarel, platformun "her bir filmi tek tek el ile seçtiklerini" vurgulayarak 
              "robot veya algoritma olmadığını" özellikle belirtmiştir.</span>
              <a href="https://alittlebithuman.com/mubi-streaming-service/" 
                 className="ml-2 text-xs italic text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                [alittlebithuman.com]
              </a>
            </p>
            <p className="mt-4">
              Bu yaklaşım, Netflix gibi devlerin kullanıcı verilerine dayalı kişiselleştirilmiş öneri algoritmalarına bilinçli 
              bir tepki olarak şekillenmiştir. <span className="text-purple-600 dark:text-purple-400 font-semibold">Cakarel'in ifadesiyle, Netflix'in algoritmik öneri deneyimi çoğu izleyici için 
              "istediğin filmi bulmanın çok uzun sürmesi" nedeniyle "kategorik olarak çalışmayan", hayal kırıklığı yaratan bir 
              süreçtir.</span>
              <a href="https://news.ycombinator.com/item?id=14721693" 
                 className="ml-2 text-xs italic text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                [news.ycombinator.com]
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('research.sections.datasets.title')}</h2>
            <p>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">MUBI'nin film ve kullanıcı puanı verilerini toplayan önemli bir çalışma, 2020 yılında tüm verileri SQLite 
              veritabanı olarak derleyip Kaggle'da yayınlamıştır.</span>
              <a href="https://github.com/ClementMs/MUBI-Analytics-Project" 
                 className="ml-2 text-xs italic text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                [github.com/ClementMs/MUBI-Analytics-Project]
              </a>
            </p>
            <p className="mt-4">Bu veri seti:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="text-emerald-600 dark:text-emerald-400 font-semibold">15 milyondan fazla film oylaması</li>
              <li className="text-emerald-600 dark:text-emerald-400 font-semibold">745 bin civarında kullanıcı yorumu/eleştirisi</li>
              <li className="text-emerald-600 dark:text-emerald-400 font-semibold">225 binden fazla film bilgisi içermektedir</li>
            </ul>
            <p>
              Bu veri setine Kaggle üzerinden erişilebilmekte ve araştırmacılar tarafından kullanılmaktadır. Ayrıca 
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> MUBI'nin kendi sitesi üzerinden sunduğu Contributor Hub, kullanıcılara platformun film veritabanına katkı 
              yapma olanağı verir.</span>
              <a href="https://mubi.com/contribute" 
                 className="ml-2 text-xs italic text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                [mubi.com/contribute]
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('research.sections.curation.title')}</h2>
            <p>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">MUBI'nin kürasyon modeli, insan merkezli seçimlere dayanır. Platform, her gün tek bir yeni film ekler ve 
              her film kataloğa girdikten sonra sadece 30 gün kalır. Bu şekilde sürekli döngüsel bir seçki oluşur: her gün 
              bir film "vizyona girer" ve en eski film çıkar, toplamda daima 30 film bulunur.</span>
            </p>
            <p className="mt-4">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">2020 yılının Mayıs ayında MUBI, sadece 30 filmlik seçkiyle sınırlı kalmayıp arşivindeki filmlere de erişim 
              sağlayan "Kütüphane" (Library) bölümünü kullanıma açmıştır.</span> Bu genişleme sonrasında platform, arayüzünde bazı 
              temel öneri mekanizmaları sunmaya başlamıştır.
            </p>
            <p className="mt-4">
              MUBI'nin kürasyon yaklaşımı, uzman film programcıları ekibi tarafından yönetilir. Bu ekip, sinema alanında yetkin 
              kişilerden (film eleştirmenleri, küratörler ve sektörel uzmanlar) oluşur. Tıpkı bir festival programı hazırlar gibi, 
              dünyadan bağımsız, klasik, kült veya ödüllü filmleri tarayarak platformun çizgisine uyanları belirlerler.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('research.sections.contribution.title')}</h2>
            <p>
              MUBI'ye katkı sağlamanın çeşitli yolları bulunmaktadır:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Veri Analizi:</strong> Kaggle'daki veri setini kullanarak deneysel öneri sistemleri geliştirilebilir.
              </li>
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">İçerik Katkısı:</strong> MUBI'nin Contributor Hub üzerinden film bilgilerini düzenleme ve 
                zenginleştirme imkanı.
              </li>
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Topluluk Katılımı:</strong> Platform içi yorumlar, değerlendirmeler ve tartışmalarla katkı sağlanabilir.
              </li>
              <li>
                <strong className="text-emerald-600 dark:text-emerald-400">Küratöryel Katkı:</strong> Konuk küratör programları aracılığıyla özel film seçkileri oluşturulabilir.
              </li>
            </ul>
            <p className="mt-4">
              MUBI'nin veri setleri ve API'leri hakkında önemli kaynaklar:
            </p>
            <ul className="list-none pl-6 mb-4 space-y-2">
              <li>
                <a href="https://www.kaggle.com/datasets/clementmsika/mubi-sqlite-database-for-movie-lovers/code" 
                   className="inline-flex items-center px-4 py-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <span className="text-sm">📊 MUBI SQLite Veritabanı (Kaggle)</span>
                </a>
              </li>
              <li>
                <a href="https://mubi.com/contribute" 
                   className="inline-flex items-center px-4 py-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                  <span className="text-sm">🤝 MUBI Contributor Hub</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/ClementMs/MUBI-Analytics-Project" 
                   className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors">
                  <span className="text-sm">💻 MUBI Analytics Project (GitHub)</span>
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('research.sections.conclusion.title')}</h2>
            <p>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">MUBI örneği, dijital film platformlarında otomatik öneri algoritmalarının tek yol olmadığını, nitelikli insan 
              seçkisinin de bir değer taşıdığını göstermesi bakımından önemli bir vaka sunmaktadır.</span> Platform, algoritmik 
              kişiselleştirmeyi büyük ölçüde geri planda tutarak, seçkin film önerilerini editöryel olarak sunar.
            </p>
            <p className="mt-4">
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Akademik bir incelemede de MUBI, algoritmik platformlardan ayrışan bir "tad küratörlüğü" modeli olarak 
              tanımlanmakta ve 2020'ye kadar kişiselleştirme yerine editöryel seçkiyle yol aldığı belirtilmektedir.</span>
              <a href="https://www.springerprofessional.de/en/taste-curation-on-film-streaming-platforms/19021796" 
                 className="ml-2 text-xs italic text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                [springerprofessional.de]
              </a>
              MUBI'nin öneri yaklaşımı, kullanıcı verilerinden ziyade editöryel uzmanlık ve 
              film kültürü bilgisine dayanır.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
} 