import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'

interface Concept {
  id: number
  title: string
  shortDesc: string
  fullDesc: string
  icon: string
  image?: string
}

const CONCEPTS_PER_PAGE = 6

const concepts: Concept[] = [
  {
    id: 1,
    title: 'Reservoir Simulation',
    shortDesc: 'Mathematical modeling of fluid flow in reservoirs',
    fullDesc:
      'Reservoir simulation is a mathematical modeling technique used to predict fluid flow behavior in oil and gas reservoirs. It involves solving partial differential equations that describe fluid movement through porous rocks, accounting for rock properties, fluid properties, and boundary conditions.',
    icon: '⚙️',
    image: 'https://images.pexels.com/photos/35224901/pexels-photo-35224901.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 2,
    title: 'History Matching',
    shortDesc: 'Adjusting parameters to match observed production data',
    fullDesc:
      'History matching is the process of adjusting reservoir model parameters to match observed production data from the field. This calibration ensures that the model accurately represents the real reservoir and can provide reliable forecasts for future production scenarios.',
    icon: '📊',
    image: 'https://images.pexels.com/photos/414936/pexels-photo-414936.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 3,
    title: 'Ensemble Kalman Filter',
    shortDesc: 'Automated statistical algorithm for parameter estimation',
    fullDesc:
      'The Ensemble Kalman Filter (EnKF) is an advanced statistical algorithm that automates the history matching process. It uses multiple simulations (ensemble) to estimate model parameters while quantifying prediction uncertainty, providing both best estimates and confidence intervals.',
    icon: '🔄',
    image: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 4,
    title: 'Forecasting',
    shortDesc: 'Predicting future production with calibrated models',
    fullDesc:
      'Forecasting uses calibrated reservoir models to predict future production performance under various operational scenarios. It helps in field development planning, investment decisions, and optimal well placement strategies.',
    icon: '🔮',
  },
  {
    id: 5,
    title: 'Uncertainty Quantification',
    shortDesc: 'Understanding prediction confidence ranges',
    fullDesc:
      'Uncertainty quantification techniques help understand the reliability and confidence ranges of predictions. This is crucial for risk assessment and decision-making in oil and gas projects where investments are based on production forecasts.',
    icon: '📈',
  },
  {
    id: 6,
    title: 'Production Data Analysis',
    shortDesc: 'Analyzing field measurements and performance data',
    fullDesc:
      'Production data analysis involves processing and interpreting field measurements such as pressure, flow rates, and cumulative production. This data forms the basis for history matching and model calibration.',
    icon: '🔍',
  },
  {
    id: 7,
    title: 'Petrophysical Properties',
    shortDesc: 'Rock and fluid properties affecting flow',
    fullDesc:
      'Petrophysical properties such as porosity and permeability determine how fluids flow through rocks. Understanding and estimating these properties is critical for accurate reservoir simulation and forecasting.',
    icon: '🪨',
  },
  {
    id: 8,
    title: 'Well Management',
    shortDesc: 'Optimizing well operations and placement',
    fullDesc:
      'Effective well management involves determining optimal well locations, completions, and operating strategies. Reservoir simulation helps evaluate different well management scenarios and their impact on production.',
    icon: '⛰️',
  },
]

const ConceptsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const pagesCount = Math.ceil(concepts.length / CONCEPTS_PER_PAGE)
  const startIndex = (page - 1) * CONCEPTS_PER_PAGE
  const endIndex = startIndex + CONCEPTS_PER_PAGE
  const currentConcepts = concepts.slice(startIndex, endIndex)

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenDialog = (concept: Concept) => {
    setSelectedConcept(concept)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedConcept(null)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 700,
            color: '#0F4C81',
          }}
        >
          Reservoir Simulation & History Matching Concepts
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'textSecondary',
            mb: 6,
            fontSize: '1.1rem',
          }}
        >
          Explore fundamental concepts about reservoir simulation, automated history matching, and
          forecasting.
        </Typography>

        {/* Concepts Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {currentConcepts.map((concept) => (
            <Grid item xs={12} sm={6} md={4} key={concept.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(15, 76, 129, 0.15)',
                  },
                }}
                onClick={() => handleOpenDialog(concept)}
              >
                {concept.image && (
                  <Box
                    component="img"
                    src={concept.image}
                    alt={concept.title}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderBottom: '2px solid #F4B400',
                    }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ fontSize: '2.5rem', mb: 2 }}>{concept.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1.5,
                      fontWeight: 700,
                      color: '#0F4C81',
                    }}
                  >
                    {concept.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{
                      flex: 1,
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {concept.shortDesc}
                  </Typography>
                  <Button
                    size="small"
                    sx={{
                      color: '#0F4C81',
                      fontWeight: 600,
                      textTransform: 'none',
                      alignSelf: 'flex-start',
                    }}
                  >
                    View Details →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Pagination
            count={pagesCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>

        {/* Pagination Info */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: 'textSecondary',
          }}
        >
          Showing {startIndex + 1}–{Math.min(endIndex, concepts.length)} of {concepts.length} concepts
        </Typography>
      </Box>

      {/* Concept Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedConcept && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ fontSize: '2.5rem' }}>{selectedConcept.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                  {selectedConcept.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {selectedConcept.fullDesc}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  )
}

export default ConceptsPage
