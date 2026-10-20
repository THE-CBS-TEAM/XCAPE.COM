import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
  PlayArrow as RunIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material'

const steps = [
  {
    label: 'Upload Data',
    icon: <UploadIcon />,
    description: 'Upload your production data and reservoir model parameters',
  },
  {
    label: 'Configure Parameters',
    icon: <SettingsIcon />,
    description: 'Set up the simulation parameters and matching algorithm options',
  },
  {
    label: 'Run Simulation',
    icon: <RunIcon />,
    description: 'Execute the reservoir simulation and history matching process',
  },
  {
    label: 'Analyze Results',
    icon: <ChartIcon />,
    description: 'Review the results and visualize predictions vs observed data',
  },
]

const UserGuidePage: React.FC = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = isDark ? '#38BDF8' : '#0F4C81'

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          XCAPE User Guide
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'textSecondary',
            mb: 6,
            fontSize: '1.1rem',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          Follow this step-by-step guide to perform history matching and simulation using the XCAPE
          platform.
        </Typography>

        {/* Guide Image */}
        <Box
          component="img"
          src="https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="XCAPE User Guide"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: 280,
            mb: 6,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(15, 76, 129, 0.15)',
            display: 'block',
            mx: 'auto',
          }}
        />

        {/* Steps Overview */}
        <Card sx={{ mb: 6, p: 4 }}>
          <Stepper
            activeStep={-1}
            orientation="vertical"
            sx={{
              '& .MuiStepConnector-root': {
                color: isDark ? 'rgba(56, 189, 248, 0.3)' : '#0F4C81',
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={false}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: primaryColor,
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      {index + 1}
                    </Box>
                  )}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: primaryColor,
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
                <Box sx={{ ml: 7, mb: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    {step.description}
                  </Typography>
                </Box>
              </Step>
            ))}
          </Stepper>
        </Card>

        {/* Detailed Sections */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Data Upload Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <UploadIcon sx={{ color: primaryColor, fontSize: '2rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor }}>
                    Step 1: Upload Data
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Begin by uploading your production data and reservoir model files. Supported formats include CSV for
                  production data and structured model parameters.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Production data (pressure, rates)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Reservoir model parameters" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Initial estimates and bounds" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuration Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SettingsIcon sx={{ color: primaryColor, fontSize: '2rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor }}>
                    Step 2: Configure Parameters
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Set up your simulation parameters and select the matching algorithm. Choose between manual baseline
                  matching or automated EnKF approach.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Select matching algorithm" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Set ensemble size (for EnKF)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Define convergence criteria" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Run Simulation Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <RunIcon sx={{ color: primaryColor, fontSize: '2rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor }}>
                    Step 3: Run Simulation
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Execute the simulation. The platform integrates OPM Flow for forward model runs and executes the
                  selected matching algorithm.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Monitor run progress" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="View iterative updates" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Download intermediate results" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Results Analysis Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ChartIcon sx={{ color: primaryColor, fontSize: '2rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor }}>
                    Step 4: Analyze Results
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Review and visualize the results. Compare observed vs predicted data, examine parameter
                  distributions, and generate forecasts.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Visualize match quality" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Review parameter posteriors" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckIcon sx={{ fontSize: '1rem', color: '#22C55E' }} />
                    </ListItemIcon>
                    <ListItemText primary="Generate production forecasts" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tips & Best Practices */}
        <Card
          sx={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F7F9FC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor, mb: 2 }}>
              💡 Tips & Best Practices
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText
                  primary="Data Quality"
                  secondary="Ensure your input data is clean, consistent, and properly formatted for best results."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText
                  primary="Parameter Bounds"
                  secondary="Set realistic bounds on parameters based on geological and operational constraints."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText
                  primary="Ensemble Size"
                  secondary="Larger ensembles provide better statistics but require more computational resources."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: primaryColor }} />
                </ListItemIcon>
                <ListItemText
                  primary="Iterative Refinement"
                  secondary="Run multiple iterations with refined parameters for improved convergence."
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default UserGuidePage
