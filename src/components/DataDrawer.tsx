/**
 * Data Drawer Component
 * Displays sample datasets with educational content about data structure and requirements.
 * Allows users to view and download example data files.
 * Also provides access to manual data entry through DataInputModal.
 */

import React, { useState } from 'react'
import {
  Drawer,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  useTheme,
} from '@mui/material'
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  DataObject as DataObjectIcon,
  Visibility as VisibilityIcon,
  
} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'

interface DataDrawerProps {
  open: boolean
  onClose: () => void
  onDatasetCreated?: (id?: number) => void
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

// Sample production data
const SAMPLE_PRODUCTION_DATA = [
  {
    date: '2023-01-01',
    days: 0,
    oil_bbl: 520.5,
    water_bbl: 180.2,
    gas_mcf: 5200.1,
    pressure_psi: 250.5,
  },
  {
    date: '2023-01-02',
    days: 1,
    oil_bbl: 518.3,
    water_bbl: 185.4,
    gas_mcf: 5180.2,
    pressure_psi: 249.8,
  },
  {
    date: '2023-01-03',
    days: 2,
    oil_bbl: 515.1,
    water_bbl: 190.1,
    gas_mcf: 5160.5,
    pressure_psi: 249.2,
  },
  {
    date: '2023-01-04',
    days: 3,
    oil_bbl: 512.8,
    water_bbl: 192.3,
    gas_mcf: 5140.3,
    pressure_psi: 248.5,
  },
  {
    date: '2023-01-05',
    days: 4,
    oil_bbl: 510.2,
    water_bbl: 195.6,
    gas_mcf: 5120.1,
    pressure_psi: 247.8,
  },
]

const PRODUCTION_FIELD_DESCRIPTIONS = {
  date: 'Calendar date of production measurement',
  days: 'Days since production start (for easy reference)',
  oil_bbl: 'Oil production rate in barrels per day (BBL/D)',
  water_bbl: 'Water production rate in barrels per day (BBL/D)',
  gas_mcf: 'Gas production rate in million cubic feet per day (MCF/D)',
  pressure_psi: 'Reservoir pressure in pounds per square inch (PSI)',
}

// Sample reservoir model
const SAMPLE_RESERVOIR_MODEL = {
  model_name: 'Test Reservoir Model - North Sea Field',
  reservoir: {
    name: 'Test Field',
    type: 'Sandstone',
    depth_m: 3200,
    thickness_m: 50,
    area_hectares: 12500,
    temperature_celsius: 95,
    initial_pressure_bar: 250,
  },
  rock_properties: {
    porosity_fraction: 0.15,
    permeability_md: 100,
    initial_water_saturation: 0.3,
    initial_oil_saturation: 0.7,
  },
  well: {
    name: 'Well-1',
    type: 'Producer',
    productivity_index: 1.0,
  },
}

const RESERVOIR_FIELD_DESCRIPTIONS: { [key: string]: string } = {
  // Reservoir properties
  name: 'Name or identifier of the reservoir/field',
  type: 'Lithology type (Sandstone, Shale, etc.)',
  depth_m: 'Average depth below surface in meters',
  thickness_m: 'Average reservoir thickness in meters',
  area_hectares: 'Total reservoir area in hectares',
  temperature_celsius: 'Reservoir temperature in Celsius',
  initial_pressure_bar: 'Initial/hydrostatic pressure in bar',

  // Rock properties
  porosity_fraction: 'Rock porosity as fraction (0-1), e.g., 0.15 = 15%',
  permeability_md: 'Rock permeability in millidarcies (mD)',
  rock_compressibility: 'Rock compressibility coefficient',
  initial_water_saturation: 'Initial water saturation as fraction (0-1)',
  initial_oil_saturation: 'Initial oil saturation as fraction (0-1)',

  // Well properties
  well_name: 'Identifier for the production/injection well',
  well_type: 'Well type: Producer, Injector, or Monitoring',
  productivity_index: 'Well productivity index (relates flow to pressure drop)',
  skin_factor: 'Well skin factor (negative = stimulated, positive = damaged)',

  // Fluid properties
  oil_viscosity_cp: 'Oil viscosity in centipoise (cP) - affects flow rate',
  oil_density: 'Oil density in kg/m³ - affects buoyancy and equilibrium',
  water_viscosity_cp: 'Water viscosity in centipoise (cP)',
  gas_viscosity_cp: 'Gas viscosity in centipoise (cP)',
}

const DataDrawer: React.FC<DataDrawerProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = isDark ? '#38BDF8' : '#0F4C81'
  // Manual entry moved to Simulator input page; drawer no longer opens DataInputModal

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const downloadJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadCSV = (headers: string[], rows: any[], filename: string) => {
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => r[h]).join(','))].join(
      '\n',
    )
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600, md: 800 },
          maxWidth: '90vw',
          backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
          borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            background: isDark
              ? 'linear-gradient(135deg, #090D16 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #0F4C81 0%, #0D3A5C 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 4px 12px rgba(15, 76, 129, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DataObjectIcon sx={{ fontSize: 28, color: isDark ? '#38BDF8' : 'white' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25, color: isDark ? '#F8FAFC' : 'white' }}>
                📊 Sample Data & Documentation
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : 'rgba(255, 255, 255, 0.8)' }}>
                Learn about required data formats and structures
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={onClose} sx={{ color: isDark ? '#94A3B8' : 'white', '&:hover': { color: isDark ? '#38BDF8' : 'white' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'divider', px: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { fontWeight: 600, color: isDark ? '#94A3B8' : 'inherit' },
              '& .Mui-selected': { color: `${primaryColor} !important` },
              '& .MuiTabs-indicator': { backgroundColor: primaryColor },
            }}
          >
            <Tab label="📈 Production Data" />
            <Tab label="⚙️ Reservoir Parameters" />
            <Tab label="📚 Data Guide" />
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
          }}
        >
          {/* Tab 1: Production Data */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Production Data (Historical Measurements)
                </Typography>
                <Typography variant="caption">
                  Daily production records from the well. The system uses this data to calibrate the
                  reservoir model through EnKF.
                </Typography>
              </Alert>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: primaryColor }}>
                Sample Data Preview
              </Typography>

              <TableContainer component={Paper} sx={{ mb: 2, backgroundColor: isDark ? '#0F172A' : 'background.paper', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : undefined }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: isDark ? '#1E293B' : '#E3F2FD' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: primaryColor }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: primaryColor }} align="right">
                        Oil (BBL/D)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: primaryColor }} align="right">
                        Water (BBL/D)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: primaryColor }} align="right">
                        Pressure (PSI)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SAMPLE_PRODUCTION_DATA.slice(0, 5).map((row, idx) => (
                      <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : undefined } }}>
                        <TableCell sx={{ color: isDark ? '#E2E8F0' : 'inherit' }}>{row.date}</TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#E2E8F0' : 'inherit' }}>{row.oil_bbl.toFixed(1)}</TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#E2E8F0' : 'inherit' }}>{row.water_bbl.toFixed(1)}</TableCell>
                        <TableCell align="right" sx={{ color: isDark ? '#E2E8F0' : 'inherit' }}>{row.pressure_psi.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: primaryColor }}>
                  Field Descriptions
                </Typography>
                <Stack spacing={1}>
                  {Object.entries(PRODUCTION_FIELD_DESCRIPTIONS).map(([field, description]) => (
                    <Box
                      key={field}
                      sx={{
                        p: 1.5,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 76, 129, 0.05)',
                        borderRadius: '6px',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 76, 129, 0.1)',
                      }}
                    >
                      <Chip
                        label={field}
                        size="small"
                        sx={{
                          backgroundColor: primaryColor,
                          color: isDark ? '#090D16' : 'white',
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#333', mt: 0.5 }}>
                        {description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const headers = Object.keys(SAMPLE_PRODUCTION_DATA[0])
                  downloadCSV(headers, SAMPLE_PRODUCTION_DATA, 'sample_production_data.csv')
                }}
                fullWidth
                sx={{
                  backgroundColor: primaryColor,
                  color: isDark ? '#090D16' : 'white',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: isDark ? '#7DD3FC' : '#0D3A5C' },
                }}
              >
                Download Sample Production Data (CSV)
              </Button>
            </Box>
          </TabPanel>

          {/* Tab 2: Reservoir Parameters */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Reservoir Model Configuration
                </Typography>
                <Typography variant="caption">
                  Defines the physical and rock properties of the reservoir. These parameters are
                  calibrated by EnKF to match production data.
                </Typography>
              </Alert>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: primaryColor }}>
                Model Overview
              </Typography>

              <Card
                sx={{
                  mb: 2,
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : '#F0F7FF',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #BAE6FD',
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Model:</strong> {SAMPLE_RESERVOIR_MODEL.model_name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Reservoir:</strong> {SAMPLE_RESERVOIR_MODEL.reservoir.name} ({SAMPLE_RESERVOIR_MODEL.reservoir.type})
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Well:</strong> {SAMPLE_RESERVOIR_MODEL.well.name} ({SAMPLE_RESERVOIR_MODEL.well.type})
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: primaryColor }}>
                Reservoir Properties
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Stack spacing={1}>
                  {Object.entries(SAMPLE_RESERVOIR_MODEL.reservoir).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 76, 129, 0.05)',
                        borderRadius: '6px',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 76, 129, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : '#666', display: 'block' }}>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25, color: isDark ? '#E2E8F0' : 'inherit' }}>
                          {RESERVOIR_FIELD_DESCRIPTIONS[key] || 'Property value'}
                        </Typography>
                      </Box>
                      <Chip label={String(value)} color="primary" variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: primaryColor }}>
                Rock Properties (Calibration Parameters)
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Stack spacing={1}>
                  {Object.entries(SAMPLE_RESERVOIR_MODEL.rock_properties).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        backgroundColor: isDark ? 'rgba(40, 167, 69, 0.08)' : 'rgba(40, 167, 69, 0.05)',
                        borderRadius: '6px',
                        border: isDark ? '1px solid rgba(40, 167, 69, 0.2)' : '1px solid rgba(40, 167, 69, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#94A3B8' : '#666', display: 'block' }}>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25, color: isDark ? '#E2E8F0' : 'inherit' }}>
                          {RESERVOIR_FIELD_DESCRIPTIONS[key] || 'Rock property'}
                        </Typography>
                      </Box>
                      <Chip label={String(value)} color="success" variant="outlined" />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadJSON(SAMPLE_RESERVOIR_MODEL, 'sample_reservoir_model.json')}
                fullWidth
                sx={{
                  backgroundColor: primaryColor,
                  color: isDark ? '#090D16' : 'white',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: isDark ? '#7DD3FC' : '#0D3A5C' },
                }}
              >
                Download Sample Reservoir Model (JSON)
              </Button>
            </Box>
          </TabPanel>

          {/* Tab 3: Data Guide */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Alert severity="success" icon={<VisibilityIcon />} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Data Format Requirements & Educational Guide
                </Typography>
              </Alert>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: primaryColor }}>
                1️⃣ Production Data Requirements
              </Typography>

              <Card sx={{ mb: 2, backgroundColor: isDark ? '#111827' : 'background.paper', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : undefined }}>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Format:</strong> CSV (Comma-Separated Values)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Required Columns:</strong>
                  </Typography>
                  <Box
                    sx={{
                      pl: 2,
                      '& li': { mb: 0.5 },
                      color: isDark ? '#CBD5E1' : 'inherit',
                    }}
                    component="ul"
                  >
                    <Typography component="li" variant="body2">
                      <strong>date</strong> - Calendar date (YYYY-MM-DD)
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>days</strong> - Days since start (integer)
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>oil_bbl</strong> - Daily oil production in barrels
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>water_bbl</strong> - Daily water production in barrels
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>gas_mcf</strong> - Daily gas production (MCF)
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>pressure_psi</strong> - Reservoir pressure at surface
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: primaryColor }}>
                2️⃣ Reservoir Model Requirements
              </Typography>

              <Card sx={{ mb: 2, backgroundColor: isDark ? '#111827' : 'background.paper', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : undefined }}>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Format:</strong> JSON (JavaScript Object Notation)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                    <strong>Key Sections:</strong>
                  </Typography>
                  <Box
                    sx={{
                      pl: 2,
                      '& li': { mb: 0.5 },
                      color: isDark ? '#CBD5E1' : 'inherit',
                    }}
                    component="ul"
                  >
                    <Typography component="li" variant="body2">
                      <strong>reservoir:</strong> Basic reservoir geometry and conditions
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>rock_properties:</strong> Porosity, permeability, saturation (calibrated)
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>well:</strong> Well definition and productivity
                    </Typography>
                    <Typography component="li" variant="body2">
                      <strong>simulation_parameters:</strong> Grid resolution, time steps
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: primaryColor }}>
                3️⃣ How EnKF Uses This Data
              </Typography>

              <Stack spacing={1.5}>
                <Card
                  sx={{
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : '#E3F2FD',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : 'none',
                  }}
                >
                  <CardContent>
                    <Chip
                      label="Step 1: Input"
                      size="small"
                      sx={{
                        backgroundColor: primaryColor,
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                      System loads production data (CSV) and reservoir model (JSON)
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    backgroundColor: isDark ? 'rgba(168, 85, 247, 0.08)' : '#F3E5F5',
                    border: isDark ? '1px solid rgba(168, 85, 247, 0.2)' : 'none',
                  }}
                >
                  <CardContent>
                    <Chip
                      label="Step 2: Create Ensemble"
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#C084FC' : '#7B1FA2',
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                      Generates 100 ensemble members with varied rock properties (porosity,
                      permeability) around initial estimates
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    backgroundColor: isDark ? 'rgba(34, 197, 94, 0.08)' : '#E8F5E9',
                    border: isDark ? '1px solid rgba(34, 197, 94, 0.2)' : 'none',
                  }}
                >
                  <CardContent>
                    <Chip
                      label="Step 3: Calibrate"
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#4ADE80' : '#388E3C',
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                      Updates each ensemble member to match production data better (EnKF iterations)
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    backgroundColor: isDark ? 'rgba(244, 63, 94, 0.08)' : '#FCE4EC',
                    border: isDark ? '1px solid rgba(244, 63, 94, 0.2)' : 'none',
                  }}
                >
                  <CardContent>
                    <Chip
                      label="Step 4: Forecast"
                      size="small"
                      sx={{
                        backgroundColor: isDark ? '#FB7185' : '#C2185B',
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#E2E8F0' : 'inherit' }}>
                      Uses calibrated model to predict future production for 50+ days with uncertainty
                      bounds (P10, P50, P90)
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </TabPanel>
        </Box>
      </Box>

      {/* Manual entry moved to Simulator Input page */}
    </Drawer>
  )
}

export default DataDrawer
