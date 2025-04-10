'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Card, 
  CardContent,
  CircularProgress,
  Autocomplete,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Movie {
  movie_id: number;
  movie_title: string;
  director_name: string;
  movie_release_year: number | null;
  movie_title_language: string;
  movie_popularity: number;
  similarity_score: number;
  movie_url: string;
}

interface MovieSuggestion {
  movie_id: number;
  movie_title: string;
}

export default function RecommendationsPage() {
  const [selectedMovie, setSelectedMovie] = useState<MovieSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMovie, setExpandedMovie] = useState<number | null>(null);

  // Film arama
  const searchMovies = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Hatası:', errorData);
        throw new Error(errorData.detail || 'Arama yapılamadı');
      }
      
      const data = await response.json();
      setSuggestions(data.movies || []);
    } catch (e) {
      console.error('Film arama hatası:', e);
      setSuggestions([]);
    }
  };

  // Film önerileri al
  const getRecommendations = async (movieId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/content-based/${movieId}`);
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
  };

  // Film seçildiğinde önerileri getir
  useEffect(() => {
    if (selectedMovie) {
      getRecommendations(selectedMovie.movie_id);
    }
  }, [selectedMovie]);

  const handleExpandClick = (movieId: number) => {
    setExpandedMovie(expandedMovie === movieId ? null : movieId);
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Container maxWidth="lg">
        <Box py={8}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 6
          }}>
            Film Önerileri
          </Typography>

          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
            <Autocomplete
              options={suggestions}
              getOptionLabel={(option) => option.movie_title}
              onChange={(_, newValue) => setSelectedMovie(newValue)}
              onInputChange={(_, newInputValue) => searchMovies(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Film adı yazın..."
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196F3',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      display: 'none'
                    },
                    '& .MuiInputBase-input': {
                      color: 'black',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.5)',
                        opacity: 1
                      }
                    }
                  }}
                />
              )}
            />
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {error && (
            <Box sx={{ 
              backgroundColor: 'error.main', 
              color: 'white', 
              p: 2, 
              borderRadius: 2,
              textAlign: 'center',
              mb: 4
            }}>
              {error}
            </Box>
          )}

          {recommendations.length > 0 && (
            <>
              <Typography variant="h5" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                "{selectedMovie?.movie_title}" filmine benzer filmler:
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 4 
              }}>
                {recommendations.map((movie) => (
                  <Card key={movie.movie_id} sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                          {movie.movie_title}
                        </Typography>
                        <IconButton
                          onClick={() => handleExpandClick(movie.movie_id)}
                          sx={{ color: 'white' }}
                        >
                          {expandedMovie === movie.movie_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Yönetmen: {movie.director_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Yıl: {movie.movie_release_year}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Dil: {movie.movie_title_language}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Popülerlik: {movie.movie_popularity.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Benzerlik: {(movie.similarity_score * 100).toFixed(1)}%
                      </Typography>
                      <Collapse in={expandedMovie === movie.movie_id}>
                        <Box sx={{ 
                          mt: 2,
                          p: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: 1
                        }}>
                          <Typography 
                            component="a" 
                            href={movie.movie_url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#2196F3',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            MUBI'de İncele →
                          </Typography>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
} 