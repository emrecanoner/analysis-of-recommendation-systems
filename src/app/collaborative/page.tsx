'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Rating,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  MenuItem,
  CardActions,
  Select,
  FormControl,
  InputLabel,
  Fade,
  Chip,
  LinearProgress,
  Avatar,
  useTheme,
  useMediaQuery,
  Skeleton,
  TextField
} from '@mui/material';
import { MovieOutlined, ThumbUp, Person, Star, Info, LocalMovies, ArrowForward } from '@mui/icons-material';

interface Movie {
  movie_id: number;
  movie_title: string;
  director_name: string;
  movie_release_year: number;
  rating?: number;
  predicted_rating?: number;
  movie_url: string;
}

export default function CollaborativePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userHistory, setUserHistory] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch('http://localhost:8002/available-users');
        if (!response.ok) {
          throw new Error('Kullanıcı listesi alınamadı');
        }
        const data = await response.json();
        const sortedUsers = data.user_ids.map(String).sort((a: string, b: string) => parseInt(a) - parseInt(b));
        setAvailableUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kullanıcı listesi alınamadı');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredUsers(availableUsers);
    } else {
      const filtered = availableUsers.filter(userId => 
        userId.includes(searchId.trim())
      );
      setFilteredUsers(filtered);
    }
  }, [searchId, availableUsers]);

  const handleUserSearch = async () => {
    if (!selectedUserId) {
      setError('Lütfen bir kullanıcı seçin');
      return;
    }

    setIsLoading(true);
    setError('');
    setUserHistory([]);
    setRecommendations([]);

    try {
      const historyResponse = await fetch(`http://localhost:8002/user-history/${selectedUserId}`);
      const historyData = await historyResponse.json();

      if (!historyResponse.ok) {
        throw new Error(historyData.detail || 'Kullanıcı geçmişi alınamadı');
      }

      // Son 5 filmi al
      const recentHistory = historyData.watched_movies.slice(-5);
      setUserHistory(recentHistory);

      if (historyData.watched_movies.length >= 3) {
        const validRatings = historyData.watched_movies
          .filter((movie: Movie) => {
            const rating = movie.rating ? parseFloat(movie.rating.toFixed(1)) : null;
            return rating != null && 
                   !isNaN(rating) && 
                   isFinite(rating) && 
                   rating >= 0.5 && 
                   rating <= 5.0;
          })
          .map((movie: Movie) => ({
            movie_id: movie.movie_id,
            rating: movie.rating ? parseFloat(movie.rating.toFixed(1)) : 0
          }));

        if (validRatings.length < 3) {
          throw new Error('Geçerli puanı olan en az 3 film gerekiyor');
        }

        const recommendationsResponse = await fetch('http://localhost:8002/collaborative', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validRatings),
        });

        const recommendationsData = await recommendationsResponse.json();

        if (!recommendationsResponse.ok) {
          throw new Error(recommendationsData.detail || 'Öneriler alınamadı');
        }

        setRecommendations(recommendationsData.recommendations);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#8BC34A';
    if (rating >= 2.5) return '#FFC107';
    if (rating >= 1.5) return '#FF9800';
    return '#F44336';
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#0f3460' }}>
            <Person />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: "var(--font-poppins)" }}>
            İşbirlikçi Film Önerileri
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'stretch', md: 'flex-end' } 
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Kullanıcı Seçin</InputLabel>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loadingUsers}
                label="Kullanıcı Seçin"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'white',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#16213e',
                      color: 'white',
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                          }
                        }
                      }
                    }
                  }
                }}
                renderValue={(selected) => `Kullanıcı ${selected}`}
                onOpen={() => setSearchId('')}
              >
                <Box sx={{ 
                  p: 1, 
                  position: 'sticky', 
                  top: 0, 
                  bgcolor: '#16213e', 
                  zIndex: 1,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder="Kullanıcı ID'si girin..."
                    variant="outlined"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key !== 'Escape') {
                        e.stopPropagation();
                      }
                    }}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      input: { color: 'white' },
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      }
                    }}
                  />
                </Box>
                {loadingUsers ? (
                  <MenuItem disabled>Kullanıcılar yükleniyor...</MenuItem>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((userId) => (
                    <MenuItem key={userId} value={userId}>
                      Kullanıcı {userId}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Kullanıcı bulunamadı</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleUserSearch}
            disabled={isLoading || !selectedUserId}
            startIcon={isLoading ? undefined : <ArrowForward />}
            sx={{ 
              minWidth: { xs: '100%', md: 200 },
              height: '56px',
              bgcolor: '#e94560',
              '&:hover': {
                bgcolor: '#d64161',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(233, 69, 96, 0.5)',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Önerileri Göster'}
          </Button>
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(211, 47, 47, 0.15)',
                color: '#ff8a80'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}
      </Paper>

      {isLoading && (
        <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Kullanıcı verileri yükleniyor...
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
      )}

      {userHistory.length > 0 && (
        <Fade in={userHistory.length > 0} timeout={800}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#0f3460' }}>
                <LocalMovies />
              </Avatar>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: "var(--font-poppins)" }}>
                İzleme Geçmişi
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                  (En Yüksek Puanlı {userHistory.length} Film)
                </Typography>
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {userHistory.map((movie, index) => (
                <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={movie.movie_id}>
                  <Box sx={{ 
                    flexBasis: { xs: '100%', sm: '47%', md: '31%' },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        bgcolor: 'rgba(15, 52, 96, 0.6)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                        <Chip 
                          label={`${movie.rating?.toFixed(1)}`}
                          avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><Star fontSize="small" /></Avatar>}
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            bgcolor: getRatingColor(movie.rating || 0),
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                        <Typography variant="h6" gutterBottom sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          pb: 1,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          pr: 7 // Make room for the rating chip
                        }}>
                          {movie.movie_title}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Info sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                            {movie.director_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center' }}>
                            <Info sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                            {movie.movie_release_year}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                          <Rating value={movie.rating} precision={0.5} readOnly size="small" 
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#f9d71c',
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          href={movie.movie_url}
                          target="_blank"
                          sx={{ 
                            borderColor: '#e94560', 
                            color: '#e94560',
                            '&:hover': {
                              borderColor: '#e91e63',
                              bgcolor: 'rgba(233, 30, 99, 0.08)'
                            }
                          }}
                        >
                          MUBI'de İzle
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </Fade>
              ))}
            </Box>
          </Paper>
        </Fade>
      )}

      {recommendations.length > 0 && (
        <Fade in={recommendations.length > 0} timeout={1000}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#e94560' }}>
                <ThumbUp />
              </Avatar>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: "var(--font-poppins)" }}>
                Önerilen Filmler
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                  (En Yüksek Puanlı {recommendations.length} Film)
                </Typography>
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {recommendations.map((movie, index) => (
                <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={movie.movie_id}>
                  <Box sx={{ 
                    flexBasis: { xs: '100%', sm: '47%', md: '31%' },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        bgcolor: 'rgba(233, 69, 96, 0.15)',
                        borderRadius: 2,
                        border: '1px solid rgba(233, 69, 96, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                        <Chip 
                          label={`${movie.predicted_rating?.toFixed(1)}`}
                          avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><Star fontSize="small" /></Avatar>}
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            bgcolor: getRatingColor(movie.predicted_rating || 0),
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                        <Typography variant="h6" gutterBottom sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          pb: 1,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          pr: 7 // Make room for the rating chip
                        }}>
                          {movie.movie_title}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Info sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                            {movie.director_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center' }}>
                            <Info sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                            {movie.movie_release_year}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                          <Rating value={movie.predicted_rating} precision={0.5} readOnly size="small" 
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#f9d71c',
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          href={movie.movie_url}
                          target="_blank"
                          sx={{ 
                            borderColor: '#e94560', 
                            color: '#e94560',
                            '&:hover': {
                              borderColor: '#e91e63',
                              bgcolor: 'rgba(233, 30, 99, 0.08)'
                            }
                          }}
                        >
                          MUBI'de İzle
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                </Fade>
              ))}
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
} 