from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from fastapi.responses import JSONResponse
import os
from pathlib import Path

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

def get_mubi_data():
    """MUBI veritabanından veri çek"""
    try:
        base_dir = os.path.join("api", "data")
        
        # CSV dosyalarını oku
        movies_df = pd.read_csv(os.path.join(base_dir, "mubi_movie_data.csv"))
        ratings_df = pd.read_csv(os.path.join(base_dir, "mubi_ratings_data.csv"))
        lists_df = pd.read_csv(os.path.join(base_dir, "mubi_lists_data.csv"))
        
        # Yıllara göre film dağılımı
        year_distribution = (
            movies_df['movie_release_year']
            .value_counts()
            .sort_index()
            .dropna()
            .astype(int)
            .to_dict()
        )
        
        # int64 değerlerini normal int'e dönüştür
        year_distribution = {int(k): int(v) for k, v in year_distribution.items()}
        
        # Film değerlendirme istatistikleri
        rating_stats = ratings_df.groupby('movie_id').agg({
            'rating_score': ['count', 'mean']
        }).reset_index()
        rating_stats.columns = ['movie_id', 'rating_count', 'rating_mean']
        
        # En çok değerlendirilen ve en yüksek puanlı filmler
        top_rated_movies = pd.merge(
            rating_stats[rating_stats['rating_count'] >= 100],  # En az 100 değerlendirme
            movies_df[['movie_id', 'movie_title', 'movie_release_year', 'director_name']],
            on='movie_id'
        ).sort_values('rating_mean', ascending=False)

        # Puan dağılımı
        rating_distribution = (
            ratings_df['rating_score']
            .value_counts()
            .sort_index()
            .to_dict()
        )
        
        # Yönetmen istatistikleri
        director_stats = movies_df.groupby('director_name').agg({
            'movie_id': 'count',
            'movie_popularity': 'sum'
        }).reset_index()
        director_stats.columns = ['director_name', 'movie_count', 'total_popularity']
        
        # En popüler yönetmenler
        top_directors = (
            director_stats[director_stats['movie_count'] >= 3]  # En az 3 film
            .sort_values('total_popularity', ascending=False)
            .head(10)
            .to_dict('records')
        )
        
        # Film popülerliğini movie_popularity'den al
        movies_df['list_count'] = movies_df['movie_popularity'].fillna(0).astype(int)
        popular_movies = movies_df.sort_values('movie_popularity', ascending=False)
        
        stats = {
            'total_movies': int(len(movies_df)),
            'total_ratings': int(len(ratings_df)),
            'total_lists': int(len(lists_df)),
            'average_rating': round(float(ratings_df['rating_score'].mean()), 2),
            'year_distribution': year_distribution,
            'rating_distribution': {str(k): int(v) for k, v in rating_distribution.items()},
            'top_rated_movies': [
                {
                    'movie_title': str(row['movie_title']),
                    'movie_year': int(row['movie_release_year']) if pd.notna(row['movie_release_year']) else None,
                    'director': str(row['director_name']) if pd.notna(row['director_name']) else 'Belirtilmemiş',
                    'rating': round(float(row['rating_mean']), 2),
                    'rating_count': int(row['rating_count'])
                }
                for _, row in top_rated_movies.head(10).iterrows()
            ],
            'top_directors': [
                {
                    'director_name': str(row['director_name']),
                    'movie_count': int(row['movie_count']),
                    'total_popularity': int(row['total_popularity'])
                }
                for row in top_directors
            ],
            'movies_sample': [
                {
                    'movie_title': str(row['movie_title']),
                    'movie_year': int(row['movie_release_year']) if pd.notna(row['movie_release_year']) else None,
                    'movie_director': str(row['director_name']) if pd.notna(row['director_name']) else 'Belirtilmemiş',
                    'list_count': int(row['movie_popularity']) if pd.notna(row['movie_popularity']) else 0
                }
                for _, row in popular_movies.head(12).iterrows()
            ]
        }
        
        return stats
        
    except Exception as e:
        print(f"Veri çekme hatası: {str(e)}")
        print(f"Hata detayı: {e.__class__.__name__}")
        raise e

@app.get("/")
async def root():
    return {"message": "API çalışıyor"}

@app.get("/analysis")
async def get_analysis():
    try:
        print("Veri analizi başlıyor...")
        
        stats = get_mubi_data()
        print("Veri yüklendi")
        
        return JSONResponse(content=stats)

    except Exception as e:
        print(f"Genel hata: {str(e)}")
        return JSONResponse(
            content={"error": "Veri analizi sırasında bir hata oluştu: " + str(e)},
            status_code=500
        ) 