import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FunctionsIcon from '@mui/icons-material/Functions'

interface FormulasDrawerProps {
  open: boolean
  onClose: () => void
}

interface FormulaEntry {
  name: string
  formula: string
  variables: string[]
  description: string
  units?: string
}

interface FormulaSection {
  title: string
  icon: string
  color: string
  formulas: FormulaEntry[]
}

const formulaSections: FormulaSection[] = [
  {
    title: 'Original Oil In Place (OOIP)',
    icon: '🛢️',
    color: '#1F7A8C',
    formulas: [
      {
        name: 'Volumetric OOIP',
        formula: 'OOIP = 7758 × A × h × φ × (1 − Sw) / Bo',
        variables: [
          'A = Drainage area (acres)',
          'h = Net pay thickness (ft)',
          'φ = Porosity (fraction)',
          'Sw = Water saturation (fraction)',
          'Bo = Oil formation volume factor (RB/STB)',
        ],
        description: 'Estimates the stock-tank barrels of oil originally in the reservoir pore space.',
        units: 'STB',
      },
      {
        name: "Standing's Bo Correlation",
        formula: 'Bo = 0.972 + 0.000147 × F^1.175',
        variables: [
          'F = Rs × (γg / γo)^0.5 + 1.25 × T',
          'Rs = Solution GOR (scf/STB)',
          'γg = Gas specific gravity',
          'γo = Oil specific gravity',
          'T = Temperature (°F)',
        ],
        description:
          "Auto-computes oil formation volume factor when Bo is not entered manually. Rs is estimated from Standing's correlation using reservoir pressure and API gravity.",
        units: 'RB/STB',
      },
      {
        name: 'Remaining OOIP after 365 days',
        formula: 'OOIP_remaining = OOIP_initial − N_p',
        variables: [
          'N_p = Cumulative oil produced over forecast period (STB)',
          'N_p is estimated from daily rate × 365 × 0.85 (efficiency factor)',
        ],
        description: 'Tracks stock-tank oil remaining in the reservoir after the 365-day forecast.',
        units: 'STB',
      },
      {
        name: 'Recovery Factor',
        formula: 'RF = (N_p / OOIP) × 100',
        variables: ['N_p = Cumulative production (STB)', 'OOIP = Initial oil in place (STB)'],
        description: 'Percentage of OOIP recovered over the forecast period.',
        units: '%',
      },
    ],
  },
  {
    title: 'History Matching — Error Metrics',
    icon: '📊',
    color: '#0F4C81',
    formulas: [
      {
        name: 'Normalised Root Mean Square Error (NRMSE)',
        formula: 'NRMSE = (RMSE / ȳ) × 100',
        variables: [
          'RMSE = √[ Σ(ŷᵢ − yᵢ)² / n ]',
          'ŷᵢ = Simulated value at time step i',
          'yᵢ = Observed value at time step i',
          'ȳ = Mean of observed data',
          'n = Number of time steps',
        ],
        description:
          'Primary match-quality metric. Lower NRMSE = better history match. Values below 10% indicate a good match.',
        units: '%',
      },
      {
        name: 'Mean Absolute Percentage Error (MAPE)',
        formula: 'MAPE = (100 / n) × Σ|yᵢ − ŷᵢ| / |yᵢ|',
        variables: ['yᵢ = Observed', 'ŷᵢ = Simulated', 'n = Data points'],
        description: 'Scale-independent error metric. Useful for comparing across wells with different production magnitudes.',
        units: '%',
      },
      {
        name: 'Match Quality Score',
        formula: 'MQ = max(0, 100 − NRMSE)',
        variables: ['NRMSE = Normalised RMSE (%)'],
        description: 'Displayed in the dashboard. 100% = perfect match. Typical good history match is 75–95%.',
        units: '%',
      },
    ],
  },
  {
    title: 'Ensemble Kalman Filter (EnKF)',
    icon: '⚗️',
    color: '#7B2FBE',
    formulas: [
      {
        name: 'Kalman Gain',
        formula: 'K = C_md × (C_dd + C_D)⁻¹',
        variables: [
          'C_md = Cross-covariance (model parameters × data)',
          'C_dd = Auto-covariance of predicted data',
          'C_D = Measurement error covariance',
        ],
        description: 'Controls how strongly observed data updates the ensemble of model parameters. Large K = observations dominate.',
        units: 'dimensionless matrix',
      },
      {
        name: 'Ensemble Update',
        formula: 'mⁱ_updated = mⁱ_prior + K × (dⁱ_obs − dⁱ_pred)',
        variables: [
          'mⁱ = Parameter vector for member i',
          'dⁱ_obs = Observed data + noise for member i',
          'dⁱ_pred = Predicted data for member i',
          'K = Kalman gain matrix',
        ],
        description:
          'Applies the EnKF update to each of the 50 ensemble members. After convergence, the ensemble mean is the best-estimate parameter set.',
        units: 'parameter units',
      },
      {
        name: 'Ensemble Size',
        formula: 'N_e = 50 (default)',
        variables: ['N_e = Number of ensemble members'],
        description:
          'XCAPE uses 50 ensemble members by default. More members improves statistical accuracy but increases compute time.',
        units: 'members',
      },
    ],
  },
  {
    title: 'Nodal Analysis — IPR (Inflow Performance)',
    icon: '📉',
    color: '#E65100',
    formulas: [
      {
        name: 'Vogel IPR (saturated reservoir)',
        formula: 'Pwf = PR × 0.125 × [−1 + √(81 − 80 × q/qmax)]',
        variables: [
          'PR = Reservoir pressure (psia)',
          'q = Oil flow rate (bopd)',
          'qmax = Absolute open flow (AOF)',
          'Pwf = Flowing bottomhole pressure (psia)',
        ],
        description:
          'At q=0 → Pwf = PR (reservoir pressure). As q increases Pwf decreases. Intersection with VLP gives operating point.',
        units: 'psia',
      },
      {
        name: 'Vogel AOF (qmax)',
        formula: 'qmax = PI × PR / 1.8',
        variables: ['PI = Productivity index (bbl/day/psi)', 'PR = Reservoir pressure (psia)'],
        description: 'Maximum theoretical flow rate when Pwf = 0.',
        units: 'bopd',
      },
      {
        name: 'Composite IPR (subsaturated, PR > PB)',
        formula: 'q = PI×(PR−PB) + (PI×PB/1.8)×[1−0.2×(Pwf/PB)−0.8×(Pwf/PB)²]',
        variables: ['PB = Bubble point pressure (psia)', 'Pwf = Flowing BHP (psia)'],
        description:
          'Above bubble point: linear IPR. Below bubble point: Vogel. The composite form handles both regimes seamlessly.',
        units: 'bopd',
      },
    ],
  },
  {
    title: 'Nodal Analysis — VLP (Vertical Lift Performance)',
    icon: '📈',
    color: '#2E7D32',
    formulas: [
      {
        name: 'Bottomhole Pressure (BHP)',
        formula: 'BHP = WHP + ΔP_hydrostatic + ΔP_friction',
        variables: [
          'WHP = Wellhead pressure (psia)',
          'ΔP_hydrostatic = Hydrostatic head (psi)',
          'ΔP_friction = Friction pressure loss (psi)',
        ],
        description:
          'Total pressure the pump must overcome. At q=0 only hydrostatic head exists. As q increases friction rises.',
        units: 'psia',
      },
      {
        name: 'Hydrostatic Head',
        formula: 'ΔP_hyd = 0.052 × ρ_mix (lb/gal) × TVD (ft)',
        variables: [
          'ρ_mix = ρ_oil×(1−WC) + ρ_water×WC  (lb/gal)',
          'TVD = True vertical depth (ft)',
          'WC = Water cut fraction',
        ],
        description:
          'Dominant pressure component. Gas lift reduces ρ_mix by injecting gas, thereby reducing hydrostatic head.',
        units: 'psi',
      },
      {
        name: 'Gas Lift Density Reduction',
        formula: 'ρ_mix_eff = ρ_mix − 0.0012 × GLR_effective',
        variables: [
          'GLR_effective = GOR + qi_gas × 10⁶ / q_liquid',
          'qi_gas = Gas injection rate (MMscf/d)',
        ],
        description:
          'Higher gas injection rate → higher effective GLR → lighter mixture → lower hydrostatic head → higher production rate.',
        units: 'lb/gal',
      },
      {
        name: 'Operating Point (Nodal Intersection)',
        formula: 'Find q* : Vogel_Pwf(q*) = VLP_BHP(q*)',
        variables: ['Solved using scipy.optimize.brentq root-finding algorithm'],
        description:
          'The valid intersection of the IPR and VLP curves. This is the actual flow rate and bottomhole pressure the well will produce at.',
        units: 'bopd, psia',
      },
    ],
  },
  {
    title: 'Production Forecast',
    icon: '🔮',
    color: '#795548',
    formulas: [
      {
        name: 'Exponential Decline',
        formula: 'q(t) = qi × e^(−Di × t)',
        variables: [
          'qi = Initial production rate (bopd)',
          'Di = Decline rate (fraction/day)',
          't = Time (days)',
        ],
        description: 'Used in the 365-day forecast. Decline rate Di is calibrated during history matching.',
        units: 'bopd',
      },
      {
        name: 'Cumulative Production (Exponential)',
        formula: 'Np = (qi − q) / Di',
        variables: ['qi = Initial rate', 'q = Rate at time t', 'Di = Decline constant'],
        description: 'Cumulative production over the forecast window.',
        units: 'STB',
      },
      {
        name: 'P10/P50/P90 Uncertainty Bounds',
        formula: 'P10 = μ + 1.28σ,  P50 = μ,  P90 = μ − 1.28σ',
        variables: ['μ = Mean forecast (ensemble average)', 'σ = Standard deviation across ensemble members'],
        description:
          'EnKF ensemble produces a distribution of forecasts. P10 is optimistic (10% probability of exceeding), P90 is conservative.',
        units: 'bopd',
      },
    ],
  },
  {
    title: 'System Setup & Thresholds',
    icon: '⚙️',
    color: '#546E7A',
    formulas: [
      {
        name: 'Default Ensemble Size',
        formula: 'N_e = 50',
        variables: [],
        description: 'EnKF uses 50 ensemble members. Configurable via the Configuration tab.',
        units: 'members',
      },
      {
        name: 'Good Match Threshold',
        formula: 'MQ ≥ 75%  →  Good match',
        variables: [],
        description: 'Match Quality ≥ 75% indicates a reliable history match suitable for forecasting.',
        units: '%',
      },
      {
        name: 'Forecast Horizon',
        formula: 't_forecast = 365 days',
        variables: [],
        description: 'All OOIP remaining and cumulative production estimates use a 365-day horizon.',
        units: 'days',
      },
      {
        name: 'Unit System',
        formula: 'Oilfield: psi, ft, °F, acres, bbl, mD, cp',
        variables: [],
        description: 'XCAPE uses oilfield standard units throughout. Conversions: 1 bar ≈ 14.5 psi; 1 m ≈ 3.281 ft; °F = (°C × 9/5) + 32; 1 ha ≈ 2.471 acres.',
        units: 'oilfield',
      },
    ],
  },
]

export const FormulasDrawer: React.FC<FormulasDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 560 },
          backgroundColor: '#0A1628',
          color: '#E8EDF5',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          background: 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FunctionsIcon sx={{ color: '#DDBB75', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              Formulas & Metrics
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              XCAPE system reference — all oilfield units
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.8)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ overflowY: 'auto', flex: 1, pb: 4 }}>
        {formulaSections.map((section, sIdx) => (
          <Accordion
            key={sIdx}
            defaultExpanded={sIdx === 0}
            disableGutters
            sx={{
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: 20 }}>{section.icon}</Typography>
                <Typography sx={{ fontWeight: 600, color: '#E8EDF5', fontSize: '0.95rem' }}>
                  {section.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 2, pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.formulas.map((f, fIdx) => (
                  <Box
                    key={fIdx}
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${section.color}40`,
                      backgroundColor: `${section.color}12`,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Formula name + unit chip */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderBottom: `1px solid ${section.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#E8EDF5' }}>
                        {f.name}
                      </Typography>
                      {f.units && (
                        <Chip
                          label={f.units}
                          size="small"
                          sx={{
                            fontSize: '0.68rem',
                            height: 20,
                            backgroundColor: `${section.color}30`,
                            color: '#DDBB75',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {/* The formula itself */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Box
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.82rem',
                          color: '#DDBB75',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          mb: 1.5,
                          wordBreak: 'break-word',
                          lineHeight: 1.6,
                        }}
                      >
                        {f.formula}
                      </Box>

                      {/* Variables */}
                      {f.variables.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                          {f.variables.map((v, vIdx) => (
                            <Typography
                              key={vIdx}
                              variant="caption"
                              sx={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.7,
                                fontSize: '0.73rem',
                                '&::before': { content: '"· "', color: section.color },
                              }}
                            >
                              {v}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {/* Description */}
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '0.75rem',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}
                      >
                        {f.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2, mx: 3 }} />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.3)', px: 3 }}>
          XCAPE — Automated Reservoir History Matching & Nodal Analysis System
        </Typography>
      </Box>
    </Drawer>
  )
}
