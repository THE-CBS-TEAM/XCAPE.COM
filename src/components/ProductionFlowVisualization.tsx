import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Grid, useTheme, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Production3DVisualization from './Production3DVisualization'

interface FlowData {
  oil: number
  water: number
  gas: number
  pressure: number
}

interface ProductionFlowProps {
  priorData?: FlowData
  posteriorData?: FlowData
  title?: string
}

const formatProductionRate = (value: number, fluidType: 'oil' | 'water' | 'gas') => {
  const unit = fluidType === 'gas' ? 'scf/d' : 'STB/d'
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`
}

// Enhanced Realistic 3D Pipe Component with advanced visuals
const RealisticPipe: React.FC<{
  fluidType: 'oil' | 'water' | 'gas'
  volume: number
  pressure: number
  isDark: boolean
  yPosition: number
  flowRate?: number
}> = ({ fluidType, volume, pressure, isDark, yPosition, flowRate = 45 }) => {
  // Define realistic colors for each fluid type with gradients
  const fluidColors = {
    oil: { 
      primary: '#D4A574', 
      light: '#E8C9A0', 
      dark: '#8B6F47',
      gradient1: '#F4D4A8',
      gradient2: '#C4945C'
    },
    water: { 
      primary: '#64B5F6', 
      light: '#90CAF9', 
      dark: '#42A5F5',
      gradient1: '#81C4F9',
      gradient2: '#4A9FDD'
    },
    gas: { 
      primary: '#FFB74D', 
      light: '#FFD54F', 
      dark: '#FF9800',
      gradient1: '#FFC76D',
      gradient2: '#FF9A11'
    },
  }

  const colors = fluidColors[fluidType]
  
  // Scale volume for visualization
  const scaledVolume = Math.min(100, Math.max(20, volume))
  
  // Scale pressure for indicator
  const scaledPressure = Math.min(55, Math.max(10, (pressure / 300) * 55))
  
  // Calculate pipe dimensions
  const pipeWidth = 300
  const pipeHeight = scaledVolume / 2

  return (
    <g>
      {/* Pipe shadow for depth */}
      <defs>
        <linearGradient id={`pipeGradient-${fluidType}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.gradient1} stopOpacity={0.9} />
          <stop offset="50%" stopColor={colors.primary} stopOpacity={0.85} />
          <stop offset="100%" stopColor={colors.gradient2} stopOpacity={0.9} />
        </linearGradient>
        <filter id={`pipeShadow-${fluidType}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Left connector valve */}
      <g>
        <circle cx="40" cy={yPosition + pipeHeight / 2} r="8" fill="#666" opacity="0.8" />
        <circle cx="40" cy={yPosition + pipeHeight / 2} r="6" fill="#888" />
      </g>

      {/* Main flow pipe with gradient */}
      <rect
        x="50"
        y={yPosition}
        width={pipeWidth}
        height={pipeHeight}
        fill={`url(#pipeGradient-${fluidType})`}
        opacity={0.85}
        rx="6"
        filter={`url(#pipeShadow-${fluidType})`}
      />

      {/* Pipe inner highlight for 3D effect */}
      <rect
        x="50"
        y={yPosition}
        width={pipeWidth}
        height={pipeHeight / 3}
        fill="white"
        opacity={0.15}
        rx="6"
      />

      {/* Flowing particles - primary animation */}
      <g opacity={0.8}>
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`particle-${i}`}
            cx="100"
            cy={yPosition + pipeHeight / 2}
            r={4 + i}
            fill={colors.primary}
            opacity={0.9 - i * 0.15}
          >
            <animate
              attributeName="cx"
              from="50"
              to={50 + pipeWidth}
              dur={`${Math.max(2, 5 - flowRate / 20)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
            <animate
              attributeName="opacity"
              from={0.8}
              to={0.2}
              dur={`${Math.max(2, 5 - flowRate / 20)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
          </circle>
        ))}
      </g>

      {/* Turbulence/wave effect for dynamic feel */}
      <path
        d={`M 60 ${yPosition + pipeHeight} Q 150 ${yPosition + pipeHeight * 0.8}, 330 ${yPosition + pipeHeight}`}
        stroke={colors.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      >
        <animate
          attributeName="d"
          values={`M 60 ${yPosition + pipeHeight} Q 150 ${yPosition + pipeHeight * 0.8}, 330 ${yPosition + pipeHeight};
                   M 60 ${yPosition + pipeHeight} Q 150 ${yPosition + pipeHeight * 1.2}, 330 ${yPosition + pipeHeight};
                   M 60 ${yPosition + pipeHeight} Q 150 ${yPosition + pipeHeight * 0.8}, 330 ${yPosition + pipeHeight}`}
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* Right connector valve */}
      <g>
        <circle cx="360" cy={yPosition + pipeHeight / 2} r="8" fill="#666" opacity="0.8" />
        <circle cx="360" cy={yPosition + pipeHeight / 2} r="6" fill="#888" />
      </g>

      {/* Flow rate label above pipe */}
      <text
        x={50 + pipeWidth / 2}
        y={yPosition - 5}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={isDark ? '#aaa' : '#666'}
      >
        Flow: {formatProductionRate(flowRate, fluidType)}
      </text>

      {/* Pressure gauge container */}
      <g>
        {/* Gauge background */}
        <rect
          x="370"
          y={yPosition}
          width="35"
          height="60"
          fill={isDark ? '#2a2a2a' : '#f0f0f0'}
          stroke={isDark ? '#555' : '#ccc'}
          strokeWidth="2"
          rx="4"
        />

        {/* Pressure scale markings */}
        {[0, 20, 40, 60].map((mark) => (
          <line
            key={`mark-${mark}`}
            x1="370"
            y1={yPosition + mark}
            x2="368"
            y2={yPosition + mark}
            stroke={isDark ? '#666' : '#bbb'}
            strokeWidth="1"
          />
        ))}

        {/* Pressure fill (liquid level style) */}
        <rect
          x="372"
          y={yPosition + (60 - scaledPressure)}
          width="31"
          height={scaledPressure}
          fill={`url(#pipeGradient-${fluidType})`}
          opacity={0.7}
          rx="2"
        >
          <animate
            attributeName="height"
            values={`${scaledPressure * 0.95};${scaledPressure};${scaledPressure * 0.95}`}
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Pressure needle */}
        <line
          x1="387"
          y1={yPosition + 60}
          x2="387"
          y2={yPosition + (60 - scaledPressure) + 3}
          stroke={colors.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Gauge label */}
        <text
          x="387"
          y={yPosition + 75}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill={isDark ? '#aaa' : '#666'}
        >
          {pressure.toFixed(0)} psi
        </text>
      </g>
    </g>
  )
}

const ProductionFlowVisualization: React.FC<ProductionFlowProps> = ({
  priorData,
  posteriorData,
  title = '⚡ Production Flow Visualization',
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [visualizationMode, setVisualizationMode] = useState<'2d' | '3d'>('2d')

  // Default data if not provided
  const prior: FlowData = priorData || {
    oil: 45,
    water: 65,
    gas: 80,
    pressure: 150,
  }

  const posterior: FlowData = posteriorData || {
    oil: 65,
    water: 45,
    gas: 85,
    pressure: 180,
  }

  const bgColor = isDark ? '#1a2332' : '#f8f9fa'
  const borderColor = isDark ? 'rgba(15, 76, 129, 0.3)' : 'rgba(15, 76, 129, 0.15)'
  const textColor = isDark ? '#ccc' : '#333'
  const labelColor = isDark ? '#aaa' : '#666'

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F4C81' }}>
          {title}
        </Typography>
        <ToggleButtonGroup
          value={visualizationMode}
          exclusive
          onChange={(_, newMode) => newMode && setVisualizationMode(newMode)}
          size="small"
          sx={{
            backgroundColor: isDark ? 'rgba(15, 76, 129, 0.1)' : 'rgba(15, 76, 129, 0.05)',
            border: '1px solid rgba(15, 76, 129, 0.3)',
            borderRadius: '8px',
          }}
        >
          <ToggleButton
            value="2d"
            sx={{
              color: ':#0F4C81',
              '&.Mui-selected': {
                backgroundColor: '#0F4C81',
                color: 'white',
              },
            }}
          >
            📊 2D View
          </ToggleButton>
          <ToggleButton
            value="3d"
            sx={{
              color: '#0F4C81',
              '&.Mui-selected': {
                backgroundColor: '#0F4C81',
                color: 'white',
              },
            }}
          >
            🎯 3D View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {visualizationMode === '3d' ? (
        // 3D Views
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '12px',
                border: '2px solid #0F4C81',
                overflow: 'hidden',
                height: '600px',
              }}
            >
              <CardContent sx={{ p: 0, height: '100%' }}>
                <Production3DVisualization
                  priorData={prior}
                  posteriorData={posterior}
                  showPrior={true}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '12px',
                border: '2px solid #28a745',
                overflow: 'hidden',
                height: '600px',
              }}
            >
              <CardContent sx={{ p: 0, height: '100%' }}>
                <Production3DVisualization
                  priorData={prior}
                  posteriorData={posterior}
                  showPrior={false}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // 2D Views
        <Grid container spacing={3}>
        {/* Prior Forecast */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: isDark ? 'rgba(15, 76, 129, 0.1)' : '#E3F2FD',
              border: '2px solid #0F4C81',
              borderRadius: '12px',
              height: '100%',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#0F4C81',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                📊 Prior Forecast
              </Typography>

              <Box
                sx={{
                  backgroundColor: bgColor,
                  borderRadius: '8px',
                  padding: '16px',
                  border: `1px solid ${borderColor}`,
                  minHeight: '380px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                }}
              >
                <svg width="430" height="360" viewBox="0 0 430 360" style={{ maxWidth: '100%' }}>
                  {/* Background */}
                  <rect width="430" height="360" fill="transparent" />

                  {/* Title */}
                  <text
                    x="215"
                    y="25"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={textColor}
                  >
                    Initial Model State
                  </text>

                  {/* Pipes */}
                  <RealisticPipe
                    fluidType="oil"
                    volume={prior.oil}
                    pressure={prior.pressure}
                    isDark={isDark}
                    yPosition={50}
                    flowRate={prior.oil}
                  />
                  <RealisticPipe
                    fluidType="water"
                    volume={prior.water}
                    pressure={prior.pressure}
                    isDark={isDark}
                    yPosition={150}
                    flowRate={prior.water}
                  />
                  <RealisticPipe
                    fluidType="gas"
                    volume={prior.gas}
                    pressure={prior.pressure}
                    isDark={isDark}
                    yPosition={250}
                    flowRate={prior.gas}
                  />

                  {/* Left side labels */}
                  <text x="15" y="90" fontSize="12" fontWeight="600" fill={textColor}>
                    Oil
                  </text>
                  <text x="10" y="190" fontSize="12" fontWeight="600" fill={textColor}>
                    Water
                  </text>
                  <text x="15" y="290" fontSize="12" fontWeight="600" fill={textColor}>
                    Gas
                  </text>
                </svg>
              </Box>

              {/* Metric details */}
              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(212, 165, 116, 0.1)' : '#FFF3E0',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Oil
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#D4A574' }}>
                    {formatProductionRate(prior.oil, 'oil')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : '#E1F5FE',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Water
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#64B5F6' }}>
                    {formatProductionRate(prior.water, 'water')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(255, 180, 77, 0.1)' : '#FFF8E1',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Gas
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#FFB74D' }}>
                    {formatProductionRate(prior.gas, 'gas')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Posterior Forecast */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: isDark ? 'rgba(40, 167, 69, 0.1)' : '#E8F5E9',
              border: '2px solid #28a745',
              borderRadius: '12px',
              height: '100%',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#28a745',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                ✓ Posterior Forecast (After Calibration)
              </Typography>

              <Box
                sx={{
                  backgroundColor: bgColor,
                  borderRadius: '8px',
                  padding: '16px',
                  border: `1px solid ${borderColor}`,
                  minHeight: '380px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'auto',
                }}
              >
                <svg width="430" height="360" viewBox="0 0 430 360" style={{ maxWidth: '100%' }}>
                  {/* Background */}
                  <rect width="430" height="360" fill="transparent" />

                  {/* Title */}
                  <text
                    x="215"
                    y="25"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={textColor}
                  >
                    Calibrated Model State
                  </text>

                  {/* Pipes */}
                  <RealisticPipe
                    fluidType="oil"
                    volume={posterior.oil}
                    pressure={posterior.pressure}
                    isDark={isDark}
                    yPosition={50}
                    flowRate={posterior.oil}
                  />
                  <RealisticPipe
                    fluidType="water"
                    volume={posterior.water}
                    pressure={posterior.pressure}
                    isDark={isDark}
                    yPosition={150}
                    flowRate={posterior.water}
                  />
                  <RealisticPipe
                    fluidType="gas"
                    volume={posterior.gas}
                    pressure={posterior.pressure}
                    isDark={isDark}
                    yPosition={250}
                    flowRate={posterior.gas}
                  />

                  {/* Left side labels */}
                  <text x="15" y="90" fontSize="12" fontWeight="600" fill={textColor}>
                    Oil
                  </text>
                  <text x="10" y="190" fontSize="12" fontWeight="600" fill={textColor}>
                    Water
                  </text>
                  <text x="15" y="290" fontSize="12" fontWeight="600" fill={textColor}>
                    Gas
                  </text>
                </svg>
              </Box>

              {/* Metric details */}
              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(212, 165, 116, 0.1)' : '#FFF3E0',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Oil
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#D4A574' }}>
                    {formatProductionRate(posterior.oil, 'oil')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : '#E1F5FE',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Water
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#64B5F6' }}>
                    {formatProductionRate(posterior.water, 'water')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: isDark ? 'rgba(255, 180, 77, 0.1)' : '#FFF8E1',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: labelColor }}>
                    Gas
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#FFB74D' }}>
                    {formatProductionRate(posterior.gas, 'gas')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}

      {/* Educational footer */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: isDark ? 'rgba(15, 76, 129, 0.1)' : '#E3F2FD',
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
        }}
      >
        <Typography variant="body2" sx={{ color: textColor }}>
          <strong>💡 How to Read This:</strong> Values show production rates, not percentages: oil and water are in STB/d, gas is in Mscf/d.
          Since these are different units, they should not be expected to add up to 100%.
          Flow particles travel through the pipes at speeds proportional to flow rates. The pressure gauge shows reservoir pressure.
          Left shows initial model, right shows calibrated model after matching production data. Notice how fluid distributions change!
        </Typography>
      </Box>
    </Box>
  )
}

export default ProductionFlowVisualization
