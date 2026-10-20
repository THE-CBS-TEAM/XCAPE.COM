import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  useTheme,
  Stack,
} from '@mui/material'
import {
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Language as GlobeIcon,
  MenuBook as BookIcon,
  CheckCircle as CheckIcon,
  AutoGraph as GraphIcon,
  Tune as TuneIcon,
  Science as ScienceIcon,
  Terminal as TerminalIcon,
  LocationOn as LocationIcon,
  Storage as StorageIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export const DeveloperProfilePage: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isDark = theme.palette.mode === 'dark'

  const GOLD = '#F4B400'
  const TEAL = '#1F7A8C'
  const PRIMARY = isDark ? '#38BDF8' : '#0F4C81'
  const CARD_BG = isDark ? '#0C1322' : '#FFFFFF'
  const BORDER_COLOR = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Top Header Card */}
        <Card
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER_COLOR}`,
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,0.6)'
              : '0 10px 30px rgba(15,76,129,0.08)',
            mb: 5,
            position: 'relative',
          }}
        >
          {/* Top Banner Gradient */}
          <Box
            sx={{
              height: { xs: 140, md: 200 },
              background: isDark
                ? 'linear-gradient(135deg, #06101E 0%, #0F3057 50%, #1F7A8C 100%)'
                : 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 60%, #F4B400 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle at 80% 20%, rgba(244,180,0,0.25) 0%, transparent 60%)',
              },
            }}
          />

          <CardContent sx={{ px: { xs: 3, md: 6 }, pb: 5, pt: 0, position: 'relative' }}>
            <Grid container spacing={4} alignItems="flex-end">
              {/* Profile Image with Golden Ring */}
              <Grid item xs={12} sm={4} md={3.5} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Box
                  sx={{
                    mt: { xs: -10, md: -14 },
                    width: { xs: 180, md: 220 },
                    height: { xs: 220, md: 270 },
                    borderRadius: 3.5,
                    overflow: 'hidden',
                    border: `4px solid ${isDark ? '#0C1322' : '#FFFFFF'}`,
                    boxShadow: `0 12px 30px rgba(0,0,0,0.35), 0 0 0 2px ${GOLD}`,
                    backgroundColor: '#1E293B',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src="/osimi_profile.jpg"
                    alt="Osimi Godsgift Gbubemi"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                  />
                </Box>
              </Grid>

              {/* Name, Roles, and Quick Contacts */}
              <Grid item xs={12} sm={8} md={8.5}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label="XCAPE Creator & Lead Developer"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(244,180,0,0.15)',
                        color: GOLD,
                        fontWeight: 700,
                        border: `1px solid rgba(244,180,0,0.35)`,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label="Petroleum Engineer"
                      size="small"
                      sx={{
                        backgroundColor: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(15,76,129,0.1)',
                        color: PRIMARY,
                        fontWeight: 700,
                        border: `1px solid ${isDark ? 'rgba(56,189,248,0.3)' : 'rgba(15,76,129,0.25)'}`,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      fontSize: { xs: '1.85rem', md: '2.5rem' },
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    Osimi Godsgift Gbubemi
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: isDark ? '#94A3B8' : '#475569',
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                      fontWeight: 500,
                      lineHeight: 1.5,
                      mb: 2.5,
                    }}
                  >
                    Computational Reservoir Engineering Specialist · Automated History Matching (EnKF) & Nodal Analysis Researcher
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2.5}
                    sx={{
                      color: isDark ? '#CBD5E1' : '#64748B',
                      fontSize: '0.85rem',
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <SchoolIcon sx={{ fontSize: 18, color: GOLD }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        FUTO · Petroleum Engineering
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <LocationIcon sx={{ fontSize: 18, color: TEAL }} />
                      <Typography variant="body2">Imo State, Nigeria</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: '#10B981' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        <a href="tel:07049946769" style={{ color: 'inherit', textDecoration: 'none' }}>
                          07049946769
                        </a>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <EmailIcon sx={{ fontSize: 18, color: PRIMARY }} />
                      <Typography variant="body2">osimigbubemigodsgift@gmail.com</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: BORDER_COLOR }} />

            {/* Quick Action Links */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" sx={{ color: isDark ? '#94A3B8' : '#64748B', fontStyle: 'italic' }}>
                "Democratizing numerical reservoir modeling through modern data assimilation and open software architecture."
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GitHubIcon />}
                  href="https://github.com/Coding-Base/xcape_backend.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                  }}
                >
                  Backend Repo
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<GlobeIcon />}
                  href="https://xcape-com.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${TEAL}, ${PRIMARY})`,
                    color: '#FFFFFF',
                  }}
                >
                  Live Deployment
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/simulator')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${GOLD}, #D97706)`,
                    color: '#090D16',
                  }}
                >
                  Launch Simulator
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Two-Column Layout: Bio & Experience vs. Publications & Skills */}
        <Grid container spacing={4}>
          {/* Left Column: Biography & Research Focus */}
          <Grid item xs={12} md={7}>
            {/* Bio Card */}
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3.5,
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <ScienceIcon sx={{ color: GOLD, fontSize: 26 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                  Biography & Engineering Vision
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: isDark ? '#CBD5E1' : '#334155',
                  fontSize: '0.96rem',
                  mb: 2,
                }}
              >
                <strong>Osimi Godsgift Gbubemi</strong> is an innovative petroleum engineer and computational software developer based in Nigeria. With a solid foundation in the <strong>Department of Petroleum Engineering at the Federal University of Technology, Owerri (FUTO)</strong>, his work bridges high-order computational physics with full-stack software systems to resolve real-world reservoir engineering bottlenecks.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: isDark ? '#CBD5E1' : '#334155',
                  fontSize: '0.96rem',
                  mb: 2,
                }}
              >
                Recognizing the steep barriers and computational opacity that traditional legacy simulators impose on petroleum students and subsurface asset teams, Osimi spearheaded the architectural design, algorithmic derivation, and full-stack development of <strong>XCAPE</strong>. 
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: isDark ? '#CBD5E1' : '#334155',
                  fontSize: '0.96rem',
                }}
              >
                His primary research breakthroughs focus on <strong>automated history matching using the Ensemble Kalman Filter (EnKF)</strong>, coupled forward simulation with open-source engines (OPM Flow), two-phase flow hydraulics via Beggs & Brill (1973) correlations, and probabilistic production forecasting with quantified confidence envelopes.
              </Typography>
            </Card>

            {/* Research Papers Card */}
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3.5,
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <BookIcon sx={{ color: PRIMARY, fontSize: 26 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                  Published Research & Papers
                </Typography>
              </Box>

              <Stack spacing={3}>
                {/* Published Paper: IJAAR */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                    border: `1px solid ${BORDER_COLOR}`,
                    borderLeft: `4px solid ${TEAL}`,
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip label="Published Article" size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: 'rgba(31,122,140,0.15)', color: TEAL }} />
                    <Chip label="June 2026" size="small" sx={{ height: 20, fontSize: '0.68rem' }} />
                    <Chip label="IJAAR · ISSN: 2643-9603" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A', mb: 0.8, lineHeight: 1.35 }}>
                    Sensitivity Analysis of A Gas Lift System to Improve Oil Production in The Niger Delta
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6, fontSize: '0.84rem' }}>
                    <strong>Authors:</strong> Osimi Godsgift Gbubemi, Anthony Ogbaegbe Chikwe, Christian Emelu Okalla.<br />
                    Published in the <em>International Journal of Academic and Applied Research (IJAAR)</em>. Evaluated wellbore hydraulics, gas injection sensitivity, and tubing sizing to enhance lift performance across mature Niger Delta reservoirs.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Right Column: Key Innovations, Tech Stack & Mentorship */}
          <Grid item xs={12} md={5}>
            {/* Core Innovations Card */}
            <Card
              sx={{
                p: { xs: 3, md: 3.5 },
                borderRadius: 3.5,
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
                <GraphIcon sx={{ color: GOLD, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                  XCAPE Innovations
                </Typography>
              </Box>

              <Stack spacing={2}>
                {[
                  {
                    title: 'EnKF Data Assimilation',
                    desc: 'Sequential Bayesian updating with measurement error covariance & parameter bounds for permeability/porosity.',
                    icon: <TuneIcon sx={{ fontSize: 18, color: GOLD }} />,
                  },
                  {
                    title: 'Beggs & Brill Nodal Hydraulics',
                    desc: 'Rigorous 2-phase vertical lift performance (VLP) calculations evaluating tubing pressure drops and gas lift effects.',
                    icon: <CheckIcon sx={{ fontSize: 18, color: TEAL }} />,
                  },
                  {
                    title: 'OPM Flow Forward Engine',
                    desc: 'Automated input deck generation and forward execution executing numerical reservoir simulations seamlessly.',
                    icon: <TerminalIcon sx={{ fontSize: 18, color: PRIMARY }} />,
                  },
                  {
                    title: 'Decline Curve & Reserves (OOIP)',
                    desc: 'Standing Bo PVT correlations, volumetric OOIP computations, and hyperbolic/exponential recovery forecasting.',
                    icon: <StorageIcon sx={{ fontSize: 18, color: '#10B981' }} />,
                  },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,76,129,0.06)',
                        mt: 0.3,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A', fontSize: '0.88rem' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.45, display: 'block' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>

            {/* Technical Skills Card */}
            <Card
              sx={{
                p: { xs: 3, md: 3.5 },
                borderRadius: 3.5,
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER_COLOR}`,
                mb: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', mb: 2.5 }}>
                Technical Competencies
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                  Petroleum & Subsurface
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                  {['Reservoir Simulation', 'History Matching', 'EnKF Assimilation', 'Nodal Analysis', 'Gas Lift Optimization', 'PVT Modeling', 'Decline Curve'].map((skill) => (
                    <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.72rem', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', color: isDark ? '#E2E8F0' : '#1E293B' }} />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                  Software & Architecture
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                  {['Python', 'FastAPI', 'NumPy / SciPy', 'Pandas', 'TypeScript', 'React 18', 'Redux Toolkit', 'Material-UI', 'PostgreSQL', 'Docker'].map((tech) => (
                    <Chip key={tech} label={tech} size="small" sx={{ fontSize: '0.72rem', backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : 'rgba(15,76,129,0.08)', color: PRIMARY, fontWeight: 600 }} />
                  ))}
                </Stack>
              </Box>
            </Card>

            {/* Academic Supervision / Acknowledgment */}
            <Card
              sx={{
                p: { xs: 3, md: 3.5 },
                borderRadius: 3.5,
                backgroundColor: isDark ? 'rgba(15,76,129,0.1)' : 'rgba(15,76,129,0.04)',
                border: `1px solid ${isDark ? 'rgba(56,189,248,0.2)' : 'rgba(15,76,129,0.15)'}`,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: PRIMARY, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon sx={{ fontSize: 18 }} />
                Academic Mentorship
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Carried out under the expert academic supervision and guidance of <strong>Dr. Anthony Ogbaegbe Chikwe</strong> and faculty members at the <strong>Department of Petroleum Engineering, Federal University of Technology, Owerri (FUTO)</strong>.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DeveloperProfilePage
