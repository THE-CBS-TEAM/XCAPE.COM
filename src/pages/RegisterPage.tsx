import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { register, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    institution: '',
    department: '',
  });

  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    if (error) clearError();
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.username.trim()) errors.username = 'Username is required';
    else if (formData.username.trim().length < 3) errors.username = 'Username must be at least 3 characters';

    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

    if (!formData.password2) errors.password2 = 'Please confirm password';
    else if (formData.password !== formData.password2) errors.password2 = 'Passwords do not match';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          setLocalError(errorMessages);
        } catch {
          setLocalError(err.message);
        }
      } else {
        setLocalError('Registration failed. Please try again.');
      }
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
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left side - Info */}
          {!isMobile && (
            <Grid item xs={12} md={5}>
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
                  mt: 2,
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
                      <AppRegistrationIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      XCAPE
                    </Typography>
                  </Box>

                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                    Join XCAPE
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#666',
                    }}
                  >
                    Create an account to access our reservoir simulation and automated history matching platform. Track your research, manage datasets, and generate forecasts.
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
                          Educational Access
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          For students and lecturers
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
                          Secure & Reliable
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          Your data is protected and secure
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
                          Free Platform
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          No payment required
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Right side - Registration Form */}
          <Grid item xs={12} md={7}>
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
                  Create New Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#666',
                  }}
                >
                  Sign up to start using XCAPE
                </Typography>
              </Box>

              {(error || localError) && (
                <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                  {error || localError}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Name Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Your first name"
                      disabled={isLoading}
                      error={!!validationErrors.first_name}
                      helperText={validationErrors.first_name}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'First name',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Your last name"
                      disabled={isLoading}
                      error={!!validationErrors.last_name}
                      helperText={validationErrors.last_name}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Last name',
                      }}
                    />
                  </Grid>

                  {/* Contact Fields */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      disabled={isLoading}
                      error={!!validationErrors.email}
                      helperText={validationErrors.email}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'your.email@example.com',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      disabled={isLoading}
                      error={!!validationErrors.username}
                      helperText={validationErrors.username || 'Spaces allowed (e.g. Osimi Godsgift)'}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Username',
                      }}
                    />
                  </Grid>

                  {/* Institution Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="e.g., University of Lagos"
                      disabled={isLoading}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Institution',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Petroleum Engineering"
                      disabled={isLoading}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Department',
                      }}
                    />
                  </Grid>

                  {/* Password Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      disabled={isLoading}
                      error={!!validationErrors.password}
                      helperText={validationErrors.password}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Password',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="password2"
                      type="password"
                      value={formData.password2}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      disabled={isLoading}
                      error={!!validationErrors.password2}
                      helperText={validationErrors.password2}
                      variant="outlined"
                      inputProps={{
                        placeholder: 'Confirm password',
                      }}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      sx={{
                        background:
                          theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)'
                            : 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                        color: theme.palette.mode === 'dark' ? '#090D16' : 'white',
                        fontWeight: 700,
                        py: 1.5,
                        mt: 2,
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
                      {isLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </Grid>

                  {/* Login Link */}
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">
                        Already have an account?{' '}
                        <Link
                          href="/login"
                          sx={{
                            fontWeight: 600,
                            color: '#1F7A8C',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Login here
                        </Link>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage;
