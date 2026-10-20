import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Stack,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  UploadFile as UploadIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  HelpOutline as HelpIcon,
  CheckCircle as CheckIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Tune as TuneIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

const UserGuidePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const [activeTab, setActiveTab] = useState(0);

  const primaryColor = isDark ? '#38BDF8' : '#0F4C81';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0';
  const calloutBg = isDark ? 'rgba(56, 189, 248, 0.08)' : '#F0F9FF';
  const calloutBorder = isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD';

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Hero Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Chip
          icon={<SchoolIcon />}
          label="Comprehensive Platform Documentation & Tutorial"
          color="primary"
          variant="outlined"
          sx={{ mb: 2, fontWeight: 600, py: 1 }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            color: primaryColor,
            fontSize: { xs: '2rem', sm: '2.75rem' },
          }}
        >
          XCAPE User Guide & Tutorials
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 760,
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.15rem' },
            lineHeight: 1.6,
          }}
        >
          A step-by-step masterclass on automated reservoir history matching, dynamic multi-algorithm calibration (ES-MDA & EnKF), production forecasting, sensitivity screening, and collaborative team workspaces.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={() => navigate('/simulator')}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Launch Simulator
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Open Dashboard & Workspaces
          </Button>
        </Stack>
      </Box>

      {/* Quick Start Workflow Cards */}
      <Card sx={{ mb: 5, borderRadius: 3, background: cardBg, border: cardBorder, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LightbulbIcon sx={{ color: '#F59E0B' }} /> 5-Minute Quick Start Workflow
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            From raw reservoir data to calibrated production forecasts in 5 easy steps:
          </Typography>

          <Grid container spacing={2}>
            {[
              {
                num: '1',
                title: 'Data Ingestion',
                desc: 'Upload historical production CSV/JSON or input reservoir geometry and fluid properties manually in the Data Modal.',
              },
              {
                num: '2',
                title: 'Choose Algorithm',
                desc: 'Select ES-MDA for batch global matching, EnKF for sequential assimilation, or a custom equation smoother.',
              },
              {
                num: '3',
                title: 'Tune Priors & Bounds',
                desc: 'Inspect the dynamic parameter table: toggle estimated parameters (k, phi, Pi, Sw), set bounds, and adjust observation weights.',
              },
              {
                num: '4',
                title: 'Calibrate & Match',
                desc: 'Hit "Start Simulation" to execute OPM Flow forward evaluations and watch live match quality and parameter convergence.',
              },
              {
                num: '5',
                title: 'Forecast & Export',
                desc: 'Review 365-day P10/P50/P90 production curves, remaining OOIP, recovery factors, and export audit reports.',
              },
            ].map((step) => (
              <Grid item xs={12} sm={6} md={2.4} key={step.num}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: primaryColor,
                      color: 'white',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                      fontSize: '0.9rem',
                    }}
                  >
                    {step.num}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Main Guide Tabs */}
      <Card sx={{ borderRadius: 3, background: cardBg, border: cardBorder, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: { xs: 2, sm: 2.5 },
                py: 2,
                fontSize: { xs: '0.85rem', sm: '0.92rem' },
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab icon={<UploadIcon />} iconPosition="start" label="1. Data Ingestion & OOIP" />
            <Tab icon={<ScienceIcon />} iconPosition="start" label="2. History Matching Algorithms" />
            <Tab icon={<TuneIcon />} iconPosition="start" label="3. Dynamic Parameters & Priors" />
            <Tab icon={<TrendingUpIcon />} iconPosition="start" label="4. Forecasts & Recovery Factor" />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="5. Sensitivity Analysis" />
            <Tab icon={<GroupIcon />} iconPosition="start" label="6. Collaborative Workspaces" />
            <Tab icon={<HelpIcon />} iconPosition="start" label="7. FAQ & Troubleshooting" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {/* TAB 0: DATA INGESTION & OOIP */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Data Ingestion & Reservoir Characterization
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                XCAPE supports two seamless input pipelines: uploading production callsets (CSV/Excel/JSON) and manual parametric entry. Both methods directly feed the volumetric equations and forward simulation engine.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UploadIcon color="primary" /> Method A: File Upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Upload your production history dataset in CSV, Excel, or JSON format. The file parser automatically extracts:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Date / Elapsed Time (Days)" secondary="Timesteps used for observation matching." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Oil Production Rate (STB/D)" secondary="Primary history target." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Water Cut (%) & Gas-Oil Ratio (GOR)" secondary="Multi-phase fluid tracking." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Bottomhole Pressure (BHP, psi)" secondary="Pressure depletion and reservoir energy." />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TuneIcon color="primary" /> Method B: Manual Reservoir Entry
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Click <strong>"Manual Data Entry"</strong> on the simulator page to configure physical reservoir dimensions and properties without uploading files:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Geometry: Area (acres) & Net Pay Thickness (ft)" secondary="Defines total reservoir pore volume." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Rock: Porosity (%), Permeability (mD), Compressibility" secondary="Governs storage capacity and fluid transmissibility." />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Fluid: Initial Pressure Pi (psi), Sw, Bo, Viscosity" secondary="Used for PVT and material balance calculations." />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              {/* Volumetric Formula Callout */}
              <Box sx={{ p: 3, borderRadius: 2, bgcolor: calloutBg, border: `1px solid ${calloutBorder}`, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                  📐 Volumetric Original Oil in Place (OOIP) Equation
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.95rem', mb: 1.5 }}>
                  OOIP (STB) = (7758 × Area × Thickness × Porosity × (1 - Swi)) / Bo
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
                  • <strong>7758</strong>: Conversion constant from acre-feet to reservoir barrels.<br />
                  • <strong>Area (A)</strong>: Drainage area in acres.<br />
                  • <strong>Thickness (h)</strong>: Net productive pay thickness in feet.<br />
                  • <strong>Porosity (phi)</strong>: Effective interconnected pore volume fraction.<br />
                  • <strong>Swi</strong>: Initial connate water saturation fraction.<br />
                  • <strong>Bo</strong>: Oil formation volume factor (RB/STB).
                </Typography>
              </Box>
            </Box>
          )}

          {/* TAB 1: ALGORITHMS */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Multi-Algorithm History Matching Suite
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                XCAPE features multiple state-of-the-art data assimilation engines to calibrate dynamic reservoir models. Select your desired algorithm directly in the simulator dropdown.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', borderColor: 'primary.main' }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          ES-MDA (Recommended)
                        </Typography>
                        <Chip label="Default Gold Standard" size="small" color="primary" />
                      </Stack>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Ensemble Smoother with Multiple Data Assimilation (Emerick & Reynolds, 2013)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Assimilates the complete historical production timeline simultaneously over multiple iterations (Na) with inflated measurement covariance:
                      </Typography>
                      <Box sx={{ p: 1.5, bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.82rem', mb: 2 }}>
                        m^(l+1) = m^(l) + C_MD^(l) [ C_DD^(l) + α_l C_D ]^(-1) (d_uc^(l) - d^(l))
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                        ✅ <strong>Best for:</strong> Full-field calibration, multi-well history matching, preserving geological plausibility, preventing ensemble collapse without restarting model timesteps.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          EnKF
                        </Typography>
                        <Chip label="Sequential Filter" size="small" variant="outlined" />
                      </Stack>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Ensemble Kalman Filter (Evensen, 1994)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Sequential Monte Carlo data assimilation that updates parameter states sequentially across successive observation timesteps:
                      </Typography>
                      <Box sx={{ p: 1.5, bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.82rem', mb: 2 }}>
                        x_k^a = x_k^f + K_k (y_k - H x_k^f), where K_k = C_xy (C_yy + R)^(-1)
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                        ✅ <strong>Best for:</strong> Real-time well surveillance data streaming, dynamic pressure transient monitoring, and sequential state estimation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Single-Step Ensemble Smoother (ES)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Direct single-step global projection (Na = 1, α = 1). Extremely fast computation when initial priors are already close to the truth model.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                        ✅ <strong>Best for:</strong> Rapid preliminary screening, student classroom exercises, and fast parameter sanity checks.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Dynamic Custom Equation Smoothers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Configurable from the Django Admin panel without writing backend code. Administrators can register novel mathematical equations, customize inflation matrices, and deploy new algorithms instantly.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                        ✅ <strong>Best for:</strong> Research thesis experiments, novel Kalman formulations, and custom regularizations.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* TAB 2: DYNAMIC PARAMETER CONFIGURATION */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Dynamic Parameter Configuration Table
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Under Step 2 of the Simulator, XCAPE provides a dynamic parameter configuration matrix. You decide exactly which parameters to estimate, their statistical distributions, and observation weights.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                      1. Parameter Selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use the checkboxes to include or freeze parameters during assimilation. For example, freeze initial pressure (Pi) while estimating permeability (k) and porosity (phi).
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                      2. Prior Means & Bounds
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set the initial guess, standard deviation (sigma), and physical lower/upper box limits (e.g. porosity between 5% and 40%). Box constraints prevent unphysical estimates.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                      3. Observation Weighting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assign measurement error standard deviations for oil rate, water cut, and pressure. Higher weights focus the algorithm on closely matching sensitive historical periods.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Hyperparameter Guide */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Algorithm Hyperparameters Guide
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: isDark ? '#1F2937' : '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Hyperparameter</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Typical Range</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Recommended Value</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Engineering Impact</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 600 }}>Ensemble Size (Ne)</TableCell>
                      <TableCell>20 - 500 members</TableCell>
                      <TableCell><strong>100 members</strong></TableCell>
                      <TableCell>Higher size yields superior covariance statistics and less spurious correlations; 100 provides optimal balance of speed and accuracy.</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 600 }}>Assimilation Steps (Na)</TableCell>
                      <TableCell>1 - 10 iterations</TableCell>
                      <TableCell><strong>4 iterations</strong></TableCell>
                      <TableCell>Controls ES-MDA multiple data assimilation steps. 4 steps guarantee smooth parameter trajectory convergence without over-fitting.</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 600 }}>Alpha Schedule</TableCell>
                      <TableCell>Geometric / Uniform</TableCell>
                      <TableCell><strong>Geometric</strong></TableCell>
                      <TableCell>Geometric schedule (e.g. [9.33, 7.0, 4.0, 2.0]) applies larger inflation early to broadly explore parameter space, refining sharply at the end.</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 600 }}>Inflation Factor (β)</TableCell>
                      <TableCell>1.00 - 1.15</TableCell>
                      <TableCell><strong>1.05</strong></TableCell>
                      <TableCell>Multiplicative ensemble inflation preserves realistic posterior spread and guards against premature ensemble variance collapse.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 3: FORECASTS & RECOVERY */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Production Forecasting & Recovery Factor Analysis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Once calibration completes, XCAPE propagates the posterior parameter ensemble forward in time (default 365 days) through OPM Flow to generate probabilistic production forecasts.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        P10 / P50 / P90 Uncertainty
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>P90 (Conservative)</strong>: 90% probability that actual production will meet or exceed this value.<br />
                        • <strong>P50 (Median Base Case)</strong>: Most probable central production trajectory.<br />
                        • <strong>P10 (Optimistic Upside)</strong>: High-case potential for economic reserves evaluation.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        Recovery Factor (RF %)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calculates cumulative oil produced (Np) divided by initial OOIP:
                        <Box sx={{ p: 1, my: 1, bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          RF (%) = (Np / OOIP) × 100
                        </Box>
                        Displays both historical RF at end of history and total estimated ultimate recovery (EUR) after forecast.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        Remaining OOIP
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantifies remaining unproduced hydrocarbons in place:
                        <Box sx={{ p: 1, my: 1, bgcolor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          OOIP_remaining = OOIP_initial - Np_total
                        </Box>
                        Essential metric for secondary/tertiary EOR planning and infill well optimization.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* TAB 4: SENSITIVITY */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Sensitivity Analysis & Parameter Screening
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Before or after history matching, determine which reservoir parameters exert the greatest influence on cumulative production and reservoir pressure drop using the Sensitivity tab.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Sobol Global Variance Decomposition
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Computes First-Order (Si) and Total-Order (STi) Sobol indices by sampling the parameter hyperspace via quasi-random Sobol sequences.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      • <strong>First-Order Index (Si)</strong>: Direct individual variance contribution of parameter without interactions.<br />
                      • <strong>Total-Order Index (STi)</strong>: Total variance contribution including non-linear interactions with all other parameters.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Morris Elementary Effects (OAT)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      One-at-A-Time screening that measures mean effect (mu*) and interaction spread (sigma) along random grid trajectories.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      • Extremely fast execution when screening 10+ candidate parameters to isolate the top 3-4 parameters for calibration.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: calloutBg, border: `1px solid ${calloutBorder}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  🌪️ How to Read the Tornado Chart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The Tornado chart ranks reservoir parameters from top to bottom by their sensitivity magnitude. Focus your history matching assimilation efforts on the top-ranked parameters (typically Permeability, Porosity, and Drainage Area) while fixing insensitive parameters to standard geological defaults.
                </Typography>
              </Box>
            </Box>
          )}

          {/* TAB 5: COLLABORATION */}
          {activeTab === 5 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Collaborative Team Workspaces & Access Links
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                XCAPE is built for engineering teams and research labs. Every user account has a workspace, and you can invite team members to collaborate on simulations, datasets, and forecasts.
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      1. One-Time Access Links
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From your Dashboard under <strong>"Team & Workspaces"</strong>, click <strong>"Invite Team Member"</strong>, pick a role, and click <strong>"Generate Access Link"</strong>. Share the secure link with your colleague.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      2. If Colleague Already Has Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When they follow the link, they click <strong>"Accept & Join"</strong>. The workspace is linked to their account immediately. They can switch between their personal workspace and your shared workspace using the dropdown toggle.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      3. If Colleague is New to XCAPE
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      They are presented with a registration form. They can use full names with spaces (e.g. <em>Osimi Godsgift</em>) and set their password. Upon submitting, they are automatically logged in and added to the workspace.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Roles Matrix */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Team Member Roles & Permissions
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: isDark ? '#1F2937' : '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Run Simulations</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Upload Datasets</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Generate Forecasts</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Invite Members</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Manage Settings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes (Full Control)</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 700 }}>Admin</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Workspace Level</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 700 }}>Reservoir Engineer</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>✅ Yes</TableCell>
                      <TableCell>❌ No</TableCell>
                      <TableCell>❌ No</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell sx={{ fontWeight: 700 }}>Viewer / Analyst</TableCell>
                      <TableCell>❌ Read Only</TableCell>
                      <TableCell>❌ Read Only</TableCell>
                      <TableCell>✅ Inspect</TableCell>
                      <TableCell>❌ No</TableCell>
                      <TableCell>❌ No</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 6: FAQ & TROUBLESHOOTING */}
          {activeTab === 6 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: primaryColor }}>
                Frequently Asked Questions & Troubleshooting
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Solutions to common operational questions, data ingestion requirements, and calibration tuning tips:
              </Typography>

              <Stack spacing={2}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Why did my simulation return a low Match Quality score (&lt;70%)?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      A low match quality typically means:
                      <br />• <strong>Parameter bounds are too narrow:</strong> Expand the lower and upper box limits for permeability and porosity in the parameter configuration table so the ensemble can reach the true reservoir state.
                      <br />• <strong>Ensemble size is too small:</strong> Increase ensemble size from 20 or 50 up to 100 or 150 members for better covariance rank representation.
                      <br />• <strong>Observation error too strict:</strong> Verify your measurement standard errors; if measurement variance is set too small, the Kalman update can become overly stiff.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      What happens if some reservoir parameters are missing from my dataset?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      XCAPE automatically applies physical multi-level resolution:
                      <br />1. Checks explicitly uploaded JSON/CSV parameters.
                      <br />2. Checks the dynamic parameter table initial guesses configured by the engineer.
                      <br />3. If any field remains unset, XCAPE safely infers physical standard defaults (Pi = 3000 psi, phi = 20%, k = 100 mD, Sw = 25%) ensuring the simulation runs reliably without crashing or aborting.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Can I use my real full name with spaces for my username?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      <strong>Yes!</strong> XCAPE allows spaces in usernames (e.g. <em>Osimi Godsgift</em>). When registering, the platform automatically parses your first and last names and configures your personal workspace under your full name.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      How do one-time access invitation links expire?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Each generated link is protected by a cryptographically secure UUID token and is set to expire after 14 days or immediately after single-use. Once an invited engineer accepts or registers via the link, the token is permanently deactivated to maintain workspace security.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      What is the difference between ES-MDA and EnKF in practice?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      • <strong>ES-MDA</strong> processes the entire historical dataset in 4 iterative global steps without having to stop and restart the numerical simulator at every production month. It is the modern industry standard for reservoir history matching.
                      <br />• <strong>EnKF</strong> steps through time chronologically, updating pressure and saturations step-by-step. It is ideal for real-time well test interpretation and continuous surveillance streaming.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserGuidePage;
