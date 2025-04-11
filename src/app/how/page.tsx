'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon
} from '@mui/material';
import CodeBlock from './components/CodeBlock';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 6, 
            fontFamily: "var(--font-poppins)",
            fontWeight: 'bold'
          }}
        >
          Öneri Sistemleri: Nasıl Çalışır?
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            mb: 4, 
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontFamily: "var(--font-poppins)"
              }
            }}
          >
            <Tab label="Genel Bakış" />
            <Tab label="İçerik Tabanlı Filtreleme" />
            <Tab label="İşbirlikçi Filtreleme" />
            <Tab label="API ve İmplementasyon" />
          </Tabs>
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2
          }}
        >
          {activeTab === 0 && (
            <Overview />
          )}

          {activeTab === 1 && (
            <ContentBasedFiltering />
          )}

          {activeTab === 2 && (
            <CollaborativeFiltering />
          )}

          {activeTab === 3 && (
            <ApiImplementation />
          )}
        </Paper>
      </Container>
    </Box>
  );
}

function Overview() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        Film Öneri Sistemleri Hakkında
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bu projede, MUBI film veritabanı üzerinde iki farklı öneri sistemi implementasyonu gerçekleştirdik:
        İçerik Tabanlı Filtreleme ve İşbirlikçi Filtreleme. Her iki yöntem de film önerileri sunmak için farklı yaklaşımlar kullanır.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        Kullandığımız Teknolojiler
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 3 }}>
        {['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'Material UI', 'Pandas', 'NumPy', 'scikit-learn'].map((tech) => (
          <Paper key={tech} elevation={1} sx={{ px: 2, py: 1, borderRadius: 2 }}>
            <Typography variant="body2">{tech}</Typography>
          </Paper>
        ))}
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        Öneri Sistemlerinin Karşılaştırması
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>İçerik Tabanlı Filtreleme:</strong> Filmler arasındaki benzerliği, filmin özellikleri (başlık, yönetmen, yıl, dil vb.) 
        üzerinden TF-IDF vektörleri ve kosinüs benzerliği kullanarak hesaplar. Bu yöntem, bir kullanıcının beğendiği bir filme benzer filmler önerir.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>İşbirlikçi Filtreleme:</strong> Kullanıcıların film izleme ve puanlama davranışlarını analiz ederek, benzer zevklere sahip kullanıcıları
        bulur ve onların yüksek puan verdiği henüz izlenmemiş filmleri önerir. Bu yöntem, kullanıcı toplulukları arasındaki benzerlikleri keşfeder.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        Proje Mimarisi
      </Typography>

      <Typography variant="body1" paragraph>
        Proje, iki ana bileşenden oluşur:
      </Typography>

      <List>
        <ListItem>
          <ListItemText 
            primary="Backend (API)" 
            secondary="Python ve FastAPI ile geliştirilmiş, öneri algoritmalarını çalıştıran API servisleri."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Frontend (Web Uygulaması)" 
            secondary="Next.js, TypeScript ve Material UI ile geliştirilmiş, kullanıcı arayüzü ve etkileşimli bileşenler."
          />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph sx={{ mt: 2 }}>
        Diğer sekmelerde her bir yöntemin matematiksel detaylarını, veri önişleme adımlarını ve kodunu inceleyebilirsiniz.
      </Typography>
    </Box>
  );
}

function ContentBasedFiltering() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        İçerik Tabanlı Filtreleme
      </Typography>
      
      <Typography variant="body1" paragraph>
        İçerik tabanlı filtreleme, filmlerin özelliklerini (metinsel içerik, kategori, yönetmen vb.) analiz ederek benzerliklerini hesaplar. 
        Bu yöntem bir filmin diğer filmlere ne kadar benzediğini matematiksel olarak ölçer.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        TF-IDF Vektörizasyonu
      </Typography>

      <Typography variant="body1" paragraph>
        TF-IDF (Term Frequency-Inverse Document Frequency), metin tabanlı özellikleri sayısal vektörlere dönüştürmek için kullanılan bir tekniktir. 
        Filmlerin metinsel özelliklerini (başlık, yönetmen, yıl, dil, vb.) bu yöntemle vektörlere dönüştürüyoruz.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>TF (Term Frequency):</strong> Bir terimin bir dokümanda ne sıklıkta geçtiğini ölçer.
        <br />
        <strong>IDF (Inverse Document Frequency):</strong> Bir terimin tüm dokümanlarda ne kadar yaygın olduğunu ölçer. Nadir terimler daha yüksek ağırlık alır.
      </Typography>

      <Typography variant="body1" paragraph>
        Bu projede, scikit-learn kütüphanesinin <code>TfidfVectorizer</code> sınıfını kullanarak bu hesaplamayı gerçekleştirdik.
      </Typography>

      <CodeBlock 
        title="TF-IDF Vektörizasyon Kodu"
        code={`# TF-IDF vektörizasyonu
tfidf = TfidfVectorizer(
    stop_words='english',
    max_features=2000,
    strip_accents='unicode',
    min_df=2,
    max_df=0.95,
    ngram_range=(1, 2)
)

tfidf_matrix = tfidf.fit_transform(movies_df['content'])`}
      />

      <Typography variant="body1" paragraph>
        Bu kod, her film için bir vektör oluşturur. Bu vektörlerdeki her bir boyut, belirli bir terimin (kelime veya kelime grubu) 
        filmin içeriğindeki önemini temsil eder.
      </Typography>

      <Typography variant="body1" paragraph>
        TfidfVectorizer parametrelerinin görevleri:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="stop_words='english'" 
            secondary="İngilizce dilindeki 'the', 'a', 'an' gibi yaygın durak kelimeleri (anlam taşımayan) filtreleyerek çıkarır."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="max_features=2000" 
            secondary="En sık kullanılan 2000 terimi dikkate alır, diğerlerini göz ardı eder. Bu, işlem yükünü azaltmaya yardımcı olur."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="strip_accents='unicode'" 
            secondary="Aksan işaretlerini kaldırır, örneğin 'café' kelimesi 'cafe' olarak değerlendirilir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="min_df=2" 
            secondary="En az 2 filmde geçen terimleri dikkate alır. Çok nadir kullanılan terimler elenmiş olur."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="max_df=0.95" 
            secondary="Filmlerin %95'inden fazlasında geçen terimleri yok sayar. Çok yaygın kelimeler böylece filtrelenir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="ngram_range=(1, 2)" 
            secondary="Tek kelimeler ve iki kelimelik ifadeleri birlikte değerlendirir. Örneğin 'science fiction' gibi anlamlı ikili kelime grupları yakalanabilir."
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Kosinüs Benzerliği
      </Typography>

      <Typography variant="body1" paragraph>
        Kosinüs benzerliği, iki vektör arasındaki açının kosinüsünü hesaplayarak benzerliği ölçen bir tekniktir. 
        Bu değer -1 ile 1 arasındadır, 1 tam benzerliği gösterirken, -1 tam zıtlığı ifade eder.
      </Typography>

      <Typography variant="body1" paragraph>
        Matematiksel olarak, kosinüs benzerliği şu formülle hesaplanır:
      </Typography>

      <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2 }}>
        <Typography variant="body1" align="center">
          cos(θ) = (A·B) / (||A|| × ||B||)
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
          Burada A ve B vektörler, · ise dot product (iç çarpım) operatörüdür.
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Filmler arasındaki benzerliği hesaplamak için, TF-IDF vektörleri arasındaki kosinüs benzerliğini kullanıyoruz.
      </Typography>

      <CodeBlock 
        title="Kosinüs Benzerliği Hesaplama"
        code={`# Benzerlik matrisini hesapla
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix, dense_output=False)`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Veri Önişleme Adımları
      </Typography>

      <Typography variant="body1" paragraph>
        İçerik tabanlı filtreleme için veri önişleme adımları, metinsel içeriği hazırlamak ve eksik değerleri doldurmak üzerinedir.
        Aşağıda bu adımları görebilirsiniz:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. Eksik Değerleri Doldurma" 
            secondary="Yönetmen adı, yayın yılı, dil gibi alanlar için eksik değerler doldurulur."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Popülerlik Puanı Normalizasyonu" 
            secondary="Film popülerlik puanları 0-1 arasında normalize edilir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Metin Özelliklerini Birleştirme" 
            secondary="Filmin tüm metinsel özellikleri bir 'content' alanında birleştirilir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="4. Popülerlik Kategorilendirme" 
            secondary="Popülerlik puanları 'high_popularity', 'medium_popularity', 'low_popularity' olarak sınıflandırılır."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="Veri Önişleme Kodu"
        code={`# Eksik değerleri doldur
movies_df['director_name'] = movies_df['director_name'].fillna('')
movies_df['movie_release_year'] = movies_df['movie_release_year'].fillna(0)
movies_df['movie_title_language'] = movies_df['movie_title_language'].fillna('')
movies_df['movie_popularity'] = movies_df['movie_popularity'].fillna(0)

# Popülerlik puanını normalize et (0-1 arasına)
if len(movies_df) > 0:  # Veri seti boş değilse
    max_popularity = movies_df['movie_popularity'].max()
    if max_popularity > 0:  # Sıfıra bölünmeyi önle
        movies_df['normalized_popularity'] = movies_df['movie_popularity'] / max_popularity
    else:
        movies_df['normalized_popularity'] = 0
else:
    movies_df['normalized_popularity'] = 0

# Metin özelliklerini birleştir
movies_df['content'] = movies_df.apply(lambda x: ' '.join(filter(None, [
    str(x['movie_title']),
    str(x['director_name']),
    str(x['movie_release_year']),
    str(x['movie_title_language']),
    # Popülerlik puanını kategorilere ayır
    'high_popularity' if x['normalized_popularity'] > 0.7 else
    'medium_popularity' if x['normalized_popularity'] > 0.3 else
    'low_popularity'
])), axis=1)`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Algoritma İmplementasyonu
      </Typography>

      <Typography variant="body1" paragraph>
        İçerik tabanlı filtreleme algoritması, belirli bir film verildiğinde en benzer filmleri bulmak için kosinüs benzerlik matrisini kullanır.
        İşlem adımları şu şekildedir:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. Seçilen Filmin İndeksini Bulma" 
            secondary="Kullanıcının seçtiği filmin veri setindeki indeksini buluruz."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Benzerlik Skorlarını Alma" 
            secondary="Benzerlik matrisinden o filme ait tüm benzerlik skorlarını çıkarırız."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Skorları Sıralama" 
            secondary="Benzerlik skorlarını büyükten küçüğe sıralarız."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="4. En Benzer Filmleri Seçme" 
            secondary="Kendisi hariç en benzer 10 filmi seçeriz."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="5. Film Bilgilerini Formatla" 
            secondary="Bulunan en benzer filmlerin detaylı bilgilerini kullanıcıya sunarız."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="Film Önerisi Hesaplama Kodu"
        code={`def get_recommendations(movie_id: int, movies_df: pd.DataFrame, cosine_sim: np.ndarray) -> List[Dict]:
    """Belirli bir film için benzer filmleri öner"""
    try:
        # Film indeksini bul
        idx = movies_df[movies_df['movie_id'] == movie_id].index[0]
        
        # Benzerlik skorlarını al
        sim_scores = list(enumerate(cosine_sim[idx].toarray()[0]))
        
        # Benzerlik skorlarına göre sırala
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # En benzer 10 filmi al (kendisi hariç)
        sim_scores = sim_scores[1:11]
        
        # Film indekslerini al
        movie_indices = [i[0] for i in sim_scores]
        
        # Önerilen filmleri döndür
        recommendations = []
        for idx, score in zip(movie_indices, [s[1] for s in sim_scores]):
            movie = movies_df.iloc[idx]
            recommendations.append({
                'movie_id': int(movie['movie_id']),
                'movie_title': str(movie['movie_title']),
                'director_name': str(movie['director_name']),
                'movie_release_year': int(movie['movie_release_year']) if pd.notna(movie['movie_release_year']) else None,
                'movie_title_language': str(movie['movie_title_language']),
                'movie_popularity': float(movie['movie_popularity']),
                'movie_url': str(movie['movie_url']),
                'similarity_score': float(score)
            })
        
        return recommendations
        
    except Exception as e:
        print(f"Öneri hesaplama hatası: {str(e)}")
        raise e`}
      />

      <Typography variant="body1" paragraph>
        Bu algoritma, kullanıcının seçtiği bir film ile tüm veri setindeki diğer filmler arasındaki benzerliği hesaplar ve 
        en benzer 10 filmi önerir. Benzerlik skoru, filmler arasındaki içerik benzerliğini %0-100 arasında gösterir.
      </Typography>
    </Box>
  );
}

function CollaborativeFiltering() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        İşbirlikçi Filtreleme
      </Typography>
      
      <Typography variant="body1" paragraph>
        İşbirlikçi filtreleme, kullanıcıların izleme ve puanlama davranışlarını analiz ederek benzer zevklere sahip kullanıcıları bulur.
        Bu yöntem "benzer kullanıcılar benzer filmleri beğenir" prensibine dayanır.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        Kullanıcı-Film Matrisi
      </Typography>

      <Typography variant="body1" paragraph>
        İşbirlikçi filtrelemenin temelinde kullanıcı-film matrisi yer alır. Bu matris, her bir kullanıcının her bir filme verdiği puanları içerir.
        Genellikle bu matris oldukça seyrek olur (sparse), çünkü çoğu kullanıcı tüm filmleri puanlamaz.
      </Typography>

      <Box sx={{ 
        bgcolor: 'rgba(0, 0, 0, 0.05)', 
        p: 2, 
        borderRadius: 2, 
        my: 2, 
        overflowX: 'auto' 
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontFamily: 'monospace', 
          fontSize: '14px' 
        }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px' }}></th>
              <th style={{ textAlign: 'center', padding: '6px' }}>Film1</th>
              <th style={{ textAlign: 'center', padding: '6px' }}>Film2</th>
              <th style={{ textAlign: 'center', padding: '6px' }}>Film3</th>
              <th style={{ textAlign: 'center', padding: '6px' }}>Film4</th>
              <th style={{ textAlign: 'center', padding: '6px' }}>Film5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left', padding: '6px' }}>Kullanıcı1</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>5</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>4</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>3</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left', padding: '6px' }}>Kullanıcı2</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>4</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>5</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left', padding: '6px' }}>Kullanıcı3</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>2</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>5</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>1</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left', padding: '6px' }}>Kullanıcı4</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>3</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>4</td>
              <td style={{ textAlign: 'center', padding: '6px' }}>0</td>
            </tr>
          </tbody>
        </table>
        <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
          Örnek bir kullanıcı-film matrisi. 0 değerleri, kullanıcının filmi puanlamadığını gösterir.
        </Typography>
      </Box>

      <Typography variant="body1" paragraph>
        Bu projede, pandas kütüphanesinin <code>pivot</code> fonksiyonu ile bu matrisi oluşturuyoruz.
      </Typography>

      <CodeBlock 
        title="Kullanıcı-Film Matrisi Oluşturma"
        code={`# User-Movie matrisini oluştur
user_movie_matrix = filtered_ratings.pivot(
    index='user_id',
    columns='movie_id',
    values='rating_score'
).fillna(0)`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Benzerlik Ölçümü
      </Typography>

      <Typography variant="body1" paragraph>
        Kullanıcılar arasındaki benzerliği ölçmek için kosinüs benzerliği kullanıyoruz. Bu benzerlik, iki kullanıcının 
        puanlama vektörleri arasındaki açının kosinüsünü hesaplar.
      </Typography>

      <Typography variant="body1" paragraph>
        Kosinüs benzerliği, iki kullanıcının puanlama davranışlarının yönünü ölçer, büyüklüğünü (örneğin bir kullanıcının 
        genellikle yüksek puanlar vermesi) değil. Bu, farklı puanlama eğilimlerine sahip ancak benzer zevkleri olan kullanıcıları 
        bulmak için idealdir.
      </Typography>

      <CodeBlock 
        title="Kullanıcılar Arası Benzerlik Hesaplama"
        code={`# Benzerlik matrisini önceden hesapla
similarity_matrix = cosine_similarity(user_movie_matrix)

# Sonraki aşamada, yeni bir kullanıcı vektörü için benzerlik hesaplama
user_similarities = cosine_similarity([user_vector], user_movie_matrix)[0]`}
      />

      <Typography variant="body1" paragraph>
        Bu kod, tüm kullanıcıların birbirleriyle benzerliğini hesaplar ve bir benzerlik matrisi oluşturur. Ayrıca, yeni bir kullanıcı 
        vektörü (puanlama davranışı) için diğer kullanıcılarla benzerliği hesaplamak için de kullanılır.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Ağırlıklı Ortalama ile Öneri
      </Typography>

      <Typography variant="body1" paragraph>
        İşbirlikçi filtrelemenin en kritik kısmı, benzer kullanıcıların puanlarını kullanarak öneriler oluşturmaktır. Burada ağırlıklı 
        ortalama yöntemini kullanıyoruz.
      </Typography>

      <Typography variant="body1" paragraph>
        Ağırlıklı ortalama şu adımlarla hesaplanır:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. En Benzer Kullanıcıları Bulma" 
            secondary="Kullanıcının puanlama davranışına en benzer kullanıcıları buluruz."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Benzer Kullanıcıların Puanladığı Filmleri Filtreleme" 
            secondary="Aktif kullanıcının henüz izlemediği ve benzer kullanıcıların puanladığı filmleri buluruz."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Ağırlıklı Ortalama Hesaplama" 
            secondary="Her film için, benzer kullanıcıların verdiği puanların benzerlik değerleriyle ağırlıklandırılmış ortalamasını hesaplarız."
          />
        </ListItem>
      </List>

      <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2, my: 2 }}>
        <Typography variant="body1" align="center">
          Ağırlıklı Ortalama = ∑(benzerlik_değeri × puan) / ∑(benzerlik_değeri)
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, color: 'text.secondary' }}>
          Bu formül, her kullanıcının puanını benzerlik değeriyle çarpar ve tüm benzerlik değerlerinin toplamına böler.
        </Typography>
      </Box>

      <CodeBlock 
        title="Ağırlıklı Ortalama ile Öneri Hesaplama"
        code={`# Benzer kullanıcıların en yüksek puanladığı filmleri bul
for movie_id in user_movie_matrix.columns:
    if movie_id not in seen_movies:
        movie_ratings = similar_users[movie_id].values
        if np.any(movie_ratings > 3.0):  # Sadece yüksek puanlı filmleri kontrol et
            valid_ratings_mask = movie_ratings > 0
            valid_ratings = movie_ratings[valid_ratings_mask]
            valid_similarities = similarities[valid_ratings_mask]
            
            if len(valid_ratings) > 0:
                # Sıfıra bölmeyi önle ve geçersiz değerleri kontrol et
                similarity_sum = np.sum(valid_similarities)
                if similarity_sum > 0:
                    weighted_rating = np.sum(valid_ratings * valid_similarities) / similarity_sum
                    # NaN veya Infinity kontrolü
                    if np.isfinite(weighted_rating) and weighted_rating > 3.0:  # Sadece iyi önerileri ekle
                        recommendations.append((movie_id, weighted_rating))`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Veri Önişleme ve Filtreleme
      </Typography>

      <Typography variant="body1" paragraph>
        İşbirlikçi filtreleme için veri önişleme, puanlama verilerini hazırlamak ve filtrelemek üzerinedir.
        Aşağıdaki adımlar uygulanır:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. Tekrarlanan Puanlamaları Gruplandırma" 
            secondary="Aynı kullanıcının aynı film için birden fazla puanlaması olduğunda ortalama alınır."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Aktif Kullanıcıları Filtreleme" 
            secondary="En az belli sayıda film puanlamış kullanıcılar seçilir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Popüler Filmleri Filtreleme" 
            secondary="En çok puanlanan filmler seçilir."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="Veri Önişleme ve Filtreleme Kodu"
        code={`# Tekrar eden puanlamaları gruplandır ve ortalama al
ratings_df = ratings_df.groupby(['user_id', 'movie_id'])['rating_score'].mean().reset_index()

# En aktif kullanıcıları ve en popüler filmleri seç
min_ratings = 10  # En az 10 film puanlamış kullanıcıları seç
user_counts = ratings_df['user_id'].value_counts()
active_users = user_counts[user_counts >= min_ratings].nlargest(5000).index
filtered_ratings = ratings_df[ratings_df['user_id'].isin(active_users)]

# En çok puanlanan 2000 filmi seç
movie_counts = filtered_ratings['movie_id'].value_counts()
popular_movies = movie_counts.nlargest(2000).index
filtered_ratings = filtered_ratings[filtered_ratings['movie_id'].isin(popular_movies)]`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Algoritma İmplementasyonu
      </Typography>

      <Typography variant="body1" paragraph>
        İşbirlikçi filtreleme algoritması, kullanıcının puanladığı filmler üzerinden benzer kullanıcıları bulur ve onların beğendiği
        filmleri önerir. İşlem adımları şu şekildedir:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. Kullanıcı Vektörü Oluşturma" 
            secondary="Kullanıcının puanladığı filmlere göre bir puanlama vektörü oluşturulur."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Kullanıcı Benzerliklerini Hesaplama" 
            secondary="Bu vektörle diğer kullanıcılar arasındaki benzerlikler hesaplanır."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. En Benzer Kullanıcıları Bulma" 
            secondary="Benzerlik değerlerine göre en benzer kullanıcılar seçilir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="4. Film Önerileri Hesaplama" 
            secondary="Benzer kullanıcıların beğendiği ve kullanıcının henüz izlemediği filmler belirlenir."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="5. Önerileri Sıralama ve Filtreleme" 
            secondary="Öneriler puanlarına göre sıralanır ve en iyi olanlar seçilir."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="İşbirlikçi Filtreleme Algoritması"
        code={`def get_user_recommendations(user_ratings: List[Dict], top_n: int = 10) -> List[Dict]:
    """Kullanıcının puanlarına göre film önerileri yap"""
    try:
        # Önbellekte varsa direkt döndür
        cache_key = str(sorted([(r['movie_id'], r['rating']) for r in user_ratings]))
        if cache_key in user_recommendations_cache:
            return user_recommendations_cache[cache_key]
        
        # Kullanıcının puanladığı filmleri bul
        rated_movies = {rating['movie_id']: rating['rating'] for rating in user_ratings}
        
        # Kullanıcı vektörünü oluştur
        user_vector = np.zeros(len(user_movie_matrix.columns))
        valid_movies = 0
        for movie_id, rating in rated_movies.items():
            if movie_id in user_movie_matrix.columns:
                movie_idx = user_movie_matrix.columns.get_loc(movie_id)
                user_vector[movie_idx] = rating
                valid_movies += 1
        
        if valid_movies == 0:
            raise HTTPException(
                status_code=400,
                detail="Puanladığınız filmler arasında sistemde kayıtlı film bulunamadı."
            )
        
        # Benzerlik hesaplama
        user_similarities = cosine_similarity([user_vector], user_movie_matrix)[0]
        
        # En benzer kullanıcıları bul
        similar_indices = np.argsort(user_similarities)[-2:][::-1]
        similar_users = user_movie_matrix.iloc[similar_indices]
        similarities = user_similarities[similar_indices]
        
        # Önerileri hesapla
        recommendations = []
        seen_movies = set(rated_movies.keys())
        
        # Benzer kullanıcıların en yüksek puanladığı filmleri bul
        for movie_id in user_movie_matrix.columns:
            if movie_id not in seen_movies:
                movie_ratings = similar_users[movie_id].values
                if np.any(movie_ratings > 3.0):
                    valid_ratings_mask = movie_ratings > 0
                    valid_ratings = movie_ratings[valid_ratings_mask]
                    valid_similarities = similarities[valid_ratings_mask]
                    
                    if len(valid_ratings) > 0:
                        similarity_sum = np.sum(valid_similarities)
                        if similarity_sum > 0:
                            weighted_rating = np.sum(valid_ratings * valid_similarities) / similarity_sum
                            if np.isfinite(weighted_rating) and weighted_rating > 3.0:
                                recommendations.append((movie_id, weighted_rating))
        
        # En yüksek puanlı filmleri seç
        recommendations.sort(key=lambda x: x[1], reverse=True)
        top_recommendations = recommendations[:top_n]
        
        if len(top_recommendations) == 0:
            raise HTTPException(
                status_code=404,
                detail="Maalesef size uygun film önerisi bulunamadı."
            )
        
        # Önerileri formatla
        formatted_recommendations = []
        for movie_id, pred_rating in top_recommendations:
            movie = movies_df[movies_df['movie_id'] == movie_id].iloc[0]
            safe_rating = float(pred_rating) if np.isfinite(pred_rating) else 3.5
            formatted_recommendations.append({
                'movie_id': int(movie_id),
                'movie_title': str(movie['movie_title']),
                'director_name': str(movie['director_name']),
                'movie_release_year': int(movie['movie_release_year']) if pd.notna(movie['movie_release_year']) else None,
                'predicted_rating': safe_rating,
                'movie_url': str(movie['movie_url']) if pd.notna(movie['movie_url']) else None
            })
        
        # Önerileri önbelleğe al
        user_recommendations_cache[cache_key] = formatted_recommendations
        
        return formatted_recommendations
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Öneri hesaplama hatası: {str(e)}"
        )`}
      />

      <Typography variant="body1" paragraph>
        Bu algoritma, kullanıcının film puanlarına göre benzer kullanıcıları bulur ve onların beğendiği filmleri önerir.
        Benzerlik değeri yüksek olan kullanıcıların puanlamaları daha fazla ağırlığa sahip olur, böylece daha doğru öneriler sağlanır.
      </Typography>
    </Box>
  );
}

function ApiImplementation() {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        API ve İmplementasyon
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bu bölümde, FastAPI kullanarak oluşturduğumuz API'lerin yapısını ve öneri sistemleri için geliştirdiğimiz endpointleri inceleyeceğiz.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)" }}>
        API Mimarisi
      </Typography>

      <Typography variant="body1" paragraph>
        Projede üç farklı API servisi bulunmaktadır:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. İçerik Tabanlı Filtreleme API (Port: 8000)" 
            secondary="Film benzerlikleri üzerinden öneri sunan API."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. İşbirlikçi Filtreleme API (Port: 8002)" 
            secondary="Kullanıcı davranışları üzerinden öneri sunan API."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Arama API (Port: 8001)" 
            secondary="Film adına göre arama yapan API."
          />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph>
        Her bir API, FastAPI framework'ü kullanılarak yazılmıştır. FastAPI, yüksek performanslı, kolay kullanımlı ve otomatik dokümantasyon
        sağlayan modern bir Python web framework'üdür.
      </Typography>

      <CodeBlock 
        title="API Oluşturma ve CORS Ayarları"
        code={`from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)`}
      />

      <Typography variant="body1" paragraph>
        CORS (Cross-Origin Resource Sharing) ayarları, frontend uygulamasının farklı bir port üzerinden API'ye erişmesine izin verir.
        Bu ayarlar, web tarayıcılarının güvenlik kısıtlamalarını aşmak için gereklidir.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Endpoints
      </Typography>

      <Typography variant="body1" paragraph>
        Her bir API'nin sunduğu endpointler şu şekildedir:
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        İçerik Tabanlı Filtreleme API
      </Typography>

      <List>
        <ListItem>
          <ListItemText 
            primary="GET /content-based/{movie_id}" 
            secondary="Belirli bir film için benzer filmleri döndürür."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="İçerik Tabanlı Filtreleme Endpoint"
        code={`@app.get("/content-based/{movie_id}")
async def get_content_based_recommendations(movie_id: int):
    """Belirli bir film için içerik tabanlı önerileri döndür"""
    try:
        if movies_df is None or cosine_sim is None:
            raise HTTPException(status_code=500, detail="Veriler henüz hazır değil")
        
        recommendations = get_recommendations(movie_id, movies_df, cosine_sim)
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`}
      />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        İşbirlikçi Filtreleme API
      </Typography>

      <List>
        <ListItem>
          <ListItemText 
            primary="POST /collaborative" 
            secondary="Kullanıcının film puanlamalarına göre öneriler sunar."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="GET /user-history/{user_id}" 
            secondary="Belirli bir kullanıcının izleme geçmişini döndürür."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="GET /available-users" 
            secondary="Sistemdeki kullanılabilir kullanıcı ID'lerini listeler."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="İşbirlikçi Filtreleme POST Endpoint"
        code={`class Rating(BaseModel):
    movie_id: int
    rating: float

@app.post("/collaborative")
async def get_recommendations(ratings: List[Rating]):
    """Kullanıcı puanlarına göre film önerileri döndür"""
    try:
        if user_movie_matrix is None:
            raise HTTPException(
                status_code=500,
                detail="Veriler henüz yüklenmedi. Lütfen biraz bekleyin ve tekrar deneyin."
            )
            
        if len(ratings) < 3:
            raise HTTPException(
                status_code=400,
                detail="En az 3 film puanlamanız gerekiyor."
            )
            
        # Puanları kontrol et
        for rating in ratings:
            if not (0.5 <= rating.rating <= 5.0):
                raise HTTPException(
                    status_code=400,
                    detail="Film puanları 0.5 ile 5.0 arasında olmalıdır."
                )
            
        # Puanları dict formatına çevir
        ratings_dict = [{"movie_id": r.movie_id, "rating": r.rating} for r in ratings]
        
        recommendations = get_user_recommendations(ratings_dict)
        return {"recommendations": recommendations}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Öneriler hesaplanırken bir hata oluştu."
        )`}
      />

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Arama API
      </Typography>

      <List>
        <ListItem>
          <ListItemText 
            primary="GET /search?query={film_adı}" 
            secondary="Film adına göre arama yapar."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="Arama Endpoint"
        code={`@app.get("/search")
async def search_movies(query: str = Query(..., min_length=2)) -> Dict:
    """Film ara"""
    try:
        if movies_df is None:
            return {"movies": []}
            
        # Başlık içinde arama yap
        matches = movies_df[
            movies_df['movie_title'].str.contains(query, case=False, na=False)
        ].head(10)
        
        # Sonuçları formatla
        results = [
            {
                'movie_id': int(row['movie_id']),
                'movie_title': str(row['movie_title'])
            }
            for _, row in matches.iterrows()
        ]
        
        return {"movies": results}
        
    except Exception as e:
        return {"movies": []}`}
      />

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Veri Modelleri
      </Typography>

      <Typography variant="body1" paragraph>
        API'de kullanılan veri modelleri, Pydantic kütüphanesi ile tanımlanmıştır. Pydantic, veri doğrulama ve dönüştürme için
        kullanılan bir kütüphanedir.
      </Typography>

      <CodeBlock 
        title="Pydantic Veri Modeli"
        code={`from pydantic import BaseModel

class Rating(BaseModel):
    movie_id: int
    rating: float`}
      />

      <Typography variant="body1" paragraph>
        Bu veri modeli, bir kullanıcının bir film için verdiği puanı temsil eder. Pydantic, gelen JSON verilerini otomatik olarak
        bu sınıfa dönüştürür ve veri tiplerini kontrol eder.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Önbelleğe Alma ve Optimizasyon
      </Typography>

      <Typography variant="body1" paragraph>
        Performansı artırmak için çeşitli optimizasyon teknikleri kullanılmıştır:
      </Typography>

      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="1. Önbelleğe Alma (Caching)" 
            secondary="Aynı kullanıcı puanları için daha önce hesaplanmış öneriler önbellekte tutulur."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Veriseti Sınırlandırma" 
            secondary="Tüm filmler yerine en popüler filmler, tüm kullanıcılar yerine en aktif kullanıcılar kullanılır."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Önceden Hesaplama" 
            secondary="Benzerlik matrisleri önceden hesaplanır."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="4. Seyrek Matris (Sparse Matrix)" 
            secondary="Büyük ve seyrek matrisler için bellek verimliliği sağlanır."
          />
        </ListItem>
      </List>

      <CodeBlock 
        title="Önbelleğe Alma Kodu"
        code={`# Global değişken olarak önbellek tanımla
user_recommendations_cache = {}  # Önerileri önbelleğe almak için

def get_user_recommendations(user_ratings: List[Dict], top_n: int = 10) -> List[Dict]:
    # Önbellekte varsa direkt döndür
    cache_key = str(sorted([(r['movie_id'], r['rating']) for r in user_ratings]))
    if cache_key in user_recommendations_cache:
        print("Öneriler önbellekten alındı")
        return user_recommendations_cache[cache_key]
    
    # ... (öneri hesaplama kodu) ...
    
    # Önerileri önbelleğe al
    user_recommendations_cache[cache_key] = formatted_recommendations
    print("Öneriler hesaplandı ve önbelleğe alındı")
    
    return formatted_recommendations`}
      />

      <Typography variant="body1" paragraph>
        Bu önbelleğe alma tekniği, aynı puanlama deseni için tekrar hesaplama yapmadan önceki sonuçları döndürerek
        sistem performansını önemli ölçüde artırır.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Frontend ile Entegrasyon
      </Typography>

      <Typography variant="body1" paragraph>
        Frontend uygulaması, API'lerle iletişim kurmak için fetch API'sini kullanır. Aşağıda, içerik tabanlı önerileri 
        almak için kullanılan bir kod örneği bulunmaktadır:
      </Typography>

      <CodeBlock 
        title="Frontend API İsteği"
        code={`const getRecommendations = async (movieId: number) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(\`http://localhost:8000/content-based/\${movieId}\`);
    if (!response.ok) {
      throw new Error('Öneriler alınamadı');
    }
    const data = await response.json();
    setRecommendations(data.recommendations || []);
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Bir hata oluştu');
    setRecommendations([]);
  } finally {
    setLoading(false);
  }
};`}
      />

      <Typography variant="body1" paragraph>
        Next.js ve React ile geliştirilen frontend, kullanıcıların film arama, seçme ve öneriler alma işlemlerini
        interaktif bir şekilde gerçekleştirmelerine olanak tanır.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontFamily: "var(--font-poppins)", mt: 3 }}>
        Hata Yönetimi
      </Typography>

      <Typography variant="body1" paragraph>
        API'de kapsamlı hata yönetimi uygulanmıştır. FastAPI, HTTP istisnaları oluşturmak için <code>HTTPException</code> sınıfını kullanır.
      </Typography>

      <CodeBlock 
        title="Hata Yönetimi"
        code={`try:
    if valid_movies == 0:
        raise HTTPException(
            status_code=400,
            detail="Puanladığınız filmler arasında sistemde kayıtlı film bulunamadı."
        )
    
    # ... (normal işlem kodu) ...
    
except HTTPException as he:
    # HTTP istisnalarını olduğu gibi yükselt
    raise he
except Exception as e:
    # Diğer tüm istisnaları 500 hatasına dönüştür
    raise HTTPException(
        status_code=500,
        detail=f"Öneri hesaplama hatası: {str(e)}"
    )`}
      />

      <Typography variant="body1" paragraph>
        Bu hata yönetimi yaklaşımı, frontend uygulamasının hataları düzgün bir şekilde işlemesine ve kullanıcıya
        anlamlı hata mesajları göstermesine olanak tanır.
      </Typography>
    </Box>
  );
} 