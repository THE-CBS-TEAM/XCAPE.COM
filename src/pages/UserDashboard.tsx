import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import SimulatorIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SensitivityIcon from '@mui/icons-material/Assessment';
import SensitivityPage from './SensitivityPage';
import { FormulasDrawer } from '../components/FormulasDrawer';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface DashboardData {
  user: any;
  statistics: any;
  recent_simulations: any[];
  recent_forecasts: any[];
  recent_datasets: any[];
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { user, token, logout, error: authError } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formulasDrawerOpen, setFormulasDrawerOpen] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    institution: '',
    department: '',
    research_area: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (user) {
      setEditData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        institution: user.institution || '',
        department: user.department || '',
        research_area: user.research_area || '',
      });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/dashboard/summary/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/update_profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchDashboardData();
      setEditDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load dashboard data</Alert>
      </Container>
    );
  }

  const stats = dashboardData.statistics;
  const userData = dashboardData.user;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' ? '#090D16' : '#F8FAFC',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {(error || authError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || authError}
          </Alert>
        )}

        {/* Header Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid #E2E8F0',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      background: 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    {userData.first_name.charAt(0)}
                    {userData.last_name.charAt(0)}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      Welcome, {userData.first_name}!
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#bdbdbd' : '#666',
                        mb: 1,
                      }}
                    >
                      {userData.institution || 'Institution not set'} •{' '}
                      {userData.department || 'Department not set'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditDialogOpen(true)}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setFormulasDrawerOpen(true)}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#DDBB75',
                          color: '#DDBB75',
                          '&:hover': { backgroundColor: 'rgba(221,187,117,0.08)' },
                        }}
                      >
                        📘 Formulas & Metrics
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SimulatorIcon />}
                        onClick={() => navigate('/simulator')}
                        sx={{
                          background: 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                          textTransform: 'none',
                        }}
                      >
                        Go to Simulator
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ textTransform: 'none' }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
                border:
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid #E2E8F0',
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Stats
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Simulations:</Typography>
                  <Chip
                    label={stats.total_simulations}
                    size="small"
                    sx={{
                      background: theme.palette.mode === 'dark' ? '#38BDF8' : '#0F4C81',
                      color: theme.palette.mode === 'dark' ? '#090D16' : 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completed:</Typography>
                  <Chip
                    label={stats.completed_simulations}
                    size="small"
                    sx={{
                      background: '#22C55E',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Best Match Quality:</Typography>
                  <Chip
                    label={`${stats.best_match_quality.toFixed(1)}%`}
                    size="small"
                    sx={{
                      background: '#F4B400',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Avg Duration:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {Math.floor(stats.avg_simulation_duration / 60)}m {stats.avg_simulation_duration % 60}s
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Content Section */}
        <Card
          sx={{
            background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid #E2E8F0',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_e, value) => setTabValue(value)}>
              <Tab
                label="Recent Simulations"
                icon={<HistoryIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                label="Datasets"
                icon={<StorageIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                label="Forecasts"
                icon={<TrendingUpIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab
                label="Sensitivity"
                icon={<SensitivityIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Recent Simulations Tab */}
            {tabValue === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: theme.palette.mode === 'dark' ? '#0f3460' : '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Match Quality</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recent_simulations.length > 0 ? (
                      dashboardData.recent_simulations.map((sim) => (
                        <TableRow key={sim.id} hover>
                          <TableCell>{sim.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={sim.matching_type === 'baseline' ? 'Baseline' : 'EnKF'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={sim.status}
                              size="small"
                              color={
                                sim.status === 'completed'
                                  ? 'success'
                                  : sim.status === 'failed'
                                  ? 'error'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {sim.match_quality !== undefined && sim.match_quality !== null ? `${sim.match_quality.toFixed(1)}%` : '-'}
                          </TableCell>
                          <TableCell>{new Date(sim.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                          No simulations yet. Start by running a simulation!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Datasets Tab */}
            {tabValue === 1 && (
              <Box sx={{ p: 2 }}>
                {dashboardData.recent_datasets.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.recent_datasets.map((dataset) => (
                      <Grid item xs={12} sm={6} md={4} key={dataset.id}>
                        <Card
                          sx={{
                            background: theme.palette.mode === 'dark' ? '#0f3460' : '#f9f9f9',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3,
                            },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <StorageIcon sx={{ color: '#1F7A8C' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {dataset.name}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              {(dataset.file_size / 1024).toFixed(2)} KB
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                              Uploaded: {new Date(dataset.uploaded_at).toLocaleDateString()}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<FileDownloadIcon />}
                              sx={{ mt: 2, textTransform: 'none' }}
                            >
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      No datasets uploaded yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Forecasts Tab */}
            {tabValue === 2 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: theme.palette.mode === 'dark' ? '#0f3460' : '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Forecast Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Generated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recent_forecasts.length > 0 ? (
                      dashboardData.recent_forecasts.map((forecast) => (
                        <TableRow key={forecast.id} hover>
                          <TableCell>{forecast.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={forecast.forecast_type === 'prior' ? 'Prior' : 'Posterior'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{new Date(forecast.forecast_date).toLocaleDateString()}</TableCell>
                          <TableCell>{forecast.forecast_period_days} days</TableCell>
                          <TableCell>{new Date(forecast.generated_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                          No forecasts generated yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Sensitivity Tab */}
            {tabValue === 3 && (
              <Box sx={{ p: 2 }}>
                <SensitivityPage />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Formulas Drawer */}
      <FormulasDrawer open={formulasDrawerOpen} onClose={() => setFormulasDrawerOpen(false)} />

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            value={editData.first_name}
            onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={editData.last_name}
            onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label="Institution"
            value={editData.institution}
            onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label="Department"
            value={editData.department}
            onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label="Research Area"
            value={editData.research_area}
            onChange={(e) => setEditData({ ...editData, research_area: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label="Bio"
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            size="small"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProfile} variant="contained" sx={{ textTransform: 'none' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
