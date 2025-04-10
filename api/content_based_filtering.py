from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from typing import List, Dict

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

def prepare_content_based_data():
    """Film verilerini hazırla ve TF-IDF matrisini oluştur"""
    try:
        # Veri dosyasını oku - sadece ilk 10000 filmi al
        movies_df = pd.read_csv(
            os.path.join("api", "data", "mubi_movie_data.csv"),
            nrows=10000
        )
        
        # Eksik değerleri doldur
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
        ])), axis=1)
        
        # TF-IDF vektörizasyonu
        tfidf = TfidfVectorizer(
            stop_words='english',
            max_features=2000,
            strip_accents='unicode',
            min_df=2,
            max_df=0.95,
            ngram_range=(1, 2)
        )
        
        tfidf_matrix = tfidf.fit_transform(movies_df['content'])
        
        # Benzerlik matrisini hesapla
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix, dense_output=False)
        
        return movies_df, cosine_sim

    except Exception as e:
        print(f"Veri hazırlama hatası: {str(e)}")
        raise e

def get_recommendations(movie_id: int, movies_df: pd.DataFrame, cosine_sim: np.ndarray) -> List[Dict]:
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
        raise e

# Global değişkenler
movies_df = None
cosine_sim = None

@app.on_event("startup")
async def startup_event():
    """Uygulama başladığında veriyi hazırla"""
    global movies_df, cosine_sim
    movies_df, cosine_sim = prepare_content_based_data()
    print("İçerik tabanlı filtreleme için veriler hazırlandı")

@app.get("/")
async def root():
    """API kök endpoint'i"""
    return {
        "message": "MUBI Film Öneri Sistemi API'sine Hoş Geldiniz",
        "endpoints": {
            "content_based_recommendations": "/content-based/{movie_id}",
            "description": "Belirli bir film için içerik tabanlı öneriler almak için kullanılır"
        }
    }

@app.get("/content-based/{movie_id}")
async def get_content_based_recommendations(movie_id: int):
    """Belirli bir film için içerik tabanlı önerileri döndür"""
    try:
        if movies_df is None or cosine_sim is None:
            raise HTTPException(status_code=500, detail="Veriler henüz hazır değil")
        
        recommendations = get_recommendations(movie_id, movies_df, cosine_sim)
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 