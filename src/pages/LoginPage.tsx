import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { login, error, clearError, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.username || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.username, formData.password);
      
      // Redirect to dashboard or requested page
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #090D16 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Info */}
          {!isMobile && (
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background:
                    theme.palette.mode === 'dark'
                      ? '#111827'
                      : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border:
                    theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                  p: 4,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 2,
                      }}
                    >
                      <LoginIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      XCAPE
                    </Typography>
                  </Box>

                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                    Welcome Back
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#666',
                    }}
                  >
                    Access your reservoir simulation dashboard and continue your research with XCAPE's advanced automated matching and forecasting tools.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#0F4C81',
                          mt: 1,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Track Your Simulations
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          View history of all your baseline and EnKF simulations
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#1F7A8C',
                          mt: 1,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Manage Datasets
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Organize and access all your uploaded datasets
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: '#F4B400',
                          mt: 1,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          View Forecasts
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Access all generated predictions and results
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(22, 33, 62, 0.8)'
                    : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Login to Your Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#666',
                  }}
                >
                  Enter your credentials to access the simulator
                </Typography>
              </Box>

              {isExpired && !error && !localError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Your session has expired. Please sign in again to continue your research.
                </Alert>
              )}

              {(error || localError) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error || localError}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username or Email"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
                  sx={{ mb: 2 }}
                  variant="outlined"
                  disabled={isLoading || loading}
                  inputProps={{
                    placeholder: 'Username or email',
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  sx={{ mb: 3 }}
                  variant="outlined"
                  disabled={isLoading || loading}
                  inputProps={{
                    placeholder: 'Password',
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={isLoading || loading}
                  sx={{
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)'
                        : 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                    color: theme.palette.mode === 'dark' ? '#090D16' : 'white',
                    fontWeight: 700,
                    py: 1.5,
                    mb: 2,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 10px 25px rgba(56, 189, 248, 0.4)'
                          : '0 10px 25px rgba(15, 76, 129, 0.3)',
                    },
                  }}
                >
                  {isLoading || loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      sx={{
                        fontWeight: 600,
                        color: '#1F7A8C',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Register here
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
