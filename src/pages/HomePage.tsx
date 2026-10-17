import React from 'react'
import { Box, Container, Typography, Card, CardContent, Button, Grid } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const concepts = [
    {
      title: 'Reservoir Simulation',
      description:
        'Reservoir simulation is a mathematical modeling technique used to predict fluid flow behavior in oil and gas reservoirs.',
      icon: '⚙️',
      image: '/image1.png',
    },
    {
      title: 'History Matching',
      description:
        'History matching is the process of adjusting model parameters to match observed production data from the reservoir.',
      icon: '📊',
      image: '/image2.png',
    },
    {
    title: 'Sensitivity Analysis',
    description: 'Sensitivity analysis is the process of determining the optimal operating condition of a gas lift well that would yield maximum oil production ',
    icon:'⚙️',
    image:'/Xcape.png'
    },
    {
      title: 'Ensemble Kalman Filter',
      description:
        'EnKF is an advanced statistical algorithm that automates the history matching process and quantifies prediction uncertainty.',
      icon: '🔄',
      image: '/image7.png',
    },
    {
      title:'Gas Lift Well',
      description:' Gas lifting is the process of injecting gas into a well to maximize oil production ',
      icon:'🔮',
      image:'/xcapeblackBG.png',
    },
    {
      title: 'Forecasting',
      description:
        'Forecasting uses calibrated reservoir models to predict future production performance under various operational scenarios.',
      icon: '🔮',
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section with Video Background */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          mb: 6,
          overflow: 'hidden',
          minHeight: { xs: '500px', md: '700px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/Offshore_Rig_Video_Generation (1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>

        {/* Dark Overlay for Readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
     
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            XCAPE
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, opacity: 0.95 }}>
            Automated Reservoir History Matching & Simulation Platform
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              fontSize: '1.1rem',
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            An educational, accessible, and deployable platform that automates reservoir history
            matching to improve reservoir performance analysis and forecasting.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/simulator')}
            sx={{
              backgroundColor: '#F4B400',
              color: '#0F4C81',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#E5A800',
              },
            }}
          >
            Start Simulating
          </Button>
        </Container>
      </Box>

      {/* Key Concepts Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 6,
            textAlign: 'center',
            fontWeight: 700,
            color: '#0F4C81',
          }}
        >
          Key Concepts
        </Typography>
        <Grid container spacing={3}>
          {concepts.map((concept, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(15, 76, 129, 0.15)',
                  },
                }}
              >
                {concept.image && (
                  <Box
                    component="img"
                    src={concept.image}
                    alt={concept.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderBottom: '2px solid #F4B400',
                    }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ fontSize: '2rem', mb: 2, lineHeight: 1 }}>{concept.icon}</Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: '#0F4C81',
                    }}
                  >
                    {concept.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 3,
                      flex: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {concept.description}
                  </Typography>
                  <Button
                    size="small"
                    sx={{
                      color: '#0F4C81',
                      fontWeight: 600,
                      textTransform: 'none',
                      alignSelf: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'rgba(15, 76, 129, 0.05)',
                      },
                    }}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
                    onClick={() => navigate('/concepts')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          backgroundColor: '#F7F9FC',
          py: 8,
          mb: 8,
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#1a2332',
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              mb: 6,
              textAlign: 'center',
              fontWeight: 700,
              color: '#0F4C81',
            }}
          >
            Platform Features
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Automated Matching', desc: 'EnKF-powered automated parameter estimation' },
              { title: 'Real-time Visualization', desc: 'Interactive charts and data visualization' },
              { title: 'Educational Focus', desc: 'Designed for student learning and teaching' },
              { title: 'Open Source', desc: 'Built with OPM Flow and accessible tools' },
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    textAlign: 'center',
                    height: '100%',
                    p: 2,
                    color: '#1F2937',
                    '@media (prefers-color-scheme: dark)': {
                      color: '#ecf0f1',
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '2.5rem',
                      mb: 2,
                      color: '#F4B400',
                    }}
                  >
                    {['🤖', '📈', '👨‍🎓', '🔓'][idx]}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1F7A8C 0%, #0F4C81 100%)',
            color: 'white',
            borderRadius: 3,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Ready to Master Reservoir Simulation?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: '1.1rem',
              maxWidth: 600,
              mx: 'auto',
              opacity: 0.95,
            }}
          >
            Explore our comprehensive guides and get started with the XCAPE simulator platform today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#F4B400',
                color: '#0F4C81',
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: '#E5A800',
                },
              }}
              onClick={() => navigate('/guide')}
            >
              User Guide
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/about')}
            >
              About XCAPE
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
