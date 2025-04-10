from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
from typing import List, Dict
from pydantic import BaseModel

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
ratings_df = None
users_df = None
user_movie_matrix = None
similarity_matrix = None
user_recommendations_cache = {}  # Önerileri önbelleğe almak için

def prepare_collaborative_data():
    """Film ve kullanıcı verilerini hazırla"""
    try:
        global movies_df, ratings_df, user_movie_matrix, similarity_matrix
        
        print("Film verileri okunuyor...")
        movies_df = pd.read_csv(
            os.path.join("api", "data", "mubi_movie_data.csv"),
            usecols=['movie_id', 'movie_title', 'director_name', 'movie_release_year', 'movie_url']
        )
        
        print("Rating verileri okunuyor...")
        ratings_df = pd.read_csv(
            os.path.join("api", "data", "mubi_ratings_data.csv"),
            usecols=['user_id', 'movie_id', 'rating_score']
        )
        
        # Tekrar eden puanlamaları gruplandır ve ortalama al
        print("Tekrar eden puanlamalar gruplandırılıyor...")
        ratings_df = ratings_df.groupby(['user_id', 'movie_id'])['rating_score'].mean().reset_index()
        
        # En aktif 100 kullanıcı ve en popüler 200 filmi seç
        print("Aktif kullanıcılar ve popüler filmler seçiliyor...")
        min_ratings = 10  # En az 10 film puanlamış kullanıcıları seç
        user_counts = ratings_df['user_id'].value_counts()
        active_users = user_counts[user_counts >= min_ratings].nlargest(5000).index
        filtered_ratings = ratings_df[ratings_df['user_id'].isin(active_users)]
        
        # En çok puanlanan 200 filmi seç
        movie_counts = filtered_ratings['movie_id'].value_counts()
        popular_movies = movie_counts.nlargest(2000).index
        filtered_ratings = filtered_ratings[filtered_ratings['movie_id'].isin(popular_movies)]
        
        # User-Movie matrisini oluştur
        print("User-Movie matrisi oluşturuluyor...")
        user_movie_matrix = filtered_ratings.pivot(
            index='user_id',
            columns='movie_id',
            values='rating_score'
        ).fillna(0)
        
        # Benzerlik matrisini önceden hesapla
        print("Benzerlik matrisi hesaplanıyor...")
        similarity_matrix = cosine_similarity(user_movie_matrix)
        
        print("Veri hazırlama tamamlandı!")
        print(f"Toplam kullanıcı sayısı: {len(user_counts)}")
        print(f"Seçilen kullanıcı sayısı: {len(active_users)}")
        print(f"Toplam film sayısı: {len(movies_df)}")
        print(f"Seçilen film sayısı: {len(popular_movies)}")
        
        return True
        
    except Exception as e:
        print(f"Veri hazırlama hatası: {str(e)}")
        raise e

def get_user_recommendations(user_ratings: List[Dict], top_n: int = 10) -> List[Dict]:
    """Kullanıcının puanlarına göre film önerileri yap"""
    try:
        # Önbellekte varsa direkt döndür
        cache_key = str(sorted([(r['movie_id'], r['rating']) for r in user_ratings]))
        if cache_key in user_recommendations_cache:
            print("Öneriler önbellekten alındı")
            return user_recommendations_cache[cache_key]
        
        print("Yeni öneriler hesaplanıyor...")
        
        # Kullanıcının puanladığı filmleri bul
        rated_movies = {rating['movie_id']: rating['rating'] for rating in user_ratings}
        print(f"Kullanıcının puanladığı film sayısı: {len(rated_movies)}")
        
        # Kullanıcı vektörünü oluştur
        user_vector = np.zeros(len(user_movie_matrix.columns))
        valid_movies = 0
        for movie_id, rating in rated_movies.items():
            if movie_id in user_movie_matrix.columns:
                movie_idx = user_movie_matrix.columns.get_loc(movie_id)
                user_vector[movie_idx] = rating
                valid_movies += 1
        
        print(f"Geçerli film sayısı: {valid_movies}")
        
        if valid_movies == 0:
            raise HTTPException(
                status_code=400,
                detail="Puanladığınız filmler arasında sistemde kayıtlı film bulunamadı. Lütfen film arama kutusunu kullanarak film bulup puanlayın."
            )
        
        # Önceden hesaplanmış benzerlik matrisini kullan
        user_similarities = cosine_similarity([user_vector], user_movie_matrix)[0]
        
        # En benzer 2 kullanıcıyı bul
        similar_indices = np.argsort(user_similarities)[-2:][::-1]
        similar_users = user_movie_matrix.iloc[similar_indices]
        similarities = user_similarities[similar_indices]
        
        print(f"En benzer kullanıcılar bulundu. Benzerlik değerleri: {similarities}")
        
        # Önerileri hesapla
        recommendations = []
        seen_movies = set(rated_movies.keys())
        
        # Benzer kullanıcıların en yüksek puanladığı filmleri bul
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
                                recommendations.append((movie_id, weighted_rating))
        
        # En yüksek puanlı filmleri seç
        recommendations.sort(key=lambda x: x[1], reverse=True)
        top_recommendations = recommendations[:top_n]
        
        print(f"{len(recommendations)} film önerisi bulundu, en iyi {len(top_recommendations)} tanesi seçildi")
        
        if len(top_recommendations) == 0:
            raise HTTPException(
                status_code=404,
                detail="Maalesef size uygun film önerisi bulunamadı. Lütfen daha fazla film puanlayın veya farklı filmler deneyin."
            )
        
        # Önerileri formatla
        formatted_recommendations = []
        for movie_id, pred_rating in top_recommendations:
            movie = movies_df[movies_df['movie_id'] == movie_id].iloc[0]
            # JSON uyumluluğu için değerin geçerli olduğunu kontrol et
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
        print("Öneriler hesaplandı ve önbelleğe alındı")
        
        return formatted_recommendations
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Öneri hesaplama hatası: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Öneri hesaplama hatası: {str(e)}"
        )

@app.on_event("startup")
async def startup_event():
    """Uygulama başladığında veriyi hazırla"""
    print("Veriler hazırlanıyor...")
    prepare_collaborative_data()
    print("Veriler hazır!")

@app.get("/")
async def root():
    """API kök endpoint'i"""
    return {
        "message": "MUBI İşbirlikçi Filtreleme API'sine Hoş Geldiniz",
        "endpoints": {
            "/collaborative": "Kullanıcı puanlarına göre film önerileri almak için kullanılır",
            "/user-history/{user_id}": "Belirli bir kullanıcının izleme geçmişini görüntülemek için kullanılır",
            "/available-users": "Kullanılabilir kullanıcı ID'lerini listeler"
        }
    }

class Rating(BaseModel):
    movie_id: int
    rating: float

@app.post("/collaborative")
async def get_recommendations(ratings: List[Rating]):
    """Kullanıcı puanlarına göre film önerileri döndür"""
    try:
        print(f"Gelen puanlar: {ratings}")
        
        if user_movie_matrix is None:
            raise HTTPException(
                status_code=500,
                detail="Veriler henüz yüklenmedi. Lütfen biraz bekleyin ve tekrar deneyin."
            )
            
        if len(ratings) < 3:
            raise HTTPException(
                status_code=400,
                detail="En az 3 film puanlamanız gerekiyor. Lütfen film arama kutusunu kullanarak film bulup puanlayın."
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
        
        try:
            recommendations = get_user_recommendations(ratings_dict)
            print(f"Öneriler hesaplandı: {len(recommendations)} film")
            return {"recommendations": recommendations}
        except TimeoutError:
            raise HTTPException(
                status_code=408,
                detail="İstek zaman aşımına uğradı. Lütfen daha az film seçerek tekrar deneyin."
            )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Öneri hesaplama hatası: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Öneriler hesaplanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        )

@app.get("/user-history/{user_id}")
async def get_user_history(user_id: int):
    """Belirli bir kullanıcının izleme geçmişini döndür"""
    try:
        if ratings_df is None or movies_df is None:
            raise HTTPException(
                status_code=500,
                detail="Veriler henüz yüklenmedi. Lütfen biraz bekleyin ve tekrar deneyin."
            )

        # Kullanıcının puanlarını bul
        user_ratings = ratings_df[ratings_df['user_id'] == user_id]
        
        if len(user_ratings) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"{user_id} ID'li kullanıcı bulunamadı veya henüz film puanlamamış."
            )
            
        # 5 yıldız verilen filmleri filtrele
        five_star_ratings = user_ratings[user_ratings['rating_score'] == 5.0]
        
        # Eğer 5 yıldız verilen film yoksa, normal puanlamaları kullan
        if len(five_star_ratings) == 0:
            print(f"Kullanıcı {user_id} hiç 5 yıldız vermemiş, normal puanlamalar kullanılıyor.")
            top_ratings = user_ratings.sort_values('rating_score', ascending=False).head(10)
        else:
            # En fazla 10 tane 5 yıldızlı film al
            print(f"Kullanıcı {user_id}'nin {len(five_star_ratings)} adet 5 yıldızlı filmi var.")
            top_ratings = five_star_ratings.head(10)
        
        # Kullanıcının izlediği filmleri formatla
        watched_movies = []
        for _, rating in top_ratings.iterrows():
            movie_matches = movies_df[movies_df['movie_id'] == rating['movie_id']]
            if len(movie_matches) > 0:
                movie = movie_matches.iloc[0]
                watched_movies.append({
                    'movie_id': int(rating['movie_id']),
                    'movie_title': str(movie['movie_title']),
                    'director_name': str(movie['director_name']),
                    'movie_release_year': int(movie['movie_release_year']) if pd.notna(movie['movie_release_year']) else None,
                    'rating': float(rating['rating_score']),
                    'movie_url': str(movie['movie_url']) if pd.notna(movie['movie_url']) else None
                })
            
        return {
            "user_id": user_id,
            "total_ratings": len(user_ratings),
            "shown_ratings": len(watched_movies),
            "watched_movies": watched_movies
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Kullanıcı geçmişi hatası: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Kullanıcı geçmişi alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        )

@app.get("/available-users")
async def get_available_users():
    """Kullanılabilir kullanıcı ID'lerini listeler"""
    try:
        if ratings_df is None:
            raise HTTPException(
                status_code=500,
                detail="Veriler henüz yüklenmedi. Lütfen biraz bekleyin ve tekrar deneyin."
            )
            
        # En aktif kullanıcıları bul
        user_counts = ratings_df['user_id'].value_counts()
        active_users = user_counts[user_counts >= 5].index.tolist()[:1000]
        
        return {
            "total_users": len(active_users),
            "user_ids": active_users,
            "message": "Bu kullanıcılar hem geçmişlerini görüntüleyebilir hem de öneri alabilirler."
        }
        
    except Exception as e:
        print(f"Kullanıcı listesi hatası: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Kullanıcı listesi alınırken bir hata oluştu."
        ) 