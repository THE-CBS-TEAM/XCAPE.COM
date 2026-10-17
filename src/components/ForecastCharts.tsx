import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Box, Typography, Card, Alert, useTheme } from '@mui/material'

interface ForecastProps {
  forecast: any
  metric?: string
  title?: string
  forecastType?: 'prior' | 'posterior'
}

interface ChartDataPoint {
  day: number
  [key: string]: any
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: isDark ? '#0F172A' : 'rgba(255, 255, 255, 0.95)',
          border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.6)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ color: entry.color, fontWeight: 600, marginBottom: '4px' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </div>
        ))}
        <div style={{ 
          fontSize: '11px', 
          color: isDark ? '#94A3B8' : '#666', 
          marginTop: '8px', 
          fontStyle: 'italic' 
        }}>
          🔍 Wider bands = more uncertainty
        </div>
      </Box>
    )
  }
  return null
}

const ForecastCharts: React.FC<ForecastProps> = ({ forecast, metric = 'oil', title, forecastType = 'prior' }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  if (!forecast) return null

  const preds = forecast.predictions || {}
  const metricData = preds[metric] || {}
  const timeAxis = forecast.time_axis || {}
  const days = timeAxis.days || Array.from({ length: 50 }, (_, i) => i + 1)

  // Build series with mean, P10, P50, P90
  const series: ChartDataPoint[] = days.map((d: number | string, i: number) => ({
    day: typeof d === 'number' ? d : parseInt(d),
    'P10': metricData.p10?.[i] ?? null,
    'P50': metricData.p50?.[i] ?? null,
    'P90': metricData.p90?.[i] ?? null,
    'Mean': metricData.mean?.[i] ?? null,
  }))

  // Metric labels
  const metricLabels: { [key: string]: string } = {
    oil: 'Oil Production (barrels)',
    water: 'Water Production (barrels)',
    gas: 'Gas Production (mcf)',
    pressure: 'Reservoir Pressure (psi)',
  }

  // Educational descriptions
  const educationInfo: { [key: string]: { description: string; meaning: string } } = {
    prior: {
      description: 'Forecast based on initial reservoir assumptions (before data matching)',
      meaning: 'Shows what we predicted before using historical production data to refine our model',
    },
    posterior: {
      description: 'Forecast after calibration with historical production data (after EnKF matching)',
      meaning: 'Shows improved predictions after the model has been calibrated to match observed production',
    },
  }

  const info = educationInfo[forecastType]
  const isPosteriror = forecastType === 'posterior'
  const colorScheme = isPosteriror ? { primary: '#28a745', light: '#d4edda' } : { primary: '#0F4C81', light: '#e7f3ff' }

  // Chart colors for dark mode
  const chartBgColor = isDark ? 'rgba(26, 35, 50, 0.8)' : '#f8f9fa'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#d0d0d0'
  const axisColor = isDark ? '#888' : '#666'
  const textColor = isDark ? '#ccc' : '#333'

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Educational Context */}
      <Card
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: isDark ? 'rgba(15, 76, 129, 0.15)' : colorScheme.light,
          border: `2px solid ${colorScheme.primary}`,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: colorScheme.primary, mb: 0.5 }}>
          📚 What is {forecastType === 'prior' ? 'Prior' : 'Posterior'} Forecast?
        </Typography>
        <Typography sx={{ fontSize: '13px', color: isDark ? '#ccc' : '#333', mb: 1 }}>
          {info.description}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: isDark ? '#aaa' : '#666', fontStyle: 'italic' }}>
          💡 {info.meaning}
        </Typography>
      </Card>

      {/* Chart Title */}
      {title && (
        <Typography
          sx={{
            marginBottom: 1.5,
            fontWeight: 700,
            fontSize: '15px',
            color: colorScheme.primary,
          }}
        >
          {title}
        </Typography>
      )}

      {/* Main Chart */}
      <Box sx={{
        width: '100%',
        height: 400,
        backgroundColor: chartBgColor,
        borderRadius: '8px',
        padding: '16px',
        border: `1px solid ${isDark ? 'rgba(15, 76, 129, 0.3)' : 'rgba(15, 76, 129, 0.15)'}`,
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={series}
            margin={{ top: 12, right: 32, left: 0, bottom: 32 }}
          >
            <defs>
              <linearGradient id={`colorP10-${forecastType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`colorP90-${forecastType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorScheme.primary} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colorScheme.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="day"
              stroke={axisColor}
              tick={{ fontSize: 12, fill: axisColor }}
              label={{ value: 'Days into Forecast', position: 'insideBottomRight', offset: -10, fill: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fontSize: 12, fill: axisColor }}
              label={{ value: metricLabels[metric], angle: -90, position: 'insideLeft', fill: axisColor }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: textColor }}
              iconType="line"
              formatter={(value) => {
                const explanations: { [key: string]: string } = {
                  'P10 (Low)': 'P10: 10% chance production will be lower',
                  'P50 (Median)': 'P50: Most likely outcome (median)',
                  'P90 (High)': 'P90: 10% chance production will be higher',
                  'Mean': 'Mean: Average of all scenarios',
                }
                return explanations[value] || value
              }}
            />
            {/* Uncertainty band - P10 to P90 */}
            <Area
              type="monotone"
              dataKey="P90"
              stroke={colorScheme.primary}
              fill={`url(#colorP90-${forecastType})`}
              name="P90 (High)"
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="P10"
              stroke="#FF6B6B"
              fill={`url(#colorP10-${forecastType})`}
              name="P10 (Low)"
              isAnimationActive={true}
            />
            {/* Central tendency */}
            <Line
              type="monotone"
              dataKey="P50"
              stroke={colorScheme.primary}
              strokeWidth={3}
              dot={false}
              name="P50 (Median)"
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="Mean"
              stroke="#FF9500"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Mean"
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Educational Footer */}
      <Alert severity="info" sx={{ mt: 2, fontSize: '12px', 
        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.08)' : '#E3F2FD',
        color: isDark ? '#F8FAFC' : '#0F4C81',
        border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : 'none',
        '& .MuiAlert-icon': { color: isDark ? '#38BDF8' : '#0F4C81' }
      }}>
        <strong>📊 Understanding the Chart:</strong> The shaded area shows the range of possible outcomes (from P10 to P90).
        The thick line (P50) represents the most likely scenario. 
        {isPosteriror && ' The posterior forecast is typically narrower because the model is now calibrated to match observed data.'}
      </Alert>
    </Box>
  )
}

export default ForecastCharts
