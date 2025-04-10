'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Container, Paper } from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Movie {
  movie_title: string;
  movie_year: number | null;
  movie_director: string;
  list_count: number;
}

interface TopRatedMovie {
  movie_title: string;
  movie_year: number | null;
  director: string;
  rating: number;
  rating_count: number;
}

interface Director {
  director_name: string;
  movie_count: number;
  total_popularity: number;
}

interface AnalysisData {
  total_movies: number;
  total_ratings: number;
  total_lists: number;
  average_rating: number;
  year_distribution: { [key: string]: number };
  rating_distribution: { [key: string]: number };
  top_rated_movies: TopRatedMovie[];
  top_directors: Director[];
  movies_sample: Movie[];
}

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analysis');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const yearDistributionData = Object.entries(data?.year_distribution || {}).map(([year, count]) => ({
    year: parseInt(year),
    'Film Sayısı': count
  })).sort((a, b) => a.year - b.year);

  // Son 10 yılın verilerini al
  const recentYearsData = yearDistributionData.slice(-10);

  // Film kartları için grid renkleri
  const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="subtitle2">{label} Yılı</Typography>
          <Typography variant="body2" color="primary">
            {payload[0].value} Film
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Puan dağılımı verisi
  const ratingDistributionData = Object.entries(data?.rating_distribution || {}).map(([rating, count]) => ({
    rating: parseFloat(rating),
    count: count
  })).sort((a, b) => a.rating - b.rating);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box p={3}>
          <Paper sx={{ p: 3, backgroundColor: '#FEE2E2' }}>
            <Typography color="error" variant="h6">Hata Oluştu</Typography>
            <Typography color="error">{error}</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg">
        <Box p={3}>
          <Paper sx={{ p: 3 }}>
            <Typography>Veri bulunamadı.</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textAlign: 'center'
          }}>
            MUBI Film Analizi
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
            {[
              { title: 'Toplam Film', value: data.total_movies, color: '#2196F3' },
              { title: 'Toplam Değerlendirme', value: data.total_ratings, color: '#4CAF50' },
              { title: 'Toplam Liste', value: data.total_lists, color: '#FF9800' },
              { title: 'Ortalama Puan', value: data.average_rating.toFixed(1), color: '#E91E63' }
            ].map((item, index) => (
              <Card key={index} sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' },
                background: `linear-gradient(45deg, ${item.color}40 30%, ${item.color}20 90%)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>{item.title}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>{item.value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
            <Card sx={{ 
              flex: '1 1 100%',
              background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 3
                }}>
                  Yıllara Göre Film Dağılımı
                </Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <AreaChart data={yearDistributionData}>
                      <defs>
                        <linearGradient id="filmGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fill: 'white' }}
                        tickFormatter={(value) => value.toString()}
                      />
                      <YAxis tick={{ fill: 'white' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          color: 'white'
                        }}
                      />
                      <Area 
                        type="monotone"
                        dataKey="Film Sayısı"
                        stroke="#2196F3"
                        fillOpacity={1}
                        fill="url(#filmGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              flex: '1 1 100%',
              background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 3
                }}>
                  Puan Dağılımı
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={ratingDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="rating" 
                        tick={{ fill: 'white' }}
                        label={{ value: 'Puan', position: 'bottom', fill: 'white', dy: 10 }}
                      />
                      <YAxis 
                        tick={(props) => {
                          const { x, y, payload } = props;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={0}
                                y={0}
                                dy={-4}
                                textAnchor="end"
                                fill="white"
                                transform="rotate(-45)"
                              >
                                {payload.value.toLocaleString()}
                              </text>
                            </g>
                          );
                        }}
                        width={80}
                        label={{ 
                          value: 'Değerlendirme Sayısı', 
                          position: 'insideLeft',
                          fill: 'white',
                          dx: -20,
                          angle: -90
                        }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          color: 'white'
                        }}
                        formatter={(value: any) => [`${value.toLocaleString()} değerlendirme`, 'Sayı']}
                        labelFormatter={(label) => `${label} puan`}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#4CAF50"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 3
          }}>
            En Yüksek Puanlı Filmler
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3,
            mb: 6
          }}>
            {data.top_rated_movies.map((movie, index) => (
              <Card key={index} sx={{ 
                background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2
                  }}>
                    {movie.movie_title}
                  </Typography>
                  <Box sx={{ color: 'white', opacity: 0.8 }}>
                    <Typography sx={{ mb: 1 }}>
                      {movie.movie_year ? `${movie.movie_year}` : 'Yıl: Belirtilmemiş'}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      {movie.director}
                    </Typography>
                    <Typography sx={{
                      color: '#4CAF50',
                      fontWeight: 'bold'
                    }}>
                      Puan: {movie.rating} ({movie.rating_count} değerlendirme)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 3
          }}>
            En Popüler Yönetmenler
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 6
          }}>
            {data.top_directors.map((director, index) => (
              <Card key={index} sx={{ 
                background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2
                  }}>
                    {director.director_name}
                  </Typography>
                  <Box sx={{ color: 'white', opacity: 0.8 }}>
                    <Typography sx={{ mb: 1 }}>
                      Film Sayısı: {director.movie_count}
                    </Typography>
                    <Typography sx={{
                      color: '#FF9800',
                      fontWeight: 'bold'
                    }}>
                      Toplam Popülerlik: {director.total_popularity}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 3
          }}>
            En Popüler Filmler
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {data.movies_sample.map((movie, index) => (
              <Card key={index} sx={{ 
                background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .movie-info': {
                    opacity: 1
                  }
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2
                  }}>
                    {movie.movie_title}
                  </Typography>
                  <Box className="movie-info" sx={{
                    color: 'white',
                    opacity: 0.8,
                    transition: 'opacity 0.3s'
                  }}>
                    <Typography sx={{ mb: 1 }}>
                      {movie.movie_year ? `${movie.movie_year}` : 'Yıl: Belirtilmemiş'}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      {movie.movie_director || 'Yönetmen: Belirtilmemiş'}
                    </Typography>
                    <Typography sx={{
                      color: '#2196F3',
                      fontWeight: 'bold'
                    }}>
                      Liste Sayısı: {movie.list_count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 