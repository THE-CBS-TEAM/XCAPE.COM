import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  LinearProgress,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  UploadFile as UploadIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  HelpOutline as HelpIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  Tune as TuneIcon,
  Science as ScienceIcon,
  ArrowBackIosNew as PrevIcon,
  ArrowForwardIos as NextIcon,
  AutoGraph as AutoGraphIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  MenuBook as MenuBookIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

interface WorkflowSlide {
  id: number;
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  targetTab: number;
  accentColor: string;
}

const WORKFLOW_SLIDES: WorkflowSlide[] = [
  {
    id: 0,
    step: '01',
    badge: 'STAGE 1 • DATA INGESTION & VOLUMETRICS',
    title: 'Multi-Source Reservoir Characterization',
    subtitle: 'Automated CSV/JSON Production Parsing & Volumetric OOIP Synthesis',
    description:
      'Ingest historical multi-phase production callsets (Oil Rate, Water Cut, GOR, BHP) or define reservoir rock-fluid geometry manually. XCAPE automatically validates physical bounds and computes initial Volumetric Original Oil in Place (OOIP).',
    metrics: [
      { label: 'Input Formats', value: 'CSV / XLSX / JSON' },
      { label: 'Auto-Resolution', value: '3-Tier Fallback' },
      { label: 'Volumetric Engine', value: 'API 7758 Standard' },
    ],
    targetTab: 0,
    accentColor: '#38BDF8',
  },
  {
    id: 1,
    step: '02',
    badge: 'STAGE 2 • ASSIMILATION ARCHITECTURE',
    title: 'Multi-Algorithm Calibration Suite',
    subtitle: 'ES-MDA, Sequential EnKF, Single-Step ES & Custom Equation Smoothers',
    description:
      'Select the optimal Bayesian data assimilation engine for your reservoir regime. Use ES-MDA with geometric covariance inflation to prevent ensemble collapse, or EnKF for sequential real-time pressure and rate surveillance.',
    metrics: [
      { label: 'Gold Standard', value: 'ES-MDA (Na = 4)' },
      { label: 'Sequential Filter', value: 'Kalman (EnKF)' },
      { label: 'Extensibility', value: 'Custom Equations' },
    ],
    targetTab: 1,
    accentColor: '#818CF8',
  },
  {
    id: 2,
    step: '03',
    badge: 'STAGE 3 • PRIOR UNCERTAINTY & BOUNDS',
    title: 'Dynamic Parameter Matrix & Box Constraints',
    subtitle: 'Granular Control Over Priors, Covariance Weights & Physical Limits',
    description:
      'Toggle active calibration parameters (Permeability k, Porosity φ, Initial Pressure Pi, Swi), enforce strict geological box constraints, and tune measurement error standard deviations to weight critical historical periods.',
    metrics: [
      { label: 'Ensemble Size', value: '100 Realizations' },
      { label: 'Sensitivity', value: 'Sobol & Morris OAT' },
      { label: 'Constraint Type', value: 'Truncated Gaussian' },
    ],
    targetTab: 2,
    accentColor: '#F59E0B',
  },
  {
    id: 3,
    step: '04',
    badge: 'STAGE 4 • FORWARD SIMULATION & CONVERGENCE',
    title: 'OPM Flow Evaluation & Live History Matching',
    subtitle: 'Iterative Ensemble Conditioning & Misfit Minimization',
    description:
      'Execute parallel forward reservoir evaluations via OPM Flow. Watch the wide prior uncertainty fan progressively condition to historical field observations while tracking real-time RMS misfit reduction and parameter convergence.',
    metrics: [
      { label: 'Forward Solver', value: 'OPM Flow Engine' },
      { label: 'Typical Match', value: '> 94% Accuracy' },
      { label: 'Inflation Factor', value: 'β = 1.05 Adaptive' },
    ],
    targetTab: 1,
    accentColor: '#10B981',
  },
  {
    id: 4,
    step: '05',
    badge: 'STAGE 5 • PROBABILISTIC FORECASTING & EUR',
    title: '365-Day P10/P50/P90 Forecast & Recovery Analytics',
    subtitle: 'Quantified Reserves Uncertainty, Remaining OOIP & Team Collaboration',
    description:
      'Propagate calibrated posterior ensembles forward 365 days to generate P10/P50/P90 probabilistic production envelopes, compute Recovery Factor (RF %) and Remaining OOIP, and share results across collaborative team workspaces.',
    metrics: [
      { label: 'Forecast Horizon', value: '365 Days Default' },
      { label: 'Confidence Bands', value: 'P10 / P50 / P90' },
      { label: 'Deliverables', value: 'EUR & Audit Export' },
    ],
    targetTab: 3,
    accentColor: '#EC4899',
  },
];

const UserGuidePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const tabsRef = useRef<HTMLDivElement>(null);

  const primaryColor = isDark ? '#38BDF8' : '#0F4C81';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0';
  const calloutBg = isDark ? 'rgba(56, 189, 248, 0.08)' : '#F0F9FF';
  const calloutBorder = isDark ? 'rgba(56, 189, 248, 0.25)' : '#BAE6FD';

  // Auto-advance slider timer with smooth progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 65; // ticks every 65ms -> 100 ticks = 6.5 seconds per slide
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((current) => (current + 1) % WORKFLOW_SLIDES.length);
          return 0;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeSlide]);

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % WORKFLOW_SLIDES.length);
    setProgress(0);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + WORKFLOW_SLIDES.length) % WORKFLOW_SLIDES.length);
    setProgress(0);
  };

  const handleJumpToTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSlide = WORKFLOW_SLIDES[activeSlide];

  // Renders the bespoke interactive engineering visual for each slide
  const renderSlideVisual = (slideIndex: number) => {
    switch (slideIndex) {
      case 0:
        return (
          <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Top Telemetry Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <StorageIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: '#94A3B8' }}>
                  INGESTION_PIPELINE // VOLUMETRIC_PARSER
                </Typography>
              </Stack>
              <Chip
                label="SCHEMA VALIDATED"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Stack>

            {/* Dual Input Channels */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    📄 prod_history_well04.csv
                  </Typography>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Timesteps:</Typography>
                      <Typography variant="caption" sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 700 }}>365 Days</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Oil Rate (q_o):</Typography>
                      <Typography variant="caption" sx={{ color: '#34D399', fontFamily: 'monospace', fontWeight: 700 }}>4,250 STB/D</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Water Cut / BHP:</Typography>
                      <Typography variant="caption" sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 700 }}>18.4% | 2,890 psi</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    🎛️ Rock & Fluid Geometry
                  </Typography>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Drainage Area (A):</Typography>
                      <Typography variant="caption" sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 700 }}>640 Acres</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Net Pay (h) / φ:</Typography>
                      <Typography variant="caption" sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 700 }}>85 ft | 22.5%</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Swi / FVF (Bo):</Typography>
                      <Typography variant="caption" sx={{ color: '#F8FAFC', fontFamily: 'monospace', fontWeight: 700 }}>0.24 | 1.28 RB/STB</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* Live Volumetric Output Card */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(56,189,248,0.16) 0%, rgba(15,23,42,0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, display: 'block' }}>
                    COMPUTED VOLUMETRIC OOIP
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    N = [7758 × A × h × φ × (1 - Swi)] / Bo
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 900, fontFamily: 'monospace' }}>
                    56.42 <span style={{ fontSize: '0.85rem', color: '#38BDF8' }}>MMSTB</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 600 }}>
                    ● Ready for Assimilation
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ScienceIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: '#94A3B8' }}>
                  ASSIMILATION_CORE // MATRIX_SOLVER
                </Typography>
              </Stack>
              <Chip
                label="BAYESIAN UPDATE"
                size="small"
                sx={{
                  bgcolor: 'rgba(129, 140, 248, 0.15)',
                  color: '#A5B4FC',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Stack>

            {/* Mathematical Formula Box */}
            <Box
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(129, 140, 248, 0.35)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#A5B4FC', display: 'block', mb: 0.5, fontWeight: 600 }}>
                ES-MDA Covariance Update Equation (Emerick & Reynolds)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  letterSpacing: 0.5,
                }}
              >
                m_j^(l+1) = m_j^(l) + C_MD^(l) [ C_DD^(l) + α_l C_D ]⁻¹ (d_uc,j^(l) - d_j^(l))
              </Typography>
            </Box>

            {/* Algorithm Cards */}
            <Stack spacing={1.2}>
              {[
                {
                  name: 'ES-MDA (Multiple Data Assimilation)',
                  tag: 'ACTIVE DEFAULT',
                  desc: 'Geometric α = [9.33, 7.0, 4.0, 2.0] • Prevents ensemble collapse',
                  color: '#38BDF8',
                  active: true,
                },
                {
                  name: 'EnKF (Ensemble Kalman Filter)',
                  tag: 'SEQUENTIAL',
                  desc: 'Step-by-step state & pressure surveillance update',
                  color: '#818CF8',
                  active: false,
                },
                {
                  name: 'Custom Equation Smoother',
                  tag: 'ADMIN EXTENSIBLE',
                  desc: 'Zero-code mathematical kernel registration via Admin Panel',
                  color: '#F59E0B',
                  active: false,
                },
              ].map((alg) => (
                <Box
                  key={alg.name}
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: alg.active ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: alg.active ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 700, display: 'block' }}>
                      {alg.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                      {alg.desc}
                    </Typography>
                  </Box>
                  <Chip
                    label={alg.tag}
                    size="small"
                    sx={{
                      bgcolor: alg.active ? '#38BDF8' : 'rgba(255,255,255,0.08)',
                      color: alg.active ? '#0F172A' : '#CBD5E1',
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      height: 20,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TuneIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: '#94A3B8' }}>
                  PARAMETER_MATRIX // PRIOR_BOUNDS
                </Typography>
              </Stack>
              <Chip
                label="SOBOL SCREENED"
                size="small"
                sx={{
                  bgcolor: 'rgba(245, 158, 11, 0.15)',
                  color: '#FBBF24',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Stack>

            {/* Simulated Parameter Configuration Matrix */}
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1.3fr 1fr',
                  px: 1.5,
                  py: 1,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>Parameter</Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>Prior Mean</Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>Box Bounds</Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, textAlign: 'right' }}>Status</Typography>
              </Box>
              {[
                { param: 'Permeability (k)', mean: '120 mD', bounds: '[10 – 800 mD]', active: true, impact: 'High (S1: 0.48)' },
                { param: 'Porosity (φ)', mean: '22.0 %', bounds: '[8.0 – 35.0 %]', active: true, impact: 'High (S1: 0.31)' },
                { param: 'Initial Pressure (Pi)', mean: '3,200 psi', bounds: '[2,800 – 3,600]', active: true, impact: 'Med (S1: 0.15)' },
                { param: 'Connate Water (Swi)', mean: '25.0 %', bounds: '[10.0 – 45.0 %]', active: false, impact: 'Frozen' },
              ].map((row, idx) => (
                <Box
                  key={row.param}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1.3fr 1fr',
                    px: 1.5,
                    py: 1,
                    alignItems: 'center',
                    borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                    {row.active ? '☑️' : '⬜'} {row.param}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontFamily: 'monospace', fontWeight: 700 }}>
                    {row.mean}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#CBD5E1', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {row.bounds}
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={row.active ? 'ESTIMATE' : 'LOCKED'}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        bgcolor: row.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                        color: row.active ? '#34D399' : '#94A3B8',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Observation Weighting: <strong>σ_oil = 3.5%</strong> | <strong>σ_BHP = 15 psi</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#FBBF24', fontWeight: 700 }}>
                Zero Unphysical Realizations
              </Typography>
            </Stack>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SpeedIcon sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: '#94A3B8' }}>
                  OPM_FLOW_SOLVER // ENSEMBLE_CONDITIONING
                </Typography>
              </Stack>
              <Chip
                label="MATCH QUALITY: 96.4%"
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Stack>

            {/* Custom SVG History Matching Convergence Plot */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                position: 'relative',
              }}
            >
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 700, fontSize: '0.7rem' }}>
                  Oil Rate History Match (STB/D vs. Days)
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.65rem' }}>
                    ▬ Prior Spread
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.65rem', fontWeight: 700 }}>
                    ▬ Calibrated Posterior
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontSize: '0.65rem', fontWeight: 700 }}>
                    ● Observed Data
                  </Typography>
                </Stack>
              </Stack>

              <svg viewBox="0 0 420 135" width="100%" height="130" style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                <line x1="30" y1="20" x2="405" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                <line x1="30" y1="65" x2="405" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
                <line x1="30" y1="110" x2="405" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

                {/* Uncalibrated Prior Wide Shaded Polygon */}
                <polygon
                  points="30,10 120,20 220,40 320,60 405,75 405,125 320,115 220,98 120,75 30,55"
                  fill="rgba(148, 163, 184, 0.14)"
                />

                {/* Calibrated Posterior Narrow Fan */}
                <polygon
                  points="30,26 120,38 220,58 320,78 405,92 405,104 320,90 220,70 120,50 30,38"
                  fill="rgba(16, 185, 129, 0.28)"
                />

                {/* Posterior Mean Trajectory */}
                <path
                  d="M 30 32 Q 120 44, 220 64 T 405 98"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.8"
                />

                {/* Historical Observation Points */}
                {[
                  { cx: 35, cy: 33 },
                  { cx: 85, cy: 39 },
                  { cx: 140, cy: 49 },
                  { cx: 195, cy: 59 },
                  { cx: 250, cy: 70 },
                  { cx: 305, cy: 81 },
                  { cx: 355, cy: 90 },
                  { cx: 400, cy: 97 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="3.8"
                    fill="#F59E0B"
                    stroke="#0F172A"
                    strokeWidth="1.2"
                  />
                ))}
              </svg>
            </Box>

            {/* Convergence Metrics Footer */}
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    RMS Misfit Drop
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 800, fontFamily: 'monospace' }}>
                    14.2 → 0.84 (-94%)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    Posterior k_mean
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 800, fontFamily: 'monospace' }}>
                    148.6 ± 6.2 mD
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    Iteration Step
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#F8FAFC', fontWeight: 800, fontFamily: 'monospace' }}>
                    4 / 4 Completed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
      default:
        return (
          <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimelineIcon sx={{ color: '#EC4899', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, color: '#94A3B8' }}>
                  FORECAST_ENGINE // 365_DAY_PROJECTION
                </Typography>
              </Stack>
              <Chip
                label="P10 / P50 / P90 READY"
                size="small"
                sx={{
                  bgcolor: 'rgba(236, 72, 153, 0.2)',
                  color: '#F472B6',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Stack>

            {/* SVG Probabilistic Forecast Chart */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 700, fontSize: '0.7rem' }}>
                  Historical Match + 365-Day Probabilistic Forecast
                </Typography>
                <Stack direction="row" spacing={1.2}>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontSize: '0.65rem', fontWeight: 700 }}>
                    -- P10 Upside
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#F472B6', fontSize: '0.65rem', fontWeight: 700 }}>
                    ▬ P50 Median
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#A855F7', fontSize: '0.65rem', fontWeight: 700 }}>
                    -- P90 Base
                  </Typography>
                </Stack>
              </Stack>

              <svg viewBox="0 0 420 130" width="100%" height="125" style={{ overflow: 'visible' }}>
                {/* History / Forecast Vertical Divider Line */}
                <line x1="220" y1="10" x2="220" y2="118" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,4" />
                <text x="145" y="20" fill="#94A3B8" fontSize="9" fontWeight="bold">HISTORY</text>
                <text x="230" y="20" fill="#F472B6" fontSize="9" fontWeight="bold">365-DAY FORECAST →</text>

                {/* Forecast P10-P90 Fan Envelope */}
                <polygon
                  points="220,64 280,68 340,73 405,78 405,114 340,105 280,92 220,64"
                  fill="rgba(236, 72, 153, 0.22)"
                />

                {/* Historical Matched Curve */}
                <path d="M 25 28 Q 120 45, 220 64" fill="none" stroke="#10B981" strokeWidth="2.5" />

                {/* P10 Optimistic Curve */}
                <path d="M 220 64 Q 310 70, 405 78" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="4,3" />

                {/* P50 Median Curve */}
                <path d="M 220 64 Q 310 80, 405 96" fill="none" stroke="#EC4899" strokeWidth="2.6" />

                {/* P90 Conservative Curve */}
                <path d="M 220 64 Q 310 92, 405 114" fill="none" stroke="#A855F7" strokeWidth="1.8" strokeDasharray="4,3" />
              </svg>
            </Box>

            {/* Forecast Executive Summary KPIs */}
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    Recovery Factor (RF)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 800, fontFamily: 'monospace' }}>
                    34.8% (P50 EUR)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    Remaining OOIP
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 800, fontFamily: 'monospace' }}>
                    36.78 MMSTB
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.65rem' }}>
                    Team Workspace
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#F472B6', fontWeight: 800 }}>
                    Synced & Exportable
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* =====================================================================
          HERO SECTION WITH INTERACTIVE ARCHITECTURAL WORKFLOW SLIDER
      ===================================================================== */}
      <Box sx={{ mb: 6 }}>
        {/* Top Hero Title & Call-to-Actions */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            icon={<SchoolIcon />}
            label="Comprehensive Platform Documentation & Interactive Architecture"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontWeight: 700, py: 1, px: 1, borderRadius: 5 }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              color: primaryColor,
              fontSize: { xs: '2rem', sm: '2.85rem' },
              letterSpacing: '-0.02em',
            }}
          >
            XCAPE User Guide & Tutorials
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 780,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.12rem' },
              lineHeight: 1.65,
            }}
          >
            A step-by-step masterclass on automated reservoir history matching, dynamic multi-algorithm calibration (ES-MDA & EnKF), 365-day probabilistic production forecasting, sensitivity screening, and collaborative team workspaces.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              onClick={() => navigate('/simulator')}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 3.5,
                boxShadow: '0 8px 20px rgba(56, 189, 248, 0.25)',
              }}
            >
              Launch Simulator
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GroupIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 2, px: 3 }}
            >
              Open Dashboard & Workspaces
            </Button>
          </Stack>
        </Box>

        {/* =================================================================
            HERO INTERACTIVE WORKFLOW SHOWCASE SLIDER
        ================================================================= */}
        <Card
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: isDark
              ? 'linear-gradient(145deg, #0B0F19 0%, #111827 55%, #0F172A 100%)'
              : 'linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
            color: '#F8FAFC',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: isDark
              ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.08)'
              : '0 20px 45px rgba(15, 23, 42, 0.22)',
            position: 'relative',
          }}
        >
          {/* Top Pipeline Stepper Navigation Bar */}
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: 2,
              bgcolor: 'rgba(2, 6, 23, 0.55)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoGraphIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.8, color: '#E2E8F0' }}>
                  HOW XCAPE WORKS: END-TO-END ARCHITECTURAL FLOW
                </Typography>
              </Stack>

              {/* Stepper Pills */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  width: { xs: '100%', md: 'auto' },
                  overflowX: 'auto',
                  pb: { xs: 0.5, md: 0 },
                }}
              >
                {WORKFLOW_SLIDES.map((s, idx) => {
                  const isSelected = idx === activeSlide;
                  return (
                    <Button
                      key={s.id}
                      size="small"
                      onClick={() => handleSelectSlide(idx)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.6,
                        minWidth: 'fit-content',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.78rem',
                        color: isSelected ? '#0F172A' : '#94A3B8',
                        bgcolor: isSelected ? s.accentColor : 'rgba(255,255,255,0.04)',
                        border: '1px solid',
                        borderColor: isSelected ? s.accentColor : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          bgcolor: isSelected ? s.accentColor : 'rgba(255,255,255,0.1)',
                          color: isSelected ? '#0F172A' : '#F8FAFC',
                        },
                      }}
                    >
                      {s.step}. {s.title.split(' ')[0]}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          {/* Auto-Play Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 3,
              bgcolor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': {
                bgcolor: currentSlide.accentColor,
                transition: 'width 0.06s linear',
              },
            }}
          />

          {/* Main Slide Body */}
          <CardContent sx={{ p: { xs: 2.5, sm: 4, md: 4.5 } }}>
            <Fade in={true} key={activeSlide} timeout={450}>
              <Grid container spacing={4} alignItems="stretch">
                {/* LEFT COLUMN: Narrative, Engineering Specs & Actions */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Chip
                        label={currentSlide.badge}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(56, 189, 248, 0.14)',
                          color: currentSlide.accentColor,
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          letterSpacing: 0.6,
                          border: `1px solid ${currentSlide.accentColor}44`,
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        color: '#FFFFFF',
                        mb: 1,
                        fontSize: { xs: '1.5rem', sm: '1.85rem' },
                        lineHeight: 1.25,
                      }}
                    >
                      {currentSlide.title}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: currentSlide.accentColor,
                        fontWeight: 700,
                        mb: 2,
                        fontSize: '0.95rem',
                      }}
                    >
                      {currentSlide.subtitle}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#CBD5E1',
                        lineHeight: 1.7,
                        mb: 3,
                        fontSize: '0.94rem',
                      }}
                    >
                      {currentSlide.description}
                    </Typography>
                  </Box>

                  <Box>
                    {/* Key Technical Specs Row */}
                    <Grid container spacing={1.5} sx={{ mb: 3 }}>
                      {currentSlide.metrics.map((m) => (
                        <Grid item xs={4} key={m.label}>
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: 2,
                              bgcolor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.68rem' }}>
                              {m.label}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: '#F8FAFC',
                                fontWeight: 800,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                              }}
                            >
                              {m.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Slide Controls & Deep Dive Button */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                       sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="Previous Stage">
                          <IconButton
                            size="small"
                            onClick={handlePrevSlide}
                            sx={{
                              color: '#E2E8F0',
                              bgcolor: 'rgba(255,255,255,0.06)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                            }}
                          >
                            <PrevIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={isPlaying ? 'Pause Auto-Tour' : 'Play Auto-Tour'}>
                          <IconButton
                            size="small"
                            onClick={() => setIsPlaying(!isPlaying)}
                            sx={{
                              color: currentSlide.accentColor,
                              bgcolor: 'rgba(255,255,255,0.06)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                            }}
                          >
                            {isPlaying ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Next Stage">
                          <IconButton
                            size="small"
                            onClick={handleNextSlide}
                            sx={{
                              color: '#E2E8F0',
                              bgcolor: 'rgba(255,255,255,0.06)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                            }}
                          >
                            <NextIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Typography variant="caption" sx={{ color: '#94A3B8', pl: 1, fontWeight: 600 }}>
                          Stage {activeSlide + 1} of {WORKFLOW_SLIDES.length}
                        </Typography>
                      </Stack>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MenuBookIcon />}
                        onClick={() => handleJumpToTab(currentSlide.targetTab)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: currentSlide.accentColor,
                          color: currentSlide.accentColor,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: `${currentSlide.accentColor}15`,
                            borderColor: currentSlide.accentColor,
                          },
                        }}
                      >
                        Deep Dive in Guide ↓
                      </Button>
                    </Stack>
                  </Box>
                </Grid>

                {/* RIGHT COLUMN: Live Interactive Engineering Telemetry Window */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      minHeight: 295,
                      borderRadius: 3,
                      bgcolor: 'rgba(2, 6, 23, 0.65)',
                      border: `1px solid ${currentSlide.accentColor}44`,
                      boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.35)`,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Mac-Style Engineering Window Top Bar */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: 'rgba(15, 23, 42, 0.9)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
                        <Typography variant="caption" sx={{ color: '#64748B', fontFamily: 'monospace', ml: 1 }}>
                          xcape-simulator://workflow/stage-0{activeSlide + 1}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <VerifiedIcon sx={{ color: currentSlide.accentColor, fontSize: 14 }} />
                        <Typography variant="caption" sx={{ color: currentSlide.accentColor, fontWeight: 700, fontSize: '0.68rem' }}>
                          LIVE TELEMETRY
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Dynamic Visual Viewport */}
                    <Box sx={{ flexGrow: 1 }}>{renderSlideVisual(activeSlide)}</Box>
                  </Paper>
                </Grid>
              </Grid>
            </Fade>
          </CardContent>
        </Card>
      </Box>

      {/* =====================================================================
          MAIN DOCUMENTATION TABS
      ===================================================================== */}
      <div ref={tabsRef} />
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
                      <Typography variant="body2" color="text.secondary" component="div">
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
                      <Typography variant="body2" color="text.secondary" component="div">
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