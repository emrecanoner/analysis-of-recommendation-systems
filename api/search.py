from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
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

# Global değişkenler
movies_df = None

@app.on_event("startup")
async def startup_event():
    """Uygulama başladığında veriyi yükle"""
    global movies_df
    try:
        # Sadece gerekli sütunları ve ilk 10000 filmi yükle
        movies_df = pd.read_csv(
            os.path.join("api", "data", "mubi_movie_data.csv"),
            usecols=['movie_id', 'movie_title'],
            nrows=10000
        )
        print("Film verileri yüklendi")
    except Exception as e:
        print(f"Veri yükleme hatası: {str(e)}")
        raise e

@app.get("/")
async def root():
    """API kök endpoint'i"""
    return {
        "message": "MUBI Film Arama API'sine Hoş Geldiniz",
        "endpoints": {
            "search": "/search?query={film_adı}",
            "description": "Film aramak için kullanılır"
        }
    }

@app.get("/search")
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
        print(f"Arama hatası: {str(e)}")
        return {"movies": []} 