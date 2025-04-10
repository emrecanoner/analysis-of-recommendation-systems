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
} from '@mui/material';
import { MovieOutlined, ThumbUp } from '@mui/icons-material';

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
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userHistory, setUserHistory] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await fetch('http://localhost:8002/available-users');
        if (!response.ok) {
          throw new Error('Kullanıcı listesi alınamadı');
        }
        const data = await response.json();
        setAvailableUsers(data.user_ids.map(String));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kullanıcı listesi alınamadı');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAvailableUsers();
  }, []);

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

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MovieOutlined />
          <Typography variant="h6">
            İşbirlikçi Film Önerileri
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <FormControl fullWidth>
            <InputLabel>Kullanıcı Seçin</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={loadingUsers}
              label="Kullanıcı Seçin"
              sx={{
                bgcolor: 'transparent',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#f5f5f5'
                  }
                }
              }}
            >
              {loadingUsers ? (
                <MenuItem disabled>Kullanıcılar yükleniyor...</MenuItem>
              ) : (
                availableUsers.map((userId) => (
                  <MenuItem key={userId} value={userId}>
                    Kullanıcı {userId}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleUserSearch}
            disabled={isLoading || !selectedUserId}
            sx={{ minWidth: 200 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Kullanıcıyı Bul'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {userHistory.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <MovieOutlined />
            <Typography variant="h6">
              İzleme Geçmişi (En Yüksek Puanlı Filmler)
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {userHistory.map((movie) => (
              <Box key={movie.movie_id} sx={{ flexBasis: { xs: '100%', sm: '47%', md: '31%' } }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {movie.movie_title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {movie.director_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {movie.movie_release_year}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Rating value={movie.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {movie.rating?.toFixed(1)} / 5.0
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={movie.movie_url}
                      target="_blank"
                    >
                      MUBI'de İzle
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {recommendations.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ThumbUp />
            <Typography variant="h6">
              Size Özel Öneriler ({recommendations.length} Film)
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {recommendations.map((movie) => (
              <Box key={movie.movie_id} sx={{ flexBasis: { xs: '100%', sm: '47%', md: '31%' } }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {movie.movie_title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {movie.director_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {movie.movie_release_year}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Rating value={movie.predicted_rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {movie.predicted_rating?.toFixed(1)} / 5.0
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={movie.movie_url}
                      target="_blank"
                    >
                      MUBI'de İzle
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
} 