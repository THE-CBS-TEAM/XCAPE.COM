import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import SimulatorIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SensitivityIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
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
  workspaces?: any[];
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  owner: number;
  owner_name: string;
  owner_email: string;
  current_user_role: string;
  members: WorkspaceMember[];
  member_count: number;
  invitations: any[];
  created_at: string;
}

interface WorkspaceMember {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  role_display: string;
  joined_at: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const { user, token, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formulasDrawerOpen, setFormulasDrawerOpen] = useState(false);

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('engineer');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [newWorkspaceModalOpen, setNewWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [workspaceActionLoading, setWorkspaceActionLoading] = useState(false);
  const [workspaceMsg, setWorkspaceMsg] = useState<{ text: string; severity: 'success' | 'error' } | null>(null);

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
    fetchWorkspaces();
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
      if (data.workspaces && data.workspaces.length > 0) {
        setWorkspaces(data.workspaces);
        if (!selectedWorkspaceId) {
          setSelectedWorkspaceId(data.workspaces[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workspaces/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0 && !selectedWorkspaceId) {
          setSelectedWorkspaceId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
    }
  };

  const activeWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId) || workspaces[0];

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

      setEditDialogOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  // Generate One-Time Invite Link
  const handleGenerateInvite = async () => {
    if (!activeWorkspace) return;
    try {
      setInviteLoading(true);
      setGeneratedInviteLink(null);
      const res = await fetch(`${API_BASE_URL}/workspaces/invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace_id: activeWorkspace.id,
          role: inviteRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate invitation link.');
      }

      // Build full frontend join URL
      const fullLink = `${window.location.origin}/join?token=${data.token}`;
      setGeneratedInviteLink(fullLink);
      fetchWorkspaces();
    } catch (err: any) {
      setWorkspaceMsg({ text: err.message || 'Failed to generate invite.', severity: 'error' });
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Create New Workspace
  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      setWorkspaceActionLoading(true);
      const res = await fetch(`${API_BASE_URL}/workspaces/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWorkspaceName.trim(),
          description: newWorkspaceDesc.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.name?.[0] || 'Failed to create workspace');
      }

      setNewWorkspaceModalOpen(false);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
      setWorkspaceMsg({ text: `Workspace "${data.name}" created successfully!`, severity: 'success' });
      await fetchWorkspaces();
      setSelectedWorkspaceId(data.id);
    } catch (err: any) {
      setWorkspaceMsg({ text: err.message || 'Failed to create workspace.', severity: 'error' });
    } finally {
      setWorkspaceActionLoading(false);
    }
  };

  // Remove member
  const handleRemoveMember = async (userId: number) => {
    if (!activeWorkspace) return;
    if (!window.confirm('Are you sure you want to remove this member from the workspace?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/${activeWorkspace.id}/remove_member/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to remove member');
      }

      setWorkspaceMsg({ text: 'Member removed from workspace.', severity: 'success' });
      fetchWorkspaces();
    } catch (err: any) {
      setWorkspaceMsg({ text: err.message || 'Failed to remove member.', severity: 'error' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return '#7C3AED';
      case 'admin':
        return '#2563EB';
      case 'engineer':
        return '#059669';
      case 'viewer':
        return '#64748B';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.mode === 'dark' ? '#0B0F19' : '#F8FAFC', py: 4 }}>
      <Container maxWidth="lg">
        {/* Welcome Banner for Newly Joined Members */}
        {searchParams.get('joined') === 'true' && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Welcome to your team workspace!</strong> You have successfully joined and can now collaborate on simulations, datasets, and forecasts.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {workspaceMsg && (
          <Alert severity={workspaceMsg.severity} onClose={() => setWorkspaceMsg(null)} sx={{ mb: 3 }}>
            {workspaceMsg.text}
          </Alert>
        )}

        {/* User Profile Card */}
        {dashboardData && (
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
              border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{
                      width: { xs: 70, sm: 88 },
                      height: { xs: 70, sm: 88 },
                      bgcolor: 'primary.main',
                      fontSize: { xs: '1.8rem', sm: '2.2rem' },
                      fontWeight: 700,
                    }}
                  >
                    {dashboardData.user.first_name?.[0] || dashboardData.user.username?.[0] || 'U'}
                  </Avatar>
                </Grid>
                <Grid item xs={12} sm>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {dashboardData.user.first_name || dashboardData.user.last_name
                      ? `${dashboardData.user.first_name} ${dashboardData.user.last_name}`.trim()
                      : dashboardData.user.username}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {dashboardData.user.email}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {dashboardData.user.institution && (
                      <Chip label={dashboardData.user.institution} size="small" variant="outlined" />
                    )}
                    {dashboardData.user.department && (
                      <Chip label={dashboardData.user.department} size="small" variant="outlined" />
                    )}
                    {activeWorkspace && (
                      <Chip
                        icon={<GroupIcon />}
                        label={`Workspace: ${activeWorkspace.name} (${activeWorkspace.current_user_role?.toUpperCase() || 'MEMBER'})`}
                        size="small"
                        color="primary"
                        variant="filled"
                      />
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditDialogOpen(true)}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SimulatorIcon />}
                      onClick={() => navigate('/simulator')}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Open Simulator
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Sign Out
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {dashboardData.user.bio && (
                <Box sx={{ mt: 2.5, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData.user.bio}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dashboard Tabs & Content */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            background: theme.palette.mode === 'dark' ? '#111827' : '#FFFFFF',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          }}
        >
          {/* Mobile-scrollable Tabs bar */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_e, value) => setTabValue(value)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.5,
                  fontSize: { xs: '0.82rem', sm: '0.875rem' },
                  textTransform: 'none',
                  fontWeight: 600,
                },
              }}
            >
              <Tab label="Recent Simulations" icon={<HistoryIcon />} iconPosition="start" />
              <Tab label="Datasets" icon={<StorageIcon />} iconPosition="start" />
              <Tab label="Forecasts" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="Sensitivity" icon={<SensitivityIcon />} iconPosition="start" />
              <Tab label="Team & Workspaces" icon={<GroupIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Tab 0: Recent Simulations */}
            {tabValue === 0 && dashboardData && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: theme.palette.mode === 'dark' ? '#0f3460' : '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Match Quality</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recent_simulations.length > 0 ? (
                      dashboardData.recent_simulations.map((sim) => (
                        <TableRow key={sim.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{sim.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={sim.matching_type?.toUpperCase()}
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
                                  : sim.status === 'running'
                                  ? 'primary'
                                  : sim.status === 'failed'
                                  ? 'error'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {sim.match_quality !== null ? (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: sim.match_quality >= 80 ? 'success.main' : 'warning.main' }}>
                                {sim.match_quality.toFixed(1)}%
                              </Typography>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{new Date(sim.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                          No simulations yet. Launch one from the Simulator tab!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Tab 1: Datasets */}
            {tabValue === 1 && dashboardData && (
              <Box sx={{ p: 3 }}>
                {dashboardData.recent_datasets.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.recent_datasets.map((ds) => (
                      <Grid item xs={12} sm={6} md={4} key={ds.id}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider',
                            background: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {ds.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Filename: {ds.filename}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded: {new Date(ds.uploaded_at).toLocaleDateString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No uploaded datasets yet.
                  </Typography>
                )}
              </Box>
            )}

            {/* Tab 2: Forecasts */}
            {tabValue === 2 && dashboardData && (
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
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                          No forecasts generated yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Tab 3: Sensitivity */}
            {tabValue === 3 && (
              <Box sx={{ p: 2 }}>
                <SensitivityPage />
              </Box>
            )}

            {/* Tab 4: Team & Workspaces */}
            {tabValue === 4 && (
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Workspace Switcher Bar */}
                <Paper
                  sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#1F2937' : '#F1F5F9',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'text.secondary' }}>
                        Active Collaborative Workspace
                      </Typography>
                      {workspaces.length > 0 ? (
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                          <Select
                            value={activeWorkspace ? activeWorkspace.id : ''}
                            onChange={(e) => setSelectedWorkspaceId(Number(e.target.value))}
                            sx={{ fontWeight: 700 }}
                          >
                            {workspaces.map((ws) => (
                              <MenuItem key={ws.id} value={ws.id}>
                                {ws.name} — {ws.member_count} member(s) ({ws.current_user_role?.toUpperCase() || 'MEMBER'})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                          No workspaces found
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm="auto">
                      <Stack direction="row" spacing={1.5}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => setNewWorkspaceModalOpen(true)}
                          sx={{ textTransform: 'none' }}
                        >
                          New Workspace
                        </Button>

                        {activeWorkspace && ['owner', 'admin'].includes(activeWorkspace.current_user_role) && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<PersonAddIcon />}
                            onClick={() => {
                              setGeneratedInviteLink(null);
                              setInviteModalOpen(true);
                            }}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Invite Team Member
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>

                  {activeWorkspace && (
                    <Box sx={{ mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Owner: <strong>{activeWorkspace.owner_name}</strong>
                      </Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography variant="body2" color="text.secondary">
                        Your Role:
                      </Typography>
                      <Chip
                        label={activeWorkspace.current_user_role?.toUpperCase() || 'MEMBER'}
                        size="small"
                        sx={{
                          bgcolor: getRoleBadgeColor(activeWorkspace.current_user_role),
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                      {activeWorkspace.description && (
                        <>
                          <Divider orientation="vertical" flexItem />
                          <Typography variant="body2" color="text.secondary">
                            {activeWorkspace.description}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Paper>

                {/* Team Members List */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Workspace Members ({activeWorkspace?.members?.length || 0})
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: theme.palette.mode === 'dark' ? '#1F2937' : '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                        {activeWorkspace && ['owner', 'admin'].includes(activeWorkspace.current_user_role) && (
                          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeWorkspace?.members && activeWorkspace.members.length > 0 ? (
                        activeWorkspace.members.map((m) => (
                          <TableRow key={m.id} hover>
                            <TableCell>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 34, height: 34, fontSize: '0.9rem', bgcolor: 'primary.dark' }}>
                                  {m.full_name?.[0] || m.username?.[0] || 'U'}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {m.full_name || m.username}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    @{m.username}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>{m.email || '-'}</TableCell>
                            <TableCell>
                              <Chip
                                label={m.role_display}
                                size="small"
                                sx={{
                                  bgcolor: getRoleBadgeColor(m.role),
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>{new Date(m.joined_at).toLocaleDateString()}</TableCell>
                            {activeWorkspace && ['owner', 'admin'].includes(activeWorkspace.current_user_role) && (
                              <TableCell sx={{ textAlign: 'right' }}>
                                {m.role !== 'owner' && m.user_id !== user?.id && (
                                  <Tooltip title="Remove from workspace">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleRemoveMember(m.user_id)}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                            No team members yet. Invite a colleague to collaborate!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Active Pending Invitations (for Admins / Owners) */}
                {activeWorkspace && ['owner', 'admin'].includes(activeWorkspace.current_user_role) && activeWorkspace.invitations && activeWorkspace.invitations.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Active One-Time Access Links ({activeWorkspace.invitations.length})
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ background: theme.palette.mode === 'dark' ? '#1F2937' : '#F8FAFC' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Invited Role</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Expires</TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Access Link</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {activeWorkspace.invitations.map((inv: any) => {
                            const link = `${window.location.origin}/join?token=${inv.token}`;
                            return (
                              <TableRow key={inv.id} hover>
                                <TableCell>
                                  <Chip
                                    label={inv.role_display}
                                    size="small"
                                    sx={{
                                      bgcolor: getRoleBadgeColor(inv.role),
                                      color: 'white',
                                      fontWeight: 600,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{inv.invited_by_name}</TableCell>
                                <TableCell>{inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : 'Never'}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                  <Button
                                    size="small"
                                    startIcon={<ContentCopyIcon fontSize="small" />}
                                    onClick={() => copyToClipboard(link)}
                                    sx={{ textTransform: 'none' }}
                                  >
                                    Copy Link
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Invite Member Modal */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Generate One-Time Access Link
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Invite an engineer or colleague to join <strong>{activeWorkspace?.name}</strong>. Share the generated one-time link with them.
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Collaborator Role</InputLabel>
            <Select
              value={inviteRole}
              label="Collaborator Role"
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <MenuItem value="engineer">
                <strong>Reservoir Engineer</strong> — Upload datasets, execute simulations, generate forecasts
              </MenuItem>
              <MenuItem value="admin">
                <strong>Admin</strong> — Full control, invite team members, manage workspace settings
              </MenuItem>
              <MenuItem value="viewer">
                <strong>Viewer / Analyst</strong> — Inspect calibrated models, view sensitivity charts & forecasts
              </MenuItem>
            </Select>
          </FormControl>

          {!generatedInviteLink ? (
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={inviteLoading}
              onClick={handleGenerateInvite}
              startIcon={inviteLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              {inviteLoading ? 'Generating Secure Link...' : 'Generate Access Link'}
            </Button>
          ) : (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F0FDF4',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? '#374151' : '#86EFAC',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                One-Time Access Link Ready!
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generatedInviteLink}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => copyToClipboard(generatedInviteLink)}
                      startIcon={copySuccess ? <CheckIcon /> : <ContentCopyIcon />}
                      sx={{ ml: 1, whiteSpace: 'nowrap' }}
                    >
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </Button>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, lineHeight: 1.5 }}>
                • <strong>If they already have an account:</strong> The workspace is added to their account and they can toggle between workspaces.<br />
                • <strong>If they are new:</strong> They will set a username (spaces allowed, e.g. <em>Osimi Godsgift</em>) and password, and automatically join this workspace.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setInviteModalOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* New Workspace Modal */}
      <Dialog
        open={newWorkspaceModalOpen}
        onClose={() => setNewWorkspaceModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Workspace</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Workspace Name"
              placeholder="e.g. Niger Delta Field Team"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description (Optional)"
              placeholder="e.g. Collaborative reservoir history matching and forecast studies"
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setNewWorkspaceModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!newWorkspaceName.trim() || workspaceActionLoading}
            onClick={handleCreateWorkspace}
            startIcon={workspaceActionLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Copy notification snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="One-time access link copied to clipboard!"
      />
    </Box>
  );
};

export default UserDashboard;
