import React, { useEffect, useRef, useState } from 'react'
import { Box, Container, Typography, Button, Grid, Chip, useTheme } from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Settings as SettingsIcon,
  Insights as InsightsIcon,
  Tune as TuneIcon,
  Autorenew as AutorenewIcon,
  LocalGasStation as GasIcon,
  TrendingUp as TrendingUpIcon,
  CloudUpload as CloudUploadIcon,
  DeviceHub as DeviceHubIcon,
  Sync as SyncIcon,
  ShowChart as ShowChartIcon,
  AutoFixHigh as AutoFixHighIcon,
  BarChart as BarChartIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  ArrowOutward as ArrowOutwardIcon,
  WaterDrop as WaterDropIcon,
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

/* ================================================================== */
/*  Theme-adaptive Palette (Dark / Light blend support)               */
/* ================================================================== */
const useHomeTheme = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return {
    theme,
    isDark,
    BG: isDark ? '#04090F' : '#F8FAFC',
    BG_ALT: isDark ? '#061019' : '#FFFFFF',
    CARD_BG: isDark ? 'rgba(6, 16, 25, 0.75)' : '#FFFFFF',
    TEXT: isDark ? 'rgba(255,255,255,0.92)' : '#0F172A',
    TEXT_DIM: isDark ? 'rgba(255,255,255,0.68)' : '#334155',
    TEXT_DIMMER: isDark ? 'rgba(255,255,255,0.45)' : '#64748B',
    LINE: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.09)',
    GOLD: isDark ? '#F4B400' : '#D97706',
    GOLD_LIGHT: isDark ? '#FFD873' : '#F59E0B',
    TEAL: isDark ? '#1F7A8C' : '#0D9488',
    NAVY: isDark ? '#0F4C81' : '#1D4ED8',
  }
}

/* ================================================================== */
/*  Real petroleum field imagery (Pexels / Unsplash, verified)        */
/* ================================================================== */
const IMG = {
  offshore:
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
  offshoreAlt:
    'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1600',
  pumpjack:
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1600&q=80',
  refinery:
    'https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1600',
  drilling:
    'https://images.pexels.com/photos/414936/pexels-photo-414936.jpeg?auto=compress&cs=tinysrgb&w=1600',
  pipeline:
    'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=1600',
  earth:
    'https://images.pexels.com/photos/35224901/pexels-photo-35224901.jpeg?auto=compress&cs=tinysrgb&w=1600',
  industrial:
    'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1600',
}

/* ================================================================== */
/*  Scroll reveal                                                      */
/* ================================================================== */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; y?: number; sx?: any }> = ({
  children,
  delay = 0,
  y = 40,
  sx,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Box
      ref={ref}
      sx={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity .9s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

/* ================================================================== */
/*  Animated counter                                                   */
/* ================================================================== */
const CountUp: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 2000,
}) => {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration])
  return (
    <>
      {v}
      {suffix}
    </>
  )
}

/* ================================================================== */
/*  Section heading                                                    */
/* ================================================================== */
const SectionHeading: React.FC<{
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
}> = ({ eyebrow, title, subtitle, align = 'center' }) => {
  const { TEXT, TEXT_DIM, GOLD } = useHomeTheme()
  return (
  <Box
    sx={{
      textAlign: align,
      maxWidth: 860,
      mx: align === 'center' ? 'auto' : 0,
      mb: { xs: 6, md: 8 },
    }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        mb: 2.5,
        px: 1.5,
        py: 0.6,
        borderRadius: 99,
        border: `1px solid rgba(244,180,0,0.28)`,
        backgroundColor: 'rgba(244,180,0,0.06)',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
      <Typography
        sx={{
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          color: GOLD,
          fontFamily: 'ui-monospace, "SF Mono", monospace',
        }}
      >
        {eyebrow}
      </Typography>
    </Box>
    <Typography
      component="h2"
      sx={{
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: TEXT,
        fontSize: { xs: '2rem', md: '3rem' },
        lineHeight: 1.08,
        mb: subtitle ? 2 : 0,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.75, color: TEXT_DIM }}>
        {subtitle}
      </Typography>
    )}
  </Box>
  )
}

/* ================================================================== */
/*  Scroll progress bar                                                */
/* ================================================================== */
const ScrollProgress: React.FC = () => {
  const { GOLD, GOLD_LIGHT, TEAL } = useHomeTheme()
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setP(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${TEAL})`,
          boxShadow: `0 0 14px ${GOLD}`,
          transition: 'width 60ms linear',
        }}
      />
    </Box>
  )
}

/* ================================================================== */
/*  Live telemetry widget — floating in the hero                       */
/* ================================================================== */
const TelemetryCard: React.FC = () => {
  const { isDark, TEXT, TEXT_DIM, TEXT_DIMMER, LINE, GOLD, GOLD_LIGHT, TEAL } = useHomeTheme()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200)
    return () => clearInterval(id)
  }, [])

  const oil = [2340, 2412, 2388, 2450, 2420]
  const wc = [18.4, 18.1, 17.9, 17.6, 17.4]
  const oilRate = oil[tick % oil.length].toLocaleString()
  const waterCut = wc[tick % wc.length].toFixed(1)

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        p: 2.5,
        background: isDark
          ? 'linear-gradient(160deg, rgba(15,76,129,0.55) 0%, rgba(4,9,15,0.85) 100%)'
          : 'linear-gradient(160deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${LINE}`,
        boxShadow: isDark
          ? '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 20px 45px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4ADE80',
              boxShadow: '0 0 10px #4ADE80',
              animation: 'pulse 1.6s ease-in-out infinite',
              '@keyframes pulse': {
                '0%,100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: TEXT,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            XCAPE · RUN #1047
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.62rem',
            color: GOLD,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          LIVE
        </Typography>
      </Box>

      {/* Mini chart */}
      <Box
        component="svg"
        viewBox="0 0 320 90"
        sx={{ width: '100%', height: 90, mb: 2, display: 'block' }}
      >
        <defs>
          <linearGradient id="tel-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0,70 L 20,60 L 40,52 L 60,44 L 80,42 L 100,45 L 120,50 L 140,58 L 160,64 L 180,66 L 200,63 L 220,58 L 240,52 L 260,48 L 280,46 L 300,50 L 320,54 L 320,90 L 0,90 Z"
          fill="url(#tel-grad)"
        />
        <path
          d="M 0,70 L 20,60 L 40,52 L 60,44 L 80,42 L 100,45 L 120,50 L 140,58 L 160,64 L 180,66 L 200,63 L 220,58 L 240,52 L 260,48 L 280,46 L 300,50 L 320,54"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="320" cy="54" r="3" fill={GOLD_LIGHT} />
      </Box>

      {/* KPIs */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: `1px solid ${LINE}`,
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <GasIcon sx={{ fontSize: 12, color: GOLD }} />
              <Typography sx={{ fontSize: '0.6rem', color: TEXT_DIMMER, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase' }}>
                Oil Rate
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: TEXT,
                fontFamily: 'ui-monospace, monospace',
                lineHeight: 1,
              }}
            >
              {oilRate}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: TEXT_DIMMER, mt: 0.3 }}>bbl/d</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: `1px solid ${LINE}`,
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <WaterDropIcon sx={{ fontSize: 12, color: TEAL }} />
              <Typography sx={{ fontSize: '0.6rem', color: TEXT_DIMMER, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase' }}>
                Water Cut
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: TEXT,
                fontFamily: 'ui-monospace, monospace',
                lineHeight: 1,
              }}
            >
              {waterCut}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: TEXT_DIMMER, mt: 0.3 }}>%</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Progress */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography sx={{ fontSize: '0.65rem', color: TEXT_DIM, letterSpacing: 0.5, fontWeight: 700 }}>
            EnKF Iteration
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: GOLD, fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}>
            4 / 6
          </Typography>
        </Box>
        <Box
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '66%',
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
              boxShadow: `0 0 10px ${GOLD}`,
            }}
          />
        </Box>
      </Box>

      <Typography sx={{ fontSize: '0.65rem', color: TEXT_DIMMER, fontFamily: 'ui-monospace, monospace' }}>
        Posterior ensemble · 100 members
      </Typography>
    </Box>
  )
}

/* ================================================================== */
/*  Animated production plot (history match)                          */
/* ================================================================== */
const ProductionChart: React.FC = () => {
  const { isDark, TEXT_DIM, TEXT_DIMMER, LINE, GOLD, TEAL } = useHomeTheme()
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Simulated curve control points (a real decline-then-flatten pattern)
  const line =
    'M 30,180 C 70,120 110,80 160,70 C 210,62 250,80 300,105 C 340,125 380,140 430,148 C 460,152 480,154 500,155'
  const upper =
    'M 30,175 C 70,110 110,68 160,56 C 210,48 250,68 300,95 C 340,116 380,132 430,142 C 460,147 480,150 500,151'
  const lower =
    'M 30,188 C 70,135 110,95 160,86 C 210,78 250,95 300,118 C 340,136 380,150 430,157 C 460,160 480,162 500,163'

  const observed: [number, number][] = [
    [30, 180], [80, 128], [130, 90], [180, 74],
    [230, 78], [280, 98], [330, 122], [380, 140],
    [430, 150], [480, 156],
  ]

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        background: isDark
          ? 'linear-gradient(160deg, rgba(10,27,43,0.9) 0%, rgba(4,9,15,0.95) 100%)'
          : '#FFFFFF',
        border: `1px solid ${LINE}`,
        boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 20px 45px rgba(15,23,42,0.06)', 
      }}
    >
      {/* Header strip */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: GOLD,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            History Match · Well A-07
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: TEXT_DIMMER, mt: 0.3 }}>
            Observed vs. simulated oil rate — 5 years
          </Typography>
        </Box>
        <Chip
          label="CONVERGED"
          size="small"
          sx={{
            fontSize: '0.6rem',
            fontWeight: 800,
            letterSpacing: 1,
            color: '#4ADE80',
            bgcolor: 'rgba(74,222,128,0.12)',
            border: '1px solid rgba(74,222,128,0.35)',
            height: 22,
            fontFamily: 'ui-monospace, monospace',
          }}
        />
      </Box>

      {/* Chart */}
      <Box component="svg" viewBox="0 0 540 220" sx={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="pc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.28" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[40, 90, 140, 190].map((y) => (
          <line key={y} x1="20" x2="520" y1={y} y2={y} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)"} strokeWidth="1" />
        ))}

        {/* Uncertainty envelope */}
        <path
          d={`${upper} L 500,163 ${lower.split('M')[1] ? '' : ''}`}
          fill="rgba(244,180,0,0.12)"
          style={{
            opacity: drawn ? 1 : 0,
            transition: 'opacity 1.5s ease-out .8s',
          }}
        />
        {/* Envelope boundaries */}
        <path d={upper} fill="none" stroke="rgba(244,180,0,0.35)" strokeWidth="1" strokeDasharray="3,4" style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1.5s ease-out 1s' }} />
        <path d={lower} fill="none" stroke="rgba(244,180,0,0.35)" strokeWidth="1" strokeDasharray="3,4" style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1.5s ease-out 1s' }} />

        {/* Area under curve */}
        <path
          d={`${line} L 500,220 L 30,220 Z`}
          fill="url(#pc-fill)"
          style={{ opacity: drawn ? 1 : 0, transition: 'opacity 1.2s ease-out 1.4s' }}
        />

        {/* Simulated line */}
        <path
          d={line}
          fill="none"
          stroke={GOLD}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: drawn ? 0 : 1200,
            transition: 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) .3s',
          }}
        />

        {/* Observed data points */}
        {observed.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3.2"
            fill="#0A1B2B"
            stroke={TEAL}
            strokeWidth="2"
            style={{
              opacity: drawn ? 1 : 0,
              transition: `opacity .5s ease-out ${1.6 + i * 0.06}s`,
            }}
          />
        ))}

        {/* Axis labels */}
        {['Y1', 'Y2', 'Y3', 'Y4', 'Y5'].map((y, i) => (
          <text key={y} x={80 + i * 100} y={214} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
            {y}
          </text>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2.5, mt: 2, pt: 2, borderTop: `1px solid ${LINE}`, flexWrap: 'wrap' }}>
        {[
          { c: GOLD, label: 'Simulated' },
          { c: TEAL, label: 'Observed' },
          { c: 'rgba(244,180,0,0.5)', label: 'Uncertainty' },
        ].map((l) => (
          <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: l.c }} />
            <Typography sx={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 600 }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

/* ================================================================== */
/*  Backend Render instance ping (wake up sleeping instance)           */
/* ================================================================== */
const BACKEND_RENDER_URL = 'https://xcape-backend-com.onrender.com'

/* ================================================================== */
/*  Home page                                                          */
/* ================================================================== */
const HomePage: React.FC = () => {
  const { isDark, BG, BG_ALT, TEXT, TEXT_DIM, TEXT_DIMMER, LINE, GOLD, GOLD_LIGHT, TEAL, NAVY } = useHomeTheme()
  const navigate = useNavigate()

  useEffect(() => {
    // Ping backend on render to wake up the server instance if sleeping
    const endpoints = [
      `${BACKEND_RENDER_URL}/`,
      `${BACKEND_RENDER_URL}/health`,
      `${BACKEND_RENDER_URL}/api/health`,
    ]
    endpoints.forEach((url) => {
      fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
      }).catch(() => {})
    })
  }, [])

  const concepts = [
    {
      title: 'Reservoir Simulation',
      tag: 'Modelling',
      description:
        'Numerical models that solve the flow equations governing multiphase fluid movement through porous media — the engine behind every production forecast.',
      icon: <SettingsIcon fontSize="small" />,
      image: IMG.pumpjack,
      span: 8,
      h: 540,
    },
    {
      title: 'History Matching',
      tag: 'Calibration',
      description:
        'Calibrating uncertain parameters so simulated performance reproduces observed production and pressure history.',
      icon: <InsightsIcon fontSize="small" />,
      image: IMG.refinery,
      span: 4,
      h: 540,
    },
    {
      title: 'Sensitivity Analysis',
      tag: 'Optimisation',
      description:
        'Quantifying how each uncertain parameter drives model output — screening the variables that matter most.',
      icon: <TuneIcon fontSize="small" />,
      image: IMG.pipeline,
      span: 4,
      h: 440,
    },
    {
      title: 'Multi-Algorithm Data Assimilation',
      tag: 'Data Assimilation',
      description:
        'Global and sequential assimilation engines (ES-MDA, EnKF, and custom equation smoothers) that calibrate ensembles against historical data — delivering calibrated models with quantified uncertainty envelopes.',
      icon: <AutorenewIcon fontSize="small" />,
      image: IMG.industrial,
      span: 8,
      h: 440,
    },
    {
      title: 'Gas Lift Well',
      tag: 'Production',
      description:
        'Artificial-lift optimisation: injecting gas down the annulus to lighten the fluid column and unlock additional oil production.',
      icon: <GasIcon fontSize="small" />,
      image: IMG.offshore,
      span: 6,
      h: 420,
    },
    {
      title: 'Forecasting',
      tag: 'Prediction',
      description:
        'Running calibrated ensembles forward under multiple operating scenarios to predict recovery and bracket uncertainty.',
      icon: <TrendingUpIcon fontSize="small" />,
      image: IMG.earth,
      span: 6,
      h: 420,
    },
  ]

  const workflow = [
    {
      n: '01',
      title: 'Load Field Data',
      desc: 'Import production history, well trajectories, PVT data and static model decks into one versioned workspace.',
      icon: <CloudUploadIcon />,
    },
    {
      n: '02',
      title: 'Configure the Ensemble',
      desc: 'Define uncertain parameters and priors, then generate the initial ensemble of reservoir realisations.',
      icon: <DeviceHubIcon />,
    },
    {
      n: '03',
      title: 'Calibrate with ES-MDA & EnKF',
      desc: 'Assimilate historical production data across multiple iterations — automatically calibrating the ensemble while avoiding model collapse.',
      icon: <SyncIcon />,
    },
    {
      n: '04',
      title: 'Forecast & Decide',
      desc: 'Push the calibrated ensemble through operating scenarios to quantify recovery and uncertainty.',
      icon: <ShowChartIcon />,
    },
  ]

  const features = [
    { title: 'Automated Multi-Algorithm Matching', desc: 'ES-MDA and EnKF parameter estimation removes weeks of manual trial-and-error.', icon: <AutoFixHighIcon /> },
    { title: 'Real-time Visualisation', desc: 'Interactive production charts, uncertainty bands and ensemble diagnostics.', icon: <BarChartIcon /> },
    { title: 'Educational Focus', desc: 'Transparent methods, guided workflows, fully reproducible runs.', icon: <SchoolIcon /> },
    { title: 'Open Source', desc: 'Powered by OPM Flow and open, inspectable, extensible tooling.', icon: <CodeIcon /> },
  ]

  const stats = [
    { end: 6, suffix: '', label: 'Integrated Modules' },
    { end: 100, suffix: '+', label: 'Ensemble Members' },
    { end: 4, suffix: '×', label: 'Faster Iterations' },
    { end: 100, suffix: '%', label: 'Open Source' },
  ]

  const gallery = [
    { img: IMG.offshore, title: 'Offshore Platforms', sub: 'Deepwater production' },
    { img: IMG.pumpjack, title: 'Land Operations', sub: 'Pump jacks & beam pumps' },
    { img: IMG.refinery, title: 'Refining & Processing', sub: 'Upstream to downstream' },
    { img: IMG.drilling, title: 'Drilling & Completion', sub: 'Well construction' },
  ]

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: BG,
        color: TEXT,
        overflowX: 'hidden',
        fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
        '& *::selection': { backgroundColor: 'rgba(244,180,0,0.35)' },
        // scrollbar
        '&::-webkit-scrollbar': { width: 10 },
        '&::-webkit-scrollbar-track': { background: BG },
        '&::-webkit-scrollbar-thumb': { background: isDark ? '#0F4C81' : '#94A3B8', borderRadius: 10 },
      }}
    >
      <ScrollProgress />

      {/* ============================================================ */}
      {/* HERO — split layout with floating telemetry                   */}
      {/* ============================================================ */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          '@keyframes heroUp': {
            from: { opacity: 0, transform: 'translateY(24px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes bounceDown': {
            '0%,100%': { transform: 'translateY(0)', opacity: 0.5 },
            '50%': { transform: 'translateY(10px)', opacity: 1 },
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        }}
      >
        {/* Video */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          poster={IMG.offshore}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            transform: 'scale(1.03)',
            filter: isDark ? 'saturate(1.08) brightness(0.92) contrast(1.02)' : 'saturate(1.05) brightness(1.02) contrast(0.96)',
          }}
        >
          <source src="/Offshore_Rig_Video_Generation (1).mp4" type="video/mp4" />
        </Box>

        {/* Cinematic gradients - reduced opacity so offshore rig video is vivid and clearly visible */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: isDark
              ? `linear-gradient(105deg,
                  rgba(4,9,15,0.68) 0%,
                  rgba(4,9,15,0.42) 38%,
                  rgba(15,76,129,0.22) 68%,
                  rgba(4,9,15,0.60) 100%)`
              : `linear-gradient(105deg,
                  rgba(248,250,252,0.88) 0%,
                  rgba(248,250,252,0.70) 38%,
                  rgba(224,242,254,0.55) 68%,
                  rgba(248,250,252,0.90) 100%)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: `radial-gradient(circle at 12% 20%, rgba(244,180,0,0.12) 0%, transparent 45%),
                         radial-gradient(circle at 88% 82%, rgba(31,122,140,0.16) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Engineering grid */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            opacity: 0.14,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '88px 88px',
            maskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        {/* Grain overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            opacity: 0.07,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bottom fade into next section */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            zIndex: 1,
            background: `linear-gradient(180deg, transparent 0%, ${BG} 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 12, md: 10 } }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            {/* Left */}
            <Grid item xs={12} lg={7}>


              {/* Headline */}
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.98,
                  fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.9rem', lg: '5.4rem' },
                  mb: 3,
                  animation: 'heroUp .8s ease-out .1s both',
                }}
              >
                Reservoir History
                <br />
                Matching,{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(100deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, ${GOLD} 100%)`,
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 4s linear infinite',
                  }}
                >
                  Automated.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: TEXT_DIM,
                  fontSize: { xs: '1rem', md: '1.18rem' },
                  lineHeight: 1.7,
                  maxWidth: 620,
                  mb: 5,
                  animation: 'heroUp .8s ease-out .2s both',
                }}
              >
                Turn field data into calibrated models, quantified uncertainty, and
                confident production forecasts, engineered for both academic research and
                real-world independent field development, powered by OPM Flow and an extensible Multi-Algorithm Data Assimilation Suite (ES-MDA, EnKF, and dynamic equation smoothers).
              </Typography>

              {/* CTAs */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 6,
                  animation: 'heroUp .8s ease-out .3s both',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/simulator')}
                  sx={{
                    backgroundColor: GOLD,
                    color: BG,
                    fontWeight: 800,
                    px: 4,
                    py: 1.7,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 14px 40px rgba(244,180,0,0.32)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      backgroundColor: GOLD_LIGHT,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 48px rgba(244,180,0,0.48)',
                    },
                  }}
                >
                  Start Simulating
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => navigate('/concepts')}
                  sx={{
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.25)',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.7,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      borderColor: isDark ? '#FFFFFF' : '#0F172A',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  See How It Works
                </Button>
              </Box>

              {/* Trust strip */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                  pt: 4,
                  borderTop: `1px solid ${LINE}`,
                  animation: 'heroUp .8s ease-out .4s both',
                }}
              >
                {[
                  { icon: <TimerIcon sx={{ fontSize: 16 }} />, text: 'Minutes, not weeks' },
                  { icon: <AutorenewIcon sx={{ fontSize: 16 }} />, text: 'Fully reproducible' },
                  { icon: <CodeIcon sx={{ fontSize: 16 }} />, text: 'Open source' },
                ].map((t) => (
                  <Box key={t.text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: GOLD }}>{t.icon}</Box>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        color: TEXT_DIM,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                      }}
                    >
                      {t.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right — Telemetry */}
            <Grid item xs={12} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 420,
                  animation: 'heroUp .9s ease-out .5s both',
                }}
              >
                <TelemetryCard />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll cue */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6rem',
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            Scroll
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 20, animation: 'bounceDown 2s ease-in-out infinite' }} />
        </Box>
      </Box>

      {/* ============================================================ */}
      {/* STATS STRIP                                                   */}
      {/* ============================================================ */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, mt: { xs: -2, md: -4 }, mb: 10 }}>
        <Reveal>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${LINE}`,
              background: isDark
                ? 'linear-gradient(180deg, rgba(10,27,43,0.9) 0%, rgba(4,9,15,0.95) 100%)'
                : '#FFFFFF',
              backdropFilter: 'blur(16px)',
              boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.45)' : '0 15px 35px rgba(15,23,42,0.06)', 
            }}
          >
            {stats.map((s, i) => (
              <Box
                key={s.label}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRight: { xs: i % 2 === 0 ? `1px solid ${LINE}` : 'none', md: i < 3 ? `1px solid ${LINE}` : 'none' },
                  borderBottom: { xs: i < 2 ? `1px solid ${LINE}` : 'none', md: 'none' },
                  transition: 'background-color .3s ease',
                  '&:hover': { backgroundColor: 'rgba(244,180,0,0.04)' },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    fontWeight: 800,
                    color: GOLD,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    fontFamily: 'ui-monospace, monospace',
                    mb: 1,
                  }}
                >
                  <CountUp end={s.end} suffix={s.suffix} />
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: 'uppercase',
                    color: TEXT_DIMMER,
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>

      {/* ============================================================ */}
      {/* CONCEPTS — BENTO GRID                                         */}
      {/* ============================================================ */}
      <Box sx={{ position: 'relative', py: { xs: 10, md: 14 } }}>
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(31,122,140,0.10) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative' }}>
          <Reveal>
            <SectionHeading
              eyebrow="Foundations"
              title={
                <>
                  Six pillars of{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    modern reservoir engineering
                  </Box>
                </>
              }
              subtitle="Each concept implemented, documented, and explorable inside XCAPE. No black boxes — only calibrated models."
            />
          </Reveal>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {concepts.map((c, i) => (
              <Reveal
                key={c.title}
                delay={i * 60}
                sx={{
                  gridColumn: { xs: 'span 12', md: `span ${c.span}` },
                  width: '100%',
                }}
              >
                <Box
                  onClick={() => navigate('/concepts')}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 340, md: c.h },
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `1px solid ${LINE}`,
                    transition: 'all .5s cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                      borderColor: 'rgba(244,180,0,0.55)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                      transform: 'translateY(-6px)',
                    },
                    '&:hover .c-img': { transform: 'scale(1.08)' },
                    '&:hover .c-arrow': { transform: 'translate(4px, -4px)', opacity: 1 },
                    '&:hover .c-overlay': { opacity: 0.72 },
                  }}
                >
                  {/* Image */}
                  <Box
                    component="img"
                    className="c-img"
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 1.2s cubic-bezier(.4,0,.2,1)',
                      filter: 'saturate(1.05) contrast(1.05) brightness(0.92)',
                    }}
                  />

                  {/* Overlay */}
                  <Box
                    className="c-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(4,9,15,0.02) 0%, rgba(4,9,15,0.25) 40%, rgba(4,9,15,0.92) 100%)',
                      transition: 'opacity .4s ease',
                    }}
                  />

                  {/* Top row */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      right: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        letterSpacing: 1.4,
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(4,9,15,0.65)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: BG,
                        background: `linear-gradient(140deg, ${GOLD_LIGHT}, ${GOLD})`,
                        boxShadow: `0 8px 20px rgba(244,180,0,0.45)`,
                      }}
                    >
                      {c.icon}
                    </Box>
                  </Box>

                  {/* Bottom text */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 2.5, md: 3 },
                      background: 'linear-gradient(180deg, transparent 0%, rgba(4,9,15,0.85) 45%)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: GOLD,
                        mb: 0.8,
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {c.tag}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: { xs: '1.2rem', md: c.span >= 6 ? '1.5rem' : '1.25rem' },
                          lineHeight: 1.2,
                          letterSpacing: '-0.01em',
                          maxWidth: '88%',
                        }}
                      >
                        {c.title}
                      </Typography>
                      <ArrowOutwardIcon
                        className="c-arrow"
                        sx={{
                          fontSize: 22,
                          color: GOLD,
                          opacity: 0.7,
                          transition: 'all .35s ease',
                          flexShrink: 0,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.7)',
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {c.description}
                    </Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* SEE IT IN ACTION                                              */}
      {/* ============================================================ */}
      <Box sx={{ backgroundColor: BG_ALT, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid item xs={12} md={5}>
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow="See It In Action"
                  title={
                    <>
                      A real history match,{' '}
                      <Box
                        component="span"
                        sx={{
                          background: `linear-gradient(90deg, ${GOLD}, ${TEAL})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        visualized
                      </Box>
                    </>
                  }
                  subtitle="Observed field measurements in teal. Simulated response in gold. The uncertainty envelope around it shows exactly how confident the calibrated model is."
                />
              </Reveal>
              <Reveal delay={120}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
                  {[
                    { t: 'Every point is data', d: 'Observed production and pressure are overlaid directly against the simulation.' },
                    { t: 'The band is honesty', d: 'The EnKF ensemble carries forward quantified uncertainty — not a single best guess.' },
                    { t: 'Rerun anytime', d: 'Every match is versioned, reproducible, and sharable with your team.' },
                  ].map((it) => (
                    <Box key={it.t} sx={{ display: 'flex', gap: 1.5 }}>
                      <Box
                        sx={{
                          mt: 0.5,
                          width: 20,
                          height: 20,
                          flexShrink: 0,
                          borderRadius: '50%',
                          border: `1.5px solid ${GOLD}`,
                          display: 'grid',
                          placeItems: 'center',
                          color: GOLD,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        ✓
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: TEXT, fontSize: '0.95rem', mb: 0.4 }}>
                          {it.t}
                        </Typography>
                        <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.6, color: TEXT_DIM }}>
                          {it.d}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Reveal>
            </Grid>
            <Grid item xs={12} md={7}>
              <Reveal delay={80}>
                <ProductionChart />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* WORKFLOW TIMELINE                                             */}
      {/* ============================================================ */}
      <Box sx={{ position: 'relative', py: { xs: 10, md: 14 }, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: 640,
            height: 640,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(31,122,140,0.14) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-25%',
            right: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(244,180,0,0.08) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionHeading
              eyebrow="The XCAPE Workflow"
              title="From field data to decision"
              subtitle="Four transparent stages. One continuous loop. No black boxes."
            />
          </Reveal>

          <Box sx={{ position: 'relative' }}>
            {/* Connector line (desktop) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 56,
                left: '12%',
                right: '12%',
                height: 2,
                background: `linear-gradient(90deg, ${GOLD} 0%, ${TEAL} 50%, ${GOLD} 100%)`,
                opacity: 0.25,
                zIndex: 0,
              }}
            />

            <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
              {workflow.map((step, i) => (
                <Grid item xs={12} sm={6} md={3} key={step.n}>
                  <Reveal delay={i * 100}>
                    <Box sx={{ textAlign: 'center' }}>
                      {/* Node */}
                      <Box
                        sx={{
                          width: 76,
                          height: 76,
                          mx: 'auto',
                          mb: 3,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          position: 'relative',
                          background: `linear-gradient(140deg, ${GOLD_LIGHT}, ${GOLD})`,
                          color: isDark ? BG : '#FFFFFF',
                          boxShadow: `0 12px 32px rgba(244,180,0,0.35), 0 0 0 8px ${BG}, 0 0 0 9px ${LINE}`,
                          transition: 'all .4s ease',
                          '&:hover': {
                            transform: 'scale(1.06)',
                            boxShadow: `0 16px 40px rgba(244,180,0,0.5), 0 0 0 8px ${BG}, 0 0 0 9px rgba(244,180,0,0.55)`,
                          },
                        }}
                      >
                        <Box sx={{ fontSize: 30, display: 'grid', placeItems: 'center' }}>{step.icon}</Box>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          letterSpacing: 2,
                          color: GOLD,
                          mb: 0.6,
                          fontFamily: 'ui-monospace, monospace',
                        }}
                      >
                        STEP {step.n}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: TEXT,
                          fontSize: '1.05rem',
                          mb: 1.2,
                          lineHeight: 1.3,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.87rem',
                          lineHeight: 1.7,
                          color: TEXT_DIM,
                          maxWidth: 260,
                          mx: 'auto',
                        }}
                      >
                        {step.desc}
                      </Typography>
                    </Box>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* FIELD GALLERY                                                 */}
      {/* ============================================================ */}
      <Box sx={{ backgroundColor: BG_ALT, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="xl">
          <Reveal>
            <SectionHeading
              eyebrow="From the Field"
              title={
                <>
                  Where theory meets{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(90deg, ${GOLD}, ${TEAL})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    the reservoir
                  </Box>
                </>
              }
              subtitle="XCAPE is built around the environments where petroleum engineers actually work."
            />
          </Reveal>

          <Reveal delay={100}>
            <Grid container spacing={2}>
              {gallery.map((g) => (
                <Grid item xs={6} md={3} key={g.title}>
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: 280, md: 420 },
                      borderRadius: 2.5,
                      overflow: 'hidden',
                      border: `1px solid ${LINE}`,
                      cursor: 'pointer',
                      transition: 'all .5s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        borderColor: 'rgba(244,180,0,0.55)',
                        transform: 'translateY(-6px)',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.55)',
                      },
                      '&:hover .g-img': { transform: 'scale(1.12)' },
                      '&:hover .g-arrow': { opacity: 1, transform: 'translate(0, 0)' },
                    }}
                  >
                    <Box
                      component="img"
                      className="g-img"
                      src={g.img}
                      alt={g.title}
                      loading="lazy"
                      onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1.2s cubic-bezier(.4,0,.2,1)',
                        filter: 'saturate(1.05) contrast(1.05) brightness(0.92)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(4,9,15,0.02) 0%, rgba(4,9,15,0.3) 45%, rgba(4,9,15,0.92) 100%)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 2, md: 2.5 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          letterSpacing: 2,
                          textTransform: 'uppercase',
                          color: GOLD,
                          mb: 0.6,
                          fontFamily: 'ui-monospace, monospace',
                        }}
                      >
                        Field
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: '#FFFFFF',
                          fontSize: '1rem',
                          lineHeight: 1.25,
                          mb: 0.4,
                        }}
                      >
                        {g.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
                        {g.sub}
                      </Typography>
                    </Box>
                    <Box
                      className="g-arrow"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: BG,
                        backgroundColor: GOLD,
                        opacity: 0,
                        transform: 'translate(-6px, 6px)',
                        transition: 'all .35s ease',
                      }}
                    >
                      <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* FEATURES                                                      */}
      {/* ============================================================ */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="xl">
          <Reveal>
            <SectionHeading
              eyebrow="Platform"
              title="Built for engineers and students"
              subtitle="Powerful enough for research, clear enough for the classroom."
            />
          </Reveal>

          <Grid container spacing={2.5}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Reveal delay={i * 80}>
                  <Box
                    sx={{
                      p: 3.5,
                      height: '100%',
                      borderRadius: 3,
                      border: `1px solid ${LINE}`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
                      backdropFilter: 'blur(6px)',
                      boxShadow: isDark ? undefined : '0 10px 25px rgba(15,23,42,0.04)',
                      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: 'rgba(244,180,0,0.5)',
                        backgroundColor: isDark ? 'rgba(244,180,0,0.03)' : '#FFFFFF',
                        boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.4)' : '0 20px 40px rgba(244,180,0,0.12)',
                        '& .f-icon': {
                          backgroundColor: GOLD,
                          color: isDark ? BG : '#FFFFFF',
                          boxShadow: `0 0 24px rgba(244,180,0,0.45)`,
                        },
                      },
                    }}
                  >
                    <Box
                      className="f-icon"
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        mb: 3,
                        color: GOLD,
                        backgroundColor: 'rgba(244,180,0,0.10)',
                        border: '1px solid rgba(244,180,0,0.2)',
                        transition: 'all .4s ease',
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: TEXT, mb: 1.2, fontSize: '1.05rem', lineHeight: 1.3 }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.7, color: TEXT_DIM }}>
                      {f.desc}
                    </Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* QUOTE                                                         */}
      {/* ============================================================ */}
      <Box sx={{ backgroundColor: BG_ALT, py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <Reveal>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  fontSize: '6rem',
                  fontWeight: 900,
                  lineHeight: 0.6,
                  color: GOLD,
                  opacity: 0.35,
                  fontFamily: 'Georgia, serif',
                  mb: 1,
                }}
              >
                "
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: '1.4rem', md: '2rem' },
                  fontWeight: 300,
                  lineHeight: 1.4,
                  letterSpacing: '-0.015em',
                  color: TEXT,
                  maxWidth: 780,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                Where oil is found in the minds of men, it is found first in the ability to
                see a reservoir in a collection of data.
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 30, height: 1, bgcolor: GOLD }} />
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: GOLD,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  Wallace E. Pratt · Petroleum Geologist
                </Typography>
                <Box sx={{ width: 30, height: 1, bgcolor: GOLD }} />
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* CTA                                                           */}
      {/* ============================================================ */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="xl">
          <Reveal>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                px: { xs: 4, md: 12 },
                py: { xs: 8, md: 12 },
                textAlign: 'center',
                background: `linear-gradient(135deg, ${TEAL} 0%, ${NAVY} 55%, ${BG} 100%)`,
                boxShadow: '0 40px 80px rgba(15,76,129,0.35)',
                border: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {/* atmospheric glows */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-30%',
                  left: '-10%',
                  width: 600,
                  height: 600,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(244,180,0,0.32) 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-30%',
                  right: '-10%',
                  width: 600,
                  height: 600,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(31,122,140,0.35) 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }}
              />
              {/* masked grid */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.4,
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '56px 56px',
                  maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 75%)',
                  pointerEvents: 'none',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: GOLD,
                    mb: 2.5,
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  Get Started
                </Typography>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    fontSize: { xs: '2rem', md: '3.2rem' },
                    mb: 3,
                    maxWidth: 780,
                    mx: 'auto',
                  }}
                >
                  Ready to master{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(100deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    reservoir simulation?
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    maxWidth: 600,
                    mx: 'auto',
                    mb: 5,
                  }}
                >
                  Your first history match is a few clicks away. Explore the guide and
                  get started with XCAPE today.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/guide')}
                    sx={{
                      backgroundColor: GOLD,
                      color: BG,
                      fontWeight: 800,
                      px: 4,
                      py: 1.7,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 14px 36px rgba(244,180,0,0.35)',
                      transition: 'all .25s ease',
                      '&:hover': {
                        backgroundColor: GOLD_LIGHT,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 48px rgba(244,180,0,0.5)',
                      },
                    }}
                  >
                    User Guide
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/about')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.45)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      px: 4,
                      py: 1.7,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(6px)',
                      transition: 'all .25s ease',
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    About XCAPE
                  </Button>
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <Box sx={{ borderTop: `1px solid ${LINE}`, backgroundColor: BG_ALT }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  background: `linear-gradient(135deg, ${GOLD}, ${TEAL})`,
                  boxShadow: `0 0 12px rgba(244,180,0,0.5)`,
                }}
              />
              <Typography sx={{ fontWeight: 900, color: TEXT, letterSpacing: 2.5, fontSize: '0.95rem' }}>
                XCAPE
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.76rem',
                color: TEXT_DIMMER,
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              Automated Reservoir History Matching &amp; Simulation Platform
            </Typography>
            <Typography
              sx={{ fontSize: '0.7rem', color: TEXT_DIMMER, fontFamily: 'ui-monospace, monospace' }}
            >
              © {new Date().getFullYear()} · OPM Flow · ES-MDA · EnKF
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage 