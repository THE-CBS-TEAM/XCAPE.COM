import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Stack,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '@context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface InvitationInfo {
  valid: boolean;
  token: string;
  workspace_id: number;
  workspace_name: string;
  workspace_description?: string;
  owner_name: string;
  invited_by: string;
  role: string;
  role_display: string;
  expires_at: string;
}

const JoinWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, token: authToken, isAuthenticated, setAuthSession } = useAuth();

  const [loading, setLoading] = useState(true);
  const [inviteInfo, setInviteInfo] = useState<InvitationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [authTab, setAuthTab] = useState(0); // 0 = register, 1 = login
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regForm, setRegForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    institution: '',
    department: '',
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (!tokenParam) {
      setError('No invitation token was provided in the link. Please verify the URL with the person who invited you.');
      setLoading(false);
      return;
    }

    const checkToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/workspaces/invitation/${tokenParam}/`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || 'This invitation link is invalid or has expired.');
        } else {
          setInviteInfo(data);
        }
      } catch (err) {
        setError('Failed to contact server to verify invitation link.');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [tokenParam]);

  // Handle logged-in user accepting invite
  const handleAcceptInvite = async () => {
    if (!tokenParam) return;
    try {
      setActionLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/workspaces/accept_invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenParam }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to accept invitation.');
      }

      if (data.workspace_id) {
        localStorage.setItem('xcape_active_workspace_id', String(data.workspace_id));
        navigate(`/dashboard?joined=true&workspace_id=${data.workspace_id}`);
      } else {
        navigate('/dashboard?joined=true');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while accepting the invitation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle new user registering and immediately joining
  const handleRegisterAndJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.username.trim()) {
      setError('Please provide a username or full name.');
      return;
    }
    if (!regForm.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (regForm.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (regForm.password !== regForm.password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/workspaces/register_and_join/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenParam,
          username: regForm.username.trim(),
          email: regForm.email.trim(),
          password: regForm.password,
          password2: regForm.password2,
          institution: regForm.institution,
          department: regForm.department,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.username?.[0] || data.email?.[0] || data.password?.[0] || data.error || JSON.stringify(data);
        throw new Error(errorMsg);
      }

      // Automatically store session in AuthContext
      setAuthSession(data.user, data.token);
      if (data.workspace_id) {
        localStorage.setItem('xcape_active_workspace_id', String(data.workspace_id));
        navigate(`/dashboard?joined=true&workspace_id=${data.workspace_id}`);
      } else {
        navigate('/dashboard?joined=true');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle existing user signing in and joining
  const handleLoginAndJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password) {
      setError('Please enter your username/email and password.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      // 1. Log in
      const loginRes = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.error || loginData.detail || 'Invalid username or password.');
      }

      setAuthSession(loginData.user, loginData.token);

      // 2. Accept invite with new token
      const acceptRes = await fetch(`${API_BASE_URL}/workspaces/accept_invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${loginData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenParam }),
      });

      const acceptData = await acceptRes.json();
      if (!acceptRes.ok) {
        throw new Error(acceptData.error || 'Failed to join workspace after login.');
      }

      if (acceptData.workspace_id) {
        localStorage.setItem('xcape_active_workspace_id', String(acceptData.workspace_id));
        navigate(`/dashboard?joined=true&workspace_id=${acceptData.workspace_id}`);
      } else {
        navigate('/dashboard?joined=true');
      }
    } catch (err: any) {
      setError(err.message || 'Sign in and join failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#2563EB';
      case 'engineer':
        return '#059669';
      case 'viewer':
        return '#64748B';
      default:
        return '#7C3AED';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
          background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <GroupIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Team Workspace Invitation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Collaborate seamlessly on reservoir history matching, model calibration, and production forecasts.
            </Typography>
          </Box>

          {/* Loading state */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Verifying your workspace access link...
              </Typography>
            </Box>
          )}

          {/* Error Banner */}
          {error && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Invitation Details Banner */}
          {inviteInfo && (
            <Box
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F0F9FF',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? '#374151' : '#BAE6FD',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                You have been invited to join
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', my: 0.5 }}>
                {inviteInfo.workspace_name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Invited by: <strong>{inviteInfo.invited_by}</strong>
                </Typography>
                <Chip
                  label={`Role: ${inviteInfo.role_display}`}
                  size="small"
                  sx={{
                    bgcolor: getRoleColor(inviteInfo.role),
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>
          )}

          {/* Action Area: Scenario A - Already Authenticated */}
          {!loading && inviteInfo && isAuthenticated && user && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                You are currently signed in as <strong>{user.username}</strong> ({user.email}). Joining this workspace will add it to your workspaces list so you can toggle between them in your dashboard.
              </Alert>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAcceptInvite}
                disabled={actionLoading}
                startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {actionLoading ? 'Joining Workspace...' : `Accept & Join ${inviteInfo.workspace_name}`}
              </Button>
            </Box>
          )}

          {/* Action Area: Scenario B - Not Authenticated */}
          {!loading && inviteInfo && (!isAuthenticated || !user) && (
            <Box>
              <Tabs
                value={authTab}
                onChange={(_e, v) => setAuthTab(v)}
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Create Account & Join" icon={<PersonAddIcon />} iconPosition="start" />
                <Tab label="I Have An Account" icon={<LoginIcon />} iconPosition="start" />
              </Tabs>

              {/* Tab 0: Register Form */}
              {authTab === 0 && (
                <Box component="form" onSubmit={handleRegisterAndJoin}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Full Name or Username"
                      placeholder="e.g. Osimi Godsgift"
                      value={regForm.username}
                      onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                      helperText="Spaces allowed (e.g. Osimi Godsgift)"
                      required
                    />

                    <TextField
                      fullWidth
                      type="email"
                      label="Email Address"
                      placeholder="name@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Institution / Company (Optional)"
                      placeholder="e.g. University of Lagos / Chevron"
                      value={regForm.institution}
                      onChange={(e) => setRegForm({ ...regForm, institution: e.target.value })}
                    />

                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      helperText="Minimum 8 characters"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      value={regForm.password2}
                      onChange={(e) => setRegForm({ ...regForm, password2: e.target.value })}
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={actionLoading}
                      startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                      sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
                    >
                      {actionLoading ? 'Creating Account & Joining...' : 'Register & Join Workspace'}
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Tab 1: Login Form */}
              {authTab === 1 && (
                <Box component="form" onSubmit={handleLoginAndJoin}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Username or Email"
                      placeholder="Enter username or email"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />

                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={actionLoading}
                      startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                      sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
                    >
                      {actionLoading ? 'Signing In & Joining...' : 'Sign In & Join Workspace'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          {/* Fallback button if error */}
          {error && !inviteInfo && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Return to Home
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default JoinWorkspacePage;
