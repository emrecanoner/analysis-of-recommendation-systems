'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Autocomplete,
  Chip,
  Collapse,
  IconButton,
  TextField,
  Button,
  Avatar,
  Fade,
  Divider,
  CardActions,
  LinearProgress,
  Tooltip,
  Rating,
  Grow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieIcon from '@mui/icons-material/Movie';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TheatersIcon from '@mui/icons-material/Theaters';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarRateIcon from '@mui/icons-material/StarRate';
import { motion } from 'framer-motion';

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMovie, setExpandedMovie] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Film arama
  const searchMovies = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setSearchLoading(true);
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
    } finally {
      setSearchLoading(false);
    }
  };

  // Arama sorgusunu işleme
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchMovies(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Film önerileri al
  const getRecommendations = async (movieId: number) => {
    setLoading(true);
    setError(null);
    setRecommendations([]);
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

  // Benzerlik yüzdesine göre renk döndür
  const getSimilarityColor = (score: number) => {
    const percent = score * 100;
    if (percent >= 90) return '#4CAF50';
    if (percent >= 80) return '#8BC34A';
    if (percent >= 70) return '#CDDC39';
    if (percent >= 60) return '#FFC107';
    if (percent >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      py: { xs: 4, md: 6 },
      px: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontFamily: "var(--font-poppins)"
            }}
          >
            <TheatersIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#e94560' }} />
            İçerik Tabanlı Film Önerileri
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              p: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                fontFamily: "var(--font-poppins)"
              }}
            >
              <SearchIcon sx={{ mr: 1, color: '#e94560' }} />
              Film Ara
            </Typography>
            
            <Autocomplete
              options={suggestions}
              getOptionLabel={(option) => option.movie_title}
              onChange={(_, newValue) => setSelectedMovie(newValue)}
              onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
              loading={searchLoading}
              noOptionsText={<Typography sx={{ color: 'white' }}>Film bulunamadı</Typography>}
              loadingText={<Typography sx={{ color: 'white' }}>Filmler aranıyor...</Typography>}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Film adı yazın..."
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#e94560',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1
                      }
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      }
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box 
                  component="li"
                  {...props} 
                  sx={{ 
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    },
                    py: 1.5
                  }}
                >
                  <MovieIcon sx={{ mr: 1, color: '#e94560' }} />
                  {option.movie_title}
                </Box>
              )}
              ListboxProps={{
                style: { 
                  backgroundColor: 'rgba(26, 26, 46, 0.95)',
                  backdropFilter: 'blur(10px)'
                }
              }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }
                }
              }}
            />
            
            {selectedMovie && (
              <Fade in={!!selectedMovie}>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label={selectedMovie.movie_title}
                    onDelete={() => setSelectedMovie(null)}
                    avatar={<Avatar sx={{ bgcolor: '#e94560 !important' }}><MovieIcon fontSize="small" /></Avatar>}
                    sx={{ 
                      bgcolor: 'rgba(233, 69, 96, 0.2)',
                      color: 'white',
                      borderRadius: '4px',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white'
                        }
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    ID: {selectedMovie.movie_id}
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
        </motion.div>

        {loading && (
          <Fade in={loading}>
            <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, textAlign: 'center' }}>
                Benzer filmler bulunuyor...
              </Typography>
              <LinearProgress sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#e94560',
                }
              }} />
            </Box>
          </Fade>
        )}

        {error && (
          <Fade in={!!error}>
            <Box sx={{ 
              backgroundColor: 'rgba(211, 47, 47, 0.15)', 
              color: '#ff8a80', 
              p: 2, 
              borderRadius: 2,
              textAlign: 'center',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              border: '1px solid rgba(211, 47, 47, 0.3)',
            }}>
              <Typography variant="body1">
                {error}
              </Typography>
            </Box>
          </Fade>
        )}

        {recommendations.length > 0 && (
          <Fade in={recommendations.length > 0} timeout={800}>
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 4
              }}>
                <Divider sx={{ 
                  flexGrow: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  maxWidth: '200px'
                }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    mx: 2, 
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "var(--font-poppins)"
                  }}
                >
                  <MovieIcon sx={{ mr: 1, color: '#e94560' }} />
                  Benzer Filmler
                  <Chip 
                    label={recommendations.length}
                    size="small"
                    sx={{ 
                      ml: 1,
                      bgcolor: '#e94560',
                      color: 'white',
                      height: 24
                    }}
                  />
                </Typography>
                <Divider sx={{ 
                  flexGrow: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  maxWidth: '200px'
                }} />
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3
              }}>
                {recommendations.map((movie, index) => (
                  <Grow 
                    in={true} 
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={300 + (index * 100)}
                    key={movie.movie_id}
                  >
                    <Card sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      overflow: 'visible',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
                      }
                    }}>
                      {/* Benzerlik yüzde göstergesi */}
                      <Box sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        bgcolor: getSimilarityColor(movie.similarity_score),
                        color: 'white',
                        borderRadius: '12px',
                        px: 1.5,
                        py: 0.5,
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        border: '2px solid #16213e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <StarRateIcon fontSize="small" />
                        {(movie.similarity_score * 100).toFixed(0)}%
                      </Box>
                      
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography 
                            variant="h6" 
                            component="h2" 
                            sx={{ 
                              color: 'white',
                              fontWeight: 'bold',
                              mb: 1,
                              pr: 2 // Space for the expand button
                            }}
                          >
                            {movie.movie_title}
                          </Typography>
                          <IconButton
                            onClick={() => handleExpandClick(movie.movie_id)}
                            aria-expanded={expandedMovie === movie.movie_id}
                            aria-label="Detayları göster"
                            sx={{ 
                              color: 'white',
                              p: 0.5,
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                          >
                            {expandedMovie === movie.movie_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
                        
                        <Box sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                          gap: 1,
                          alignItems: 'center',
                          mb: 2
                        }}>
                          <InfoIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {movie.director_name || 'Bilinmiyor'}
                          </Typography>
                          
                          <InfoIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {movie.movie_release_year || 'Bilinmiyor'}
                          </Typography>
                          
                          <LanguageIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {movie.movie_title_language || 'Bilinmiyor'}
                          </Typography>
                          
                          <TrendingUpIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Popülerlik: {movie.movie_popularity.toFixed(1)}
                          </Typography>
                        </Box>
                        
                        <Collapse in={expandedMovie === movie.movie_id}>
                          <Box sx={{ 
                            mt: 2,
                            p: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 1
                          }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                              Bu film seçtiğiniz filmle <strong>%{(movie.similarity_score * 100).toFixed(1)}</strong> oranında benzerlik gösteriyor.
                            </Typography>
                            
                            <Rating 
                              value={movie.movie_popularity > 10 ? 5 : (movie.movie_popularity / 2)} 
                              readOnly 
                              precision={0.5}
                              sx={{
                                mb: 2,
                                '& .MuiRating-iconFilled': {
                                  color: '#f9d71c',
                                }
                              }}
                            />
                            
                            <Button 
                              component="a" 
                              href={movie.movie_url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              fullWidth
                              sx={{ 
                                bgcolor: '#e94560',
                                '&:hover': {
                                  bgcolor: '#d64161',
                                }
                              }}
                            >
                              MUBI'de İncele
                            </Button>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Grow>
                ))}
              </Box>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
} 