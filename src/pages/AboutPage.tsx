import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  Chip,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Group as GroupIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

const AboutPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const features = [
    {
      icon: <CheckIcon />,
      title: 'Multi-Algorithm Automated Matching',
      description: 'ES-MDA and EnKF-powered automated parameter estimation with uncertainty quantification',
    },
    {
      icon: <GroupIcon />,
      title: 'Collaborative Workspaces & Teams',
      description: 'Built for teams — invite engineers, admins, and students via secure one-time access links to share models, simulations, and forecasts',
    },
    {
      icon: <SchoolIcon />,
      title: 'Educational Focus',
      description: 'Designed for students and lecturers to learn hands-on reservoir simulation',
    },
    {
      icon: <SpeedIcon />,
      title: 'Efficient Computing',
      description: 'Optimized algorithms for faster computation and iterative refinement',
    },
    {
      icon: <PublicIcon />,
      title: 'Open Access',
      description: 'Deployed on Render for easy access by students and educators worldwide',
    },
  ]

  const technologies = [
    { name: 'OPM Flow', description: 'Open-source reservoir simulator' },
    { name: 'Python', description: 'Backend development language' },
    { name: 'FastAPI', description: 'High-performance API framework' },
    { name: 'React', description: 'Frontend UI framework' },
    { name: 'Data Assimilation Suite', description: 'ES-MDA, EnKF, and customizable equation-driven calibration algorithms' },
    { name: 'Team Workspaces & Collaboration', description: 'Multi-user shared workspaces with role-based access (Owner, Admin, Engineer, Viewer)' },
    { name: 'PostgreSQL', description: 'Data persistence layer' },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#0F4C81',
            }}
          >
            About XCAPE
          </Typography>
          <Typography variant="h5" sx={{ color: 'textSecondary', mb: 4, fontWeight: 300 }}>
            An Educational Platform for Automated Reservoir History Matching
          </Typography>
          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 4,
              backgroundColor: 'rgba(15, 76, 129, 0.05)',
              borderRadius: 2,
              borderLeft: '4px solid #0F4C81',
            }}
          >
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              XCAPE is a Python-based automated history matching tool developed as a Final Year Project for the
              Department of Petroleum Engineering. The platform integrates the open-source simulator OPM Flow with
              advanced automated calibration algorithms to provide an accessible, educational, and deployable solution
              for reservoir performance analysis and forecasting.
            </Typography>
          </Box>

          {/* Project Image */}
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1600&q=80"
            alt="XCAPE Project Overview"
            sx={{
              mt: 4,
              maxWidth: '100%',
              height: 'auto',
              maxHeight: 300,
              borderRadius: 2,
              boxShadow: '0 10px 30px rgba(15, 76, 129, 0.2)',
            }}
          />
        </Box>

        {/* Project Details Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Student Developer
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                  Osimi Godsgift Gbubemi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Registration No
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                  20211276493
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Supervisor
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                  Dr Chikwe
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Department
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                  Petroleum Eng.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Problem & Importance */}
        <Card sx={{ mb: 8, borderLeft: '4px solid #1F7A8C' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4C81', mb: 3 }}>
              Problem & Importance
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
              Translating field measurements (pressures and production rates) into reliable reservoir forecasts is
              traditionally manual, time-consuming, and often inaccessible to students due to licensing costs and
              complexity. Inaccurate models produce misleading forecasts that can result in poor field decisions.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              XCAPE focuses on building a <strong>reproducible, low-cost tool</strong> that automates matching against
              real production data, delivers predictive forecasts, and serves as an <strong>educational platform</strong>
              enabling lower-level students to gain hands-on experience in reservoir modeling and decision-making.
            </Typography>
          </CardContent>
        </Card>

        {/* Aims & Objectives */}
        <Card sx={{ mb: 8, borderLeft: '4px solid #F4B400' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4C81', mb: 3 }}>
              Aims & Objectives
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Main Aim
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Build and demonstrate a Python-based automated history matching tool that aligns reservoir model
              predictions with real production data for improved performance analysis and forecasting.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Key Objectives
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon sx={{ color: '#22C55E' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Manual Baseline Matching"
                  secondary="Implement interface illustrating traditional parameter tuning and limitations"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon sx={{ color: '#22C55E' }} />
                </ListItemIcon>
                <ListItemText
                  primary="EnKF Implementation"
                  secondary="Automated parameter estimation with uncertainty quantification"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon sx={{ color: '#22C55E' }} />
                </ListItemIcon>
                <ListItemText
                  primary="OPM Flow Integration"
                  secondary="Seamless integration via Python bindings for forward simulations"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon sx={{ color: '#22C55E' }} />
                </ListItemIcon>
                <ListItemText primary="Forecast Runs" secondary="Compare prior and posterior predictions" />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon sx={{ color: '#22C55E' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Interactive Frontend"
                  secondary="React-based visualization for educational use"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4C81', mb: 4 }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={6} key={idx}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        color: '#0F4C81',
                        fontSize: '2rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F4C81' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4C81', mb: 4 }}>
              Technology Stack
            </Typography>
            <Grid container spacing={2}>
              {technologies.map((tech, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CodeIcon
                      sx={{
                        color: '#0F4C81',
                        mt: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                        {tech.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tech.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Lead Developer Spotlight */}
        <Box sx={{ mt: 8 }}>
          <Card
            sx={{
              borderRadius: 3.5,
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
              backgroundColor: isDark ? '#0C1322' : '#FFFFFF',
              boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(15,76,129,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  width: { xs: 130, md: 160 },
                  height: { xs: 160, md: 190 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '3px solid #F4B400',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                <Box
                  component="img"
                  src="/osimi_profile.jpg"
                  alt="Osimi Godsgift Gbubemi"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                  <Chip
                    label="Creator & Lead Developer"
                    size="small"
                    sx={{ backgroundColor: 'rgba(244,180,0,0.15)', color: '#F4B400', fontWeight: 700 }}
                  />
                  <Chip
                    label="FUTO Petroleum Engineering"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', mb: 1 }}>
                  Osimi Godsgift Gbubemi
                </Typography>
                <Typography variant="body1" sx={{ color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.7, mb: 2.5, fontSize: '0.95rem' }}>
                  Computational petroleum engineer and researcher dedicated to modernizing reservoir simulation. Spearheaded the mathematical formulation of the EnKF data assimilation algorithm, Beggs & Brill multiphase nodal hydraulics, and full-stack software architecture behind XCAPE.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/developer')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #0F4C81, #1F7A8C)',
                    color: '#FFFFFF',
                    px: 3,
                  }}
                >
                  View Full Executive Profile & Publications
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}

export default AboutPage
