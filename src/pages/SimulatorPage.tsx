import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  useTheme,
} from '@mui/material'
import {
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  DownloadRounded as DownloadIcon,
  Info as InfoIcon,
  DataObject as DataObjectIcon,
} from '@mui/icons-material'
import { useAuth } from '@context/AuthContext'
import ForecastCharts from '@components/ForecastCharts'
import ProductionFlowVisualization from '@components/ProductionFlowVisualization'
import DataDrawer from '@components/DataDrawer'
import { DataInputModal } from '@components/DataInputModal'
import { AttachReservoirModal } from '@components/AttachReservoirModal'
import { InterpretButton } from '@components/InterpretButton'
import { InterpretationDrawer } from '@components/InterpretationDrawer'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const SimulatorPage: React.FC = () => {
  const theme = useTheme()
  const activeStep = 0
  const [tabValue, setTabValue] = useState(0)
  const [algorithmType, setAlgorithmType] = useState('enkf')
  const [isRunning, setIsRunning] = useState(false)
  const [runProgress, setRunProgress] = useState(0)
  const [simulationId, setSimulationId] = useState<number | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [dataDrawerOpen, setDataDrawerOpen] = useState(false)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false)
  const { token } = useAuth()

  // File upload state
  const [productionFile, setProductionFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string>('')
  const [uploadSuccess, setUploadSuccess] = useState<string>('')
  const [uploadedDatasetId, setUploadedDatasetId] = useState<number | null>(null)

  // Export state
  const [exportLoading, setExportLoading] = useState(false)
  const [exportError, setExportError] = useState<string>('')
  const [exportSuccess, setExportSuccess] = useState<string>('')

  // Chart state
  const [priorForecast, setPriorForecast] = useState<any | null>(null)
  const [posteriorForecast, setPosteriorForecast] = useState<any | null>(null)
  const [chartMetric, setChartMetric] = useState<string>('oil')

  // Controlled quick params
  const [initialPressure, setInitialPressure] = useState<number>(200)
  const [porosity, setPorosity] = useState<number>(15)
  const [permeability, setPermeability] = useState<number>(100)
  const [waterSaturation, setWaterSaturation] = useState<number>(30)
  const [datasetParams, setDatasetParams] = useState<{
    initial_pressure?: number | null
    porosity?: number | null
    permeability?: number | null
    water_saturation?: number | null
  } | null>(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  const handleProductionFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('File too large (max 50MB)')
        return
      }
      setProductionFile(file)
      setUploadError('')
    }
  }

  const handleModelFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('File too large (max 100MB)')
        return
      }
      setModelFile(file)
      setUploadError('')
    }
  }

  const uploadDataset = async () => {
    if (!productionFile) {
      setUploadError('Please select a production data file')
      return
    }

    try {
      // Step 1: Upload production CSV
      const formData = new FormData()
      formData.append('file', productionFile)
      formData.append('name', `Production Data - ${new Date().toLocaleString()}`)

      const res = await fetch(`${API_BASE}/datasets/`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Token ${token}` : '',
          // Do NOT set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Upload failed' }))
        const errorMsg = errorData?.detail || errorData?.error || 'Upload failed'
        throw new Error(errorMsg)
      }

      const data = await res.json()
      const newDatasetId = data.id

      // Step 2: If a reservoir model JSON file was selected, read and attach it
      if (modelFile && newDatasetId) {
        try {
          const modelText = await modelFile.text()
          const modelJson = JSON.parse(modelText)

          const attachRes = await fetch(`${API_BASE}/datasets/${newDatasetId}/attach_model/`, {
            method: 'PATCH',
            headers: {
              Authorization: token ? `Token ${token}` : '',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservoir_model: modelJson }),
          })

          if (!attachRes.ok) {
            console.warn('[MODEL] Failed to attach reservoir model - OOIP may be limited')
          } else {
            console.log('[MODEL] Reservoir model attached to dataset', newDatasetId)
          }
        } catch (modelErr) {
          console.warn('[MODEL] Could not parse or attach reservoir model JSON:', modelErr)
        }
      }

      setUploadedDatasetId(newDatasetId)
      setUploadSuccess(`Dataset uploaded successfully (ID: ${newDatasetId})${modelFile ? ' — with reservoir model' : ''} - Ready to use!`)
      setProductionFile(null)
      setModelFile(null)
      setUploadError('')
      console.log('[DATASET] Stored dataset ID:', newDatasetId, 'Name:', data.name)
    } catch (err) {
      console.error('Upload failed', err)
      setUploadError(`Upload error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // When a dataset is selected/created, fetch it to see if it contains reservoir_model
  // AUTO-APPLY: values are immediately applied to Quick Parameters fields (locked)
  useEffect(() => {
    if (!uploadedDatasetId) {
      setDatasetParams(null)
      return
    }

    const fetchDataset = async () => {
      try {
        const res = await fetch(`${API_BASE}/datasets/${uploadedDatasetId}/`, {
          headers: { Authorization: token ? `Token ${token}` : '' },
        })
        if (!res.ok) return
        const data = await res.json()
        const prod = data.production_data || {}

        // Resolve the reservoir model object from any supported location
        let rm: any = null
        if (prod && typeof prod === 'object') {
          rm = prod.reservoir_model || prod.raw_json || null
          // If still null but prod itself looks like a reservoir model (not a production array), use it
          if (!rm && !Array.isArray(prod) && !prod.Days && !prod.Oil_bbl) {
            rm = prod
          }
        }

        const normalizeFraction = (v: any) => {
          const n = Number(v)
          if (!isFinite(n)) return null
          let x = n
          if (x > 1) {
            if (x <= 100) x = x / 100
            else if (x <= 1000) x = x / 100
            else x = x / 10000
          }
          if (x < 0) return null
          if (x > 1) x = 1
          return x
        }

        let ip: number | null = null
        let por: number | null = null
        let perm: number | null = null
        let wsat: number | null = null

        if (rm && typeof rm === 'object') {
          // Top-level flat fields
          ip   = rm.initial_pressure ?? rm.pressure ?? rm.initial_pressure_bar ?? rm.pressure_bar ?? null
          por  = rm.porosity ?? rm.porosity_fraction ?? rm.poro ?? null
          perm = rm.permeability ?? rm.perm ?? rm.permeability_md ?? null
          wsat = rm.water_saturation ?? rm.wat_sat ?? rm.initial_water_saturation ?? null

          // fluid_properties section
          if (rm.fluid_properties && typeof rm.fluid_properties === 'object') {
            const fp = rm.fluid_properties
            ip   = ip   ?? fp.initial_pressure ?? fp.pressure ?? null
            wsat = wsat ?? fp.water_saturation ?? fp.waterSat ?? null
          }

          // rock_properties section
          if (rm.rock_properties && typeof rm.rock_properties === 'object') {
            const rp = rm.rock_properties
            por  = por  ?? rp.porosity ?? rp.poro ?? rp.porosity_fraction ?? null
            perm = perm ?? rp.permeability ?? rp.perm ?? rp.permeability_md ?? null
          }

          // Also check legacy reservoir section
          if (rm.reservoir && typeof rm.reservoir === 'object') {
            const rv = rm.reservoir
            ip = ip ?? rv.initial_pressure ?? rv.pressure ?? rv.initial_pressure_bar ?? null
          }

          // Normalize fractions
          por  = normalizeFraction(por)
          wsat = normalizeFraction(wsat)
        } else {
          // Try to infer initial pressure from production data arrays
          const possiblePressureArrays = [prod.Pressure_psi, prod.Pressure, prod.pressure_psi, prod.pressure]
          for (const arr of possiblePressureArrays) {
            if (Array.isArray(arr) && arr.length > 0) {
              const v = Number(arr[0])
              if (!isNaN(v)) { ip = v; break }
            }
          }
        }

        const detectedParams = {
          initial_pressure: ip ?? null,
          porosity: por ?? null,
          permeability: perm ?? null,
          water_saturation: wsat ?? null,
        }
        setDatasetParams(detectedParams)
        console.log('[DATASET] Detected params from dataset:', detectedParams, '| rm keys:', rm ? Object.keys(rm) : 'none')

        // ── AUTO-APPLY: immediately update Quick Parameter fields ──
        if (ip !== null) setInitialPressure(Number(ip))
        if (por !== null) setPorosity(Number((por * 100).toFixed(2)))
        if (perm !== null) setPermeability(Number(perm))
        if (wsat !== null) setWaterSaturation(Number((wsat * 100).toFixed(2)))

      } catch (e) {
        console.warn('Failed to fetch dataset params', e)
        setDatasetParams(null)
      }
    }

    fetchDataset()
  }, [uploadedDatasetId, API_BASE, token])


  const handleManualDatasetSave = async (payload: { name: string; description?: string; production_data: Record<string, any> }) => {
    try {
      const authToken = token || localStorage.getItem('authToken')
      if (!authToken) throw new Error('Authentication token not found')

      const res = await fetch(`${API_BASE}/datasets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Token ${authToken}` : '',
        },
        body: JSON.stringify({
          name: payload.name,
          description: payload.description || '',
          production_data: payload.production_data,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        let msg = `Server error (${res.status})`
        try {
          const j = JSON.parse(text)
          msg = j.detail || JSON.stringify(j)
        } catch (e) {
          msg = text || msg
        }
        throw new Error(msg)
      }

      const created = await res.json()
      if (created && created.id) {
        setUploadedDatasetId(created.id)
      }
      setIsManualModalOpen(false)
      alert(`Dataset created (ID: ${created?.id})`)
    } catch (err) {
      console.error('Manual dataset save failed', err)
      throw err
    }
  }

  const pollProgress = async (id: number) => {
    let isPolling = true
    const pollInterval = 1000 // Poll every 1 second for faster updates
    
    while (isPolling) {
      try {
        const res = await fetch(`${API_BASE}/simulations/${id}/`, {
          headers: {
            Authorization: token ? `Token ${token}` : '',
            'Content-Type': 'application/json',
          },
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch progress')
        }
        
        const data = await res.json()
        console.log(`[POLL] Progress: ${data.progress}%, Status: ${data.status}`)
        
        // Update progress state
        setRunProgress(data.progress || 0)
        
        // Check if simulation is complete
        if (data.status === 'completed' || data.status === 'failed') {
          isPolling = false
          setIsRunning(false)
          console.log('🎯 Simulation completed. Results:', {
            duration_seconds: data.duration_seconds,
            match_quality: data.match_quality,
            status: data.status,
            progress: data.progress,
            fullData: data,
          })
          setResults(data)
          setRunProgress(100)
          setTabValue(3)
          break
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      } catch (err) {
        console.error('Poll error:', err)
        isPolling = false
        setIsRunning(false)
        break
      }
    }
  }

  const handleRunSimulation = async (type: string = 'baseline') => {
    setIsRunning(true)
    setRunProgress(0)
    setPriorForecast(null)
    setPosteriorForecast(null)

    try {
      const payload = {
        name: `Run - ${new Date().toISOString()}`,
        description: 'Launched from frontend UI',
        matching_type: type === 'enkf' ? 'enkf' : 'baseline',
        initial_pressure: initialPressure,
        porosity: porosity,
        permeability: permeability,
        water_saturation: waterSaturation,
        ...(uploadedDatasetId && { dataset: uploadedDatasetId }),
      }

      console.log('[SIM] Creating simulation with payload:', payload)

      const createRes = await fetch(`${API_BASE}/simulations/`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Token ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!createRes.ok) {
        const err = await createRes.text()
        throw new Error(err)
      }

      const created = await createRes.json()
      const id = created.id
      setSimulationId(id)

      console.log('[SIM] Simulation created with ID:', id)

      // Start simulation
      const startRes = await fetch(`${API_BASE}/simulations/${id}/start/`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Token ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (!startRes.ok) {
        let errText = 'Failed to start simulation'
        try {
          const txt = await startRes.text()
          const j = JSON.parse(txt)
          errText = j.detail || j.error || JSON.stringify(j)
        } catch (e) {
          // fallback to status
          errText = `Failed to start simulation (status ${startRes.status})`
        }
        // Surface error to user
        alert(errText)
        setIsRunning(false)
        return
      }

      console.log('[SIM] Simulation started, beginning polling...')

      // Begin polling progress - fire and forget but track in promise
      pollProgress(id).catch(err => {
        console.error('[SIM] Poll error:', err)
        setIsRunning(false)
      })
    } catch (err) {
      console.error('[SIM] Run failed:', err)
      setIsRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      // cleanup if needed
    }
  }, [])

  // Fetch forecasts when simulation completes
  useEffect(() => {
    if (!results || !simulationId) return

    const fetchForecasts = async () => {
      try {
        console.log(`[Forecasts] Fetching for simulation ${simulationId}`)
        const res = await fetch(`${API_BASE}/forecasts/by_simulation/?simulation_id=${simulationId}`, {
          headers: { Authorization: token ? `Token ${token}` : '' },
        })
        if (!res.ok) {
          console.warn(`[Forecasts] Fetch returned ${res.status}`)
          return
        }

        const forecasts = await res.json()
        console.log(`[Forecasts] Received ${forecasts.length} forecasts:`, forecasts)
        
        const prior = forecasts.find((f: any) => f.forecast_type === 'prior')
        const posterior = forecasts.find((f: any) => f.forecast_type === 'posterior')

        console.log(`[Forecasts] Found prior:`, !!prior, 'posterior:', !!posterior)
        if (prior) {
          console.log(`[Forecasts] Prior predictions keys:`, Object.keys(prior.predictions || {}))
          setPriorForecast(prior)
        }
        if (posterior) {
          console.log(`[Forecasts] Posterior predictions keys:`, Object.keys(posterior.predictions || {}))
          setPosteriorForecast(posterior)
        }
      } catch (err) {
        console.error('Failed to fetch forecasts', err)
      }
    }

    fetchForecasts()
  }, [results, simulationId, token])

  const downloadResults = async () => {
    if (!simulationId) {
      setExportError('No simulation available to export')
      return
    }

    setExportLoading(true)
    setExportError('')
    setExportSuccess('')

    try {
      const res = await fetch(`${API_BASE}/forecasts/by_simulation/?simulation_id=${simulationId}`, {
        headers: { Authorization: token ? `Token ${token}` : '' },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch forecasts: ${res.status} ${res.statusText}`)
      }

      const forecasts = await res.json()

      // Build comprehensive JSON bundle with all data
      const payload = {
        exportDate: new Date().toISOString(),
        simulation: results,
        forecasts: forecasts,
        metadata: {
          simulationId: simulationId,
          datasetId: uploadedDatasetId,
          matchQuality: results?.match_quality,
          duration: results?.duration_seconds,
        },
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `simulation_${simulationId}_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportSuccess(`✓ Results exported successfully as simulation_${simulationId}.json`)
      setTimeout(() => setExportSuccess(''), 4000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Download failed:', err)
      setExportError(`Export failed: ${errorMessage}`)
    } finally {
      setExportLoading(false)
    }
  }

  const generatePDFReport = async () => {
    if (!simulationId || !results) {
      setExportError('No simulation results available')
      return
    }

    setExportLoading(true)
    setExportError('')
    setExportSuccess('')

    try {
      const jsPDF = (await import('jspdf')).jsPDF
      const doc = new jsPDF()
      const pageWidth  = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const colRight = 120  // x position for right-column values
      let y = 20

      // ── helpers ────────────────────────────────────────────────────────────
      const checkPage = (needed = 14) => {
        if (y + needed > pageHeight - 18) {
          addFooter()
          doc.addPage()
          y = 22
        }
      }

      const sectionTitle = (title: string) => {
        checkPage(20)
        y += 4
        doc.setFillColor(15, 76, 129)
        doc.rect(margin, y - 5, pageWidth - margin * 2, 9, 'F')
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text(title, margin + 3, y + 1)
        doc.setTextColor(0, 0, 0)
        y += 12
      }

      const row = (label: string, value: string, indent = 0) => {
        checkPage(8)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 60)
        doc.text(label, margin + indent, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        doc.text(value, colRight, y)
        y += 7
      }

      const subTitle = (text: string) => {
        checkPage(10)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bolditalic')
        doc.setTextColor(15, 76, 129)
        doc.text(text, margin, y)
        doc.setTextColor(0, 0, 0)
        y += 7
      }

      const note = (text: string) => {
        checkPage(8)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(120, 120, 120)
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
        doc.text(lines, margin, y)
        y += lines.length * 5 + 2
      }

      const addFooter = () => {
        doc.setFontSize(8)
        doc.setTextColor(160, 160, 160)
        doc.text(
          'XCAPE — Automated Reservoir History Matching & Simulation System',
          margin,
          pageHeight - 10
        )
        doc.text(
          `Generated: ${new Date().toLocaleString()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        )
      }

      // ── COVER / HEADER ─────────────────────────────────────────────────────
      doc.setFillColor(15, 76, 129)
      doc.rect(0, 0, pageWidth, 38, 'F')

      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('XCAPE Simulation Report', pageWidth / 2, 17, { align: 'center' })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Simulation ID: ${simulationId}  |  Algorithm: ${results.matching_type === 'enkf' ? 'Ensemble Kalman Filter (EnKF)' : 'Baseline'}`,
        pageWidth / 2, 28, { align: 'center' }
      )
      doc.setTextColor(0, 0, 0)
      y = 50

      // ── 1. SIMULATION RESULTS ──────────────────────────────────────────────
      sectionTitle('1. Simulation Results')
      row('Status:', results.status ? results.status.charAt(0).toUpperCase() + results.status.slice(1) : 'Completed')
      row('Algorithm:', results.matching_type === 'enkf' ? 'Ensemble Kalman Filter (EnKF)' : 'Baseline Simulation')
      row('Match Quality:', results.match_quality != null ? `${Number(results.match_quality).toFixed(2)}%` : 'N/A')
      row('Duration:', results.duration_seconds != null && results.duration_seconds > 0
        ? `${Math.floor(results.duration_seconds / 60)}m ${results.duration_seconds % 60}s`
        : 'N/A')
      row('Dataset ID:', uploadedDatasetId ? `#${uploadedDatasetId}` : 'None')
      row('Report Date:', new Date().toLocaleString())

      // ── 2. RESERVOIR INPUT PARAMETERS ──────────────────────────────────────
      sectionTitle('2. Reservoir Input Parameters')
      row('Initial Pressure:', `${initialPressure} psi`)
      row('Porosity:', `${porosity}%`)
      row('Permeability:', `${permeability} mD`)
      row('Water Saturation:', `${waterSaturation}%`)

      // Extended params from results if available
      const rd = results.results_data || {}
      const ooip = rd.ooip || {}
      if (ooip.inputs) {
        const inp = ooip.inputs
        if (inp.area_acres)     row('Drainage Area:', `${Number(inp.area_acres).toLocaleString()} acres`)
        if (inp.thickness_ft)   row('Net Pay Thickness:', `${Number(inp.thickness_ft).toFixed(1)} ft`)
        if (inp.porosity_frac)  row('Porosity (fraction):', Number(inp.porosity_frac).toFixed(4))
        if (inp.water_sat_frac) row('Water Saturation (fraction):', Number(inp.water_sat_frac).toFixed(4))
      }

      // ── 3. OOIP ESTIMATION ─────────────────────────────────────────────────
      sectionTitle('3. Original Oil In Place (OOIP) Estimation')
      if (ooip.ooip_mmbbl) {
        row('Initial OOIP:', `${Number(ooip.ooip_mmbbl).toFixed(3)} MMbbl  (${Number(ooip.ooip_stb).toLocaleString()} STB)`)
        row('Remaining OOIP (after 365 d):', `${Number(ooip.remaining_ooip_mmbbl).toFixed(3)} MMbbl  (${Number(ooip.remaining_ooip_stb).toLocaleString()} STB)`)
        row('Recovery Factor (365 d):', `${Number(ooip.recovery_factor_pct).toFixed(2)}%`)
        row('Cum. Oil Production (365 d):', ooip.cum_oil_365d_stb ? `${Number(ooip.cum_oil_365d_stb).toLocaleString()} STB` : 'N/A')
        row('Formation Volume Factor (Bo):', ooip.formation_volume_factor != null ? `${Number(ooip.formation_volume_factor).toFixed(4)} RB/STB` : 'N/A')
        row('Bo Source:', ooip.bo_source === "Standing's correlation" ? "Standing's Correlation (auto)" : 'User Supplied')

        y += 3
        subTitle('OOIP Calculation Inputs:')
        if (ooip.inputs) {
          const i = ooip.inputs
          if (i.area_acres)     row('  Drainage Area:', `${Number(i.area_acres).toLocaleString()} acres`, 4)
          if (i.thickness_ft)   row('  Net Pay Thickness:', `${Number(i.thickness_ft).toFixed(1)} ft`, 4)
          if (i.porosity_frac)  row('  Porosity:', `${(Number(i.porosity_frac) * 100).toFixed(2)}%`, 4)
          if (i.water_sat_frac) row('  Water Saturation:', `${(Number(i.water_sat_frac) * 100).toFixed(2)}%`, 4)
        }
        note('Formula: OOIP (STB) = 7758 × Area (acres) × Thickness (ft) × Porosity × (1 − Sw) / Bo')
      } else if (ooip.note) {
        note(`⚠  ${ooip.note}`)
        note('To enable OOIP estimation, provide: Drainage Area (acres), Net Pay Thickness (ft), and Porosity (%).')
      } else {
        note('OOIP data not available for this simulation run.')
      }

      // ── 4. PREDICTED PRODUCTION VALUES ────────────────────────────────────
      sectionTitle('4. Predicted Production Values')
      row('Oil Predicted:', rd.oil_predicted != null ? `${Number(rd.oil_predicted).toLocaleString(undefined, {maximumFractionDigits: 0})} STB` : 'N/A')
      row('Water Predicted:', rd.water_predicted != null ? `${Number(rd.water_predicted).toLocaleString(undefined, {maximumFractionDigits: 0})} STB` : 'N/A')
      row('Gas Predicted:', rd.gas_predicted != null ? `${Number(rd.gas_predicted).toLocaleString(undefined, {maximumFractionDigits: 0})} Mscf` : 'N/A')
      row('Reservoir Pressure Predicted:', rd.pressure_predicted != null ? `${Number(rd.pressure_predicted).toFixed(1)} psi` : 'N/A')

      // ── 5. PRIOR FORECAST SUMMARY ─────────────────────────────────────────
      if (priorForecast) {
        sectionTitle('5. Prior Forecast Summary (Before Calibration)')
        const pPred = priorForecast.predictions || {}
        const pUnc  = priorForecast.uncertainty || {}

        for (const metric of ['oil', 'water', 'gas', 'pressure'] as const) {
          const pred = pPred[metric] || {}
          const mean  = Array.isArray(pred.mean)  ? pred.mean  : []
          const upper = Array.isArray(pred.upper) ? pred.upper : []
          const lower = Array.isArray(pred.lower) ? pred.lower : []
          const unit  = metric === 'pressure' ? 'psi' : metric === 'gas' ? 'Mscf/d' : 'STB/d'

          subTitle(`${metric.toUpperCase()} (${unit})`)
          row(`  Initial Mean:`,  mean.length  ? `${Number(mean[0]).toFixed(2)}` : 'N/A', 4)
          row(`  Final Mean:`,    mean.length  ? `${Number(mean[mean.length-1]).toFixed(2)}` : 'N/A', 4)
          row(`  Peak Upper:`,    upper.length ? `${Math.max(...upper.map(Number)).toFixed(2)}` : 'N/A', 4)
          row(`  Peak Lower:`,    lower.length ? `${Math.min(...lower.map(Number)).toFixed(2)}` : 'N/A', 4)
          const stdKey = `${metric}_std_mean` as keyof typeof pUnc
          if (pUnc[stdKey] != null) row(`  Std Dev (mean):`, `${Number(pUnc[stdKey]).toFixed(4)}`, 4)
          y += 2
        }
      }

      // ── 6. POSTERIOR FORECAST SUMMARY ─────────────────────────────────────
      if (posteriorForecast) {
        sectionTitle('6. Posterior Forecast Summary (After Calibration)')
        const ppPred = posteriorForecast.predictions || {}
        const ppUnc  = posteriorForecast.uncertainty || {}

        for (const metric of ['oil', 'water', 'gas', 'pressure'] as const) {
          const pred  = ppPred[metric] || {}
          const mean  = Array.isArray(pred.mean)  ? pred.mean  : []
          const upper = Array.isArray(pred.upper) ? pred.upper : []
          const lower = Array.isArray(pred.lower) ? pred.lower : []
          const unit  = metric === 'pressure' ? 'psi' : metric === 'gas' ? 'Mscf/d' : 'STB/d'

          subTitle(`${metric.toUpperCase()} (${unit})`)
          row(`  Initial Mean:`,  mean.length  ? `${Number(mean[0]).toFixed(2)}` : 'N/A', 4)
          row(`  Final Mean:`,    mean.length  ? `${Number(mean[mean.length-1]).toFixed(2)}` : 'N/A', 4)
          row(`  Peak Upper:`,    upper.length ? `${Math.max(...upper.map(Number)).toFixed(2)}` : 'N/A', 4)
          row(`  Peak Lower:`,    lower.length ? `${Math.min(...lower.map(Number)).toFixed(2)}` : 'N/A', 4)
          const stdKey = `${metric}_std_mean` as keyof typeof ppUnc
          if (ppUnc[stdKey] != null) row(`  Std Dev (mean):`, `${Number(ppUnc[stdKey]).toFixed(4)}`, 4)
          y += 2
        }
      }

      // ── 7. DATA SOURCE ─────────────────────────────────────────────────────
      sectionTitle('7. Data Source & Methodology')
      row('Data Source:', rd.data_source || 'Uploaded Dataset')
      note(
        'History matching was performed using the Ensemble Kalman Filter (EnKF) algorithm. ' +
        'The EnKF updates reservoir model parameters by assimilating observed production data. ' +
        'OOIP is computed using the volumetric method: OOIP = 7758 × A × h × φ × (1−Sw) / Bo. ' +
        'Forecasts show predicted production rates with uncertainty bounds over the simulation period.'
      )

      // final footer
      addFooter()

      // Save
      doc.save(`simulation_${simulationId}_report.pdf`)
      setExportSuccess('✓ PDF report generated and downloaded successfully!')
      setTimeout(() => setExportSuccess(''), 4000)
    } catch (err) {
      if ((err as any)?.message?.includes('Cannot find module')) {
        setExportError('PDF export requires jspdf. Falling back to JSON export.')
        downloadResults()
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('PDF generation failed:', err)
        setExportError(`PDF export failed: ${errorMessage}. Downloading JSON instead.`)
        downloadResults()
      }
    } finally {
      setExportLoading(false)
    }
  }


  return (
    <>
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 700,
            color: '#0F4C81',
          }}
        >
          XCAPE Simulator
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'textSecondary',
            mb: 4,
            fontSize: '1.1rem',
          }}
        >
          Perform automated reservoir history matching and generate forecasts
        </Typography>

        {/* Process Steps */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            <Step>
              <StepLabel>Upload Data</StepLabel>
            </Step>
            <Step>
              <StepLabel>Configure</StepLabel>
            </Step>
            <Step>
              <StepLabel>Run</StepLabel>
            </Step>
            <Step>
              <StepLabel>Results</StepLabel>
            </Step>
          </Stepper>
        </Card>

        {/* Tabbed Interface */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              aria-label="simulator tabs"
            >
              <Tab label="Input Data" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Configuration" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Execution" id="tab-2" aria-controls="tabpanel-2" />
              <Tab label="Results" id="tab-3" aria-controls="tabpanel-3" />
            </Tabs>
          </Box>

          {/* Tab 1: Input Data */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Sample Data Info Card */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
                    border: '2px solid #0F4C81',
                    borderRadius: '12px',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#0F4C81' }}>
                          📚 Need Help Getting Started?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555' }}>
                          View sample datasets, understand data structure, and learn what format the system expects
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<DataObjectIcon />}
                        onClick={() => setDataDrawerOpen(true)}
                        sx={{
                          backgroundColor: '#0F4C81',
                          '&:hover': { backgroundColor: '#0D3A5C' },
                          whiteSpace: 'nowrap',
                          ml: 2,
                        }}
                      >
                        View Sample Data
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    backgroundColor: '#F7F9FC',
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: '#1a2332',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F4C81' }}>
                      Production Data Upload
                    </Typography>
                    <Alert icon={<InfoIcon />} severity="info" sx={{ mb: 2 }}>
                      Upload CSV file with pressure, flow rates, and cumulative production data
                    </Alert>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ color: '#0F4C81', borderColor: '#0F4C81' }}
                    >
                      {productionFile ? `✓ ${productionFile.name}` : 'Select Production Data File'}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleProductionFileSelect}
                        hidden
                      />
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setIsManualModalOpen(true)}
                        sx={{ color: '#0F4C81', borderColor: '#0F4C81' }}
                      >
                        Manual Entry
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsAttachModalOpen(true)}
                        sx={{ color: '#137c11', borderColor: '#137c11' }}
                      >
                        Attach Reservoir Model
                      </Button>
                      <Button
                        variant="contained"
                        onClick={uploadDataset}
                        sx={{ ml: 'auto' }}
                      >
                        Upload
                      </Button>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'textSecondary' }}>
                      Supported: CSV, XLSX
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    backgroundColor: '#F7F9FC',
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: '#1a2332',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F4C81' }}>
                      Reservoir Model Upload
                    </Typography>
                    <Alert icon={<InfoIcon />} severity="info" sx={{ mb: 2 }}>
                      Upload your OPM Flow model file or parameter configuration
                    </Alert>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ color: '#0F4C81', borderColor: '#0F4C81' }}
                    >
                      {modelFile ? `✓ ${modelFile.name}` : 'Select Model File'}
                      <input
                        type="file"
                        accept=".data,.py,.json"
                        onChange={handleModelFileSelect}
                        hidden
                      />
                    </Button>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'textSecondary' }}>
                      Supported: DATA, PY, JSON
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: '#F7F9FC',
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: '#1a2332',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
                        Quick Parameters
                      </Typography>
                      {datasetParams && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 0.5,
                            backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)',
                            borderRadius: '999px', px: 1.5, py: 0.5,
                          }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803d' }}>
                              ✓ From Dataset — fields locked
                            </Typography>
                          </Box>
                          <Button size="small" variant="text"
                            onClick={() => { setDatasetParams(null) }}
                            sx={{ fontSize: '0.7rem', color: '#888', textTransform: 'none', minWidth: 0 }}>
                            Clear
                          </Button>
                        </Box>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Initial Pressure (psi)"
                          placeholder="Enter pressure"
                          type="number"
                          value={initialPressure}
                          onChange={(e) => setInitialPressure(Number(e.target.value))}
                          variant="outlined"
                          disabled={!!datasetParams?.initial_pressure}
                          inputProps={{ style: { color: 'inherit' } }}
                          sx={{ '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(189, 189, 189, 0.7)', opacity: 1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Porosity (%)"
                          placeholder="Enter porosity"
                          type="number"
                          value={porosity}
                          onChange={(e) => setPorosity(Number(e.target.value))}
                          variant="outlined"
                          disabled={!!datasetParams?.porosity}
                          inputProps={{ style: { color: 'inherit' } }}
                          sx={{ '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(189, 189, 189, 0.7)', opacity: 1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Permeability (mD)"
                          placeholder="Enter permeability"
                          type="number"
                          value={permeability}
                          onChange={(e) => setPermeability(Number(e.target.value))}
                          variant="outlined"
                          disabled={!!datasetParams?.permeability}
                          inputProps={{ style: { color: 'inherit' } }}
                          sx={{ '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(189, 189, 189, 0.7)', opacity: 1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label="Water Saturation (%)"
                          placeholder="Enter saturation"
                          type="number"
                          value={waterSaturation}
                          onChange={(e) => setWaterSaturation(Number(e.target.value))}
                          variant="outlined"
                          disabled={!!datasetParams?.water_saturation}
                          inputProps={{ style: { color: 'inherit' } }}
                          sx={{ '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(189, 189, 189, 0.7)', opacity: 1 } }}
                        />
                      </Grid>
                    </Grid>

                    {datasetParams && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2">Detected dataset parameters:</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {datasetParams.initial_pressure != null ? `Initial Pressure: ${datasetParams.initial_pressure}` : 'Initial Pressure: —'}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {datasetParams.porosity != null ? `Porosity: ${Math.min((datasetParams.porosity * 100), 100).toFixed(2)}%` : 'Porosity: —'}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {datasetParams.permeability != null ? `Permeability: ${datasetParams.permeability} mD` : 'Permeability: —'}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            if (datasetParams.initial_pressure) setInitialPressure(Number(datasetParams.initial_pressure))
                            if (datasetParams.porosity) setPorosity(Number((datasetParams.porosity as number) * 100))
                            if (datasetParams.permeability) setPermeability(Number(datasetParams.permeability))
                            if (datasetParams.water_saturation) setWaterSaturation(Number((datasetParams.water_saturation as number) * 100))
                            alert('Dataset parameters applied to quick parameters')
                            }}
                          >
                            Apply dataset parameters
                          </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {uploadError && (
                <Grid item xs={12}>
                  <Alert severity="error">{uploadError}</Alert>
                </Grid>
              )}

              {uploadSuccess && (
                <Grid item xs={12}>
                  <Alert severity="success">{uploadSuccess}</Alert>
                </Grid>
              )}

              {productionFile && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={uploadDataset}
                    sx={{ backgroundColor: '#0F4C81' }}
                  >
                    Upload Dataset
                  </Button>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Tab 2: Configuration */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F4C81' }}>
                      Algorithm Selection
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Algorithm Type</InputLabel>
                      <Select
                        value={algorithmType}
                        label="Algorithm Type"
                        onChange={(e) => setAlgorithmType(e.target.value)}
                      >
                        <MenuItem value="manual">Manual Baseline Matching</MenuItem>
                        <MenuItem value="enkf">Ensemble Kalman Filter (EnKF)</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Ensemble Size"
                      type="number"
                      defaultValue={100}
                      sx={{ mb: 2 }}
                      helperText="Number of ensemble members (50-500)"
                    />

                    <FormControl fullWidth>
                      <InputLabel>Update Frequency</InputLabel>
                      <Select defaultValue="daily">
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F4C81' }}>
                      Convergence Settings
                    </Typography>
                    <TextField
                      fullWidth
                      label="Target RMSE"
                      type="number"
                      defaultValue={0.05}
                      sx={{ mb: 2 }}
                      helperText="Target root mean square error"
                    />

                    <TextField
                      fullWidth
                      label="Max Iterations"
                      type="number"
                      defaultValue={50}
                      sx={{ mb: 2 }}
                      helperText="Maximum number of iterations"
                    />

                    <TextField
                      fullWidth
                      label="Localization Radius"
                      type="number"
                      defaultValue={5}
                      helperText="Grid blocks for localization (EnKF)"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Execution */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F4C81' }}>
                      Run Simulation
                    </Typography>

                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Ensure all data has been uploaded and configuration is complete before running
                    </Alert>

                    {!isRunning ? (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayIcon />}
                          onClick={() => handleRunSimulation('baseline')}
                          sx={{
                            backgroundColor: '#0F4C81',
                            px: 4,
                            '&:hover': {
                              backgroundColor: '#0a3857',
                            },
                          }}
                        >
                          Start Baseline
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayIcon />}
                          onClick={async () => {
                            setIsRunning(true)
                            setRunProgress(0)
                            try {
                              const payload = {
                                name: `EnKF Run - ${new Date().toISOString()}`,
                                description: 'EnKF with prior/posterior forecasts',
                                matching_type: 'enkf',
                                initial_pressure: initialPressure,
                                porosity: porosity,
                                permeability: permeability,
                                water_saturation: waterSaturation,
                                ...(uploadedDatasetId && { dataset: uploadedDatasetId }),
                              }
                              console.log('[EnKF] Creating simulation with dataset:', uploadedDatasetId)
                              const createRes = await fetch(`${API_BASE}/simulations/`, {
                                method: 'POST',
                                headers: {
                                  Authorization: token ? `Token ${token}` : '',
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                              })
                              if (!createRes.ok) throw new Error('Failed to create simulation')
                              const created = await createRes.json()
                              const id = created.id
                              setSimulationId(id)

                              // Begin polling progress immediately so the UI updates while EnKF runs
                              pollProgress(id).catch((err) => {
                                console.error('[SIM] Poll error (EnKF):', err)
                              })

                              // Run EnKF with forecasts (server may stream updates to simulation.progress)
                              const enkfRes = await fetch(`${API_BASE}/simulations/${id}/run_enkf_with_forecasts/`, {
                                method: 'POST',
                                headers: {
                                  Authorization: token ? `Token ${token}` : '',
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  ensemble_size: 100,
                                  num_iterations: 10,
                                  forecast_period_days: 365,
                                }),
                              })
                              if (!enkfRes.ok) throw new Error('EnKF failed')
                              const result = await enkfRes.json()

                              // Ensure final progress and results are set (pollProgress may already have done this)
                              setRunProgress(100)
                              setResults(result.simulation)
                              setIsRunning(false)
                              setTabValue(3)
                            } catch (err) {
                              console.error(err)
                              setIsRunning(false)
                            }
                          }}
                          sx={{
                            backgroundColor: '#28a745',
                            px: 4,
                            '&:hover': {
                              backgroundColor: '#218838',
                            },
                          }}
                        >
                          Run EnKF + Forecasts
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Running simulation... {Math.round(runProgress)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(runProgress, 100)}
                          sx={{ mb: 2, height: 8, borderRadius: 4 }}
                        />
                        {runProgress >= 100 && (
                          <Alert severity="success">Simulation completed successfully!</Alert>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: '#F7F9FC',
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: '#1a2332',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F4C81' }}>
                      Simulation Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {isRunning ? 'Running' : 'Ready'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          Elapsed Time
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {Math.round(runProgress * 0.5)} sec
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          CPU Usage
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {isRunning ? '85%' : '0%'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          Memory
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {isRunning ? '2.3 GB' : '0.5 GB'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 4: Results */}
          <TabPanel value={tabValue} index={3}>
            {!results ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#F7F9FC',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      borderRadius: '12px',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81' }}>
                        Results & Visualization
                      </Typography>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        Run a simulation to view results, charts, and parameter distributions
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {/* Simulation Stats */}
                <Grid item xs={12}>
                  <Card sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                      : 'linear-gradient(135deg, #F0F7FF 0%, #E8F1FA 100%)',
                    boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15, 76, 129, 0.12)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15, 76, 129, 0.15)'}`,
                    borderRadius: '12px',
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81', display: 'flex', alignItems: 'center', gap: 1 }}>
                        🔍 Simulation Results
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 76, 129, 0.08)',
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 76, 129, 0.2)'}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 76, 129, 0.12)',
                              boxShadow: '0 4px 12px rgba(15, 76, 129, 0.15)'
                            }
                          }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                              Status
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81', fontSize: '18px' }}>
                              ✓ {results.status || 'Complete'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{
                            p: 2,
                            backgroundColor: 'rgba(40, 167, 69, 0.08)',
                            borderRadius: '8px',
                            border: '1px solid rgba(40, 167, 69, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(40, 167, 69, 0.12)',
                              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
                            }
                          }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                              Match Quality
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#4ade80' : '#28a745', fontSize: '18px' }}>
                              {results.match_quality !== undefined && results.match_quality !== null ? `${Number(results.match_quality).toFixed(2)}%` : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{
                            p: 2,
                            backgroundColor: 'rgba(255, 152, 0, 0.08)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 152, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 152, 0, 0.12)',
                              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)'
                            }
                          }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                              Duration
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#ffb74d' : '#FF9800', fontSize: '18px' }}>
                              {results.duration_seconds !== undefined && results.duration_seconds !== null && results.duration_seconds > 0
                                ? `${Math.floor(results.duration_seconds / 60)}m ${results.duration_seconds % 60}s`
                                : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.08)' : 'rgba(76, 175, 80, 0.08)',
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.12)' : 'rgba(76, 175, 80, 0.12)',
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                            }
                          }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                              Algorithm
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#81c784' : '#4CAF50', fontSize: '18px' }}>
                              {results.matching_type === 'enkf' ? 'EnKF' : 'Baseline'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* OOIP Card */}
                {results?.results_data?.ooip && (
                  <Grid item xs={12}>
                    {results.results_data.ooip.ooip_mmbbl ? (
                      <Card sx={{
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #0f2516 0%, #06150a 100%)'
                          : 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(46,125,50,0.2)'}`,
                        borderRadius: '12px',
                        boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.3)' : '0 6px 20px rgba(46,125,50,0.1)',
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: theme.palette.mode === 'dark' ? '#81c784' : '#2E7D32', display: 'flex', alignItems: 'center', gap: 1 }}>
                            🛢️ Original Oil In Place (OOIP) Estimation
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                              <Box sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.08)' : 'rgba(46,125,50,0.08)',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.15)' : 'rgba(46,125,50,0.2)'}`,
                              }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>Initial OOIP</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#81c784' : '#2E7D32' }}>
                                  {Number(results.results_data.ooip.ooip_mmbbl).toFixed(2)} MMbbl
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                  {Number(results.results_data.ooip.ooip_stb).toLocaleString()} STB
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Box sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.08)' : 'rgba(255,152,0,0.08)',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.15)' : 'rgba(255,152,0,0.2)'}`,
                              }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>Remaining after 365d</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#ffb74d' : '#E65100' }}>
                                  {Number(results.results_data.ooip.remaining_ooip_mmbbl).toFixed(2)} MMbbl
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                  {Number(results.results_data.ooip.remaining_ooip_stb).toLocaleString()} STB
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Box sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(100, 181, 246, 0.08)' : 'rgba(15,76,129,0.08)',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(100, 181, 246, 0.15)' : 'rgba(15,76,129,0.2)'}`,
                              }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>Recovery Factor</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#64b5f6' : '#0F4C81' }}>
                                  {Number(results.results_data.ooip.recovery_factor_pct).toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                  over 365 days
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Box sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(186, 104, 200, 0.08)' : 'rgba(103,58,183,0.08)',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(186, 104, 200, 0.15)' : 'rgba(103,58,183,0.2)'}`,
                              }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>Bo (FVF)</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#ba68c8' : '#673AB7' }}>
                                  {Number(results.results_data.ooip.formation_volume_factor).toFixed(3)} RB/STB
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                  {results.results_data.ooip.bo_source === "Standing's correlation"
                                    ? "📐 Standing's correlation"
                                    : '✏️ User supplied'}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ) : results.results_data.ooip.note ? (
                      <Alert severity="info" sx={{ borderRadius: '8px' }}>
                        <strong>OOIP not computed:</strong> {results.results_data.ooip.note}
                        <br />
                        <Typography variant="caption">
                          Provide <strong>Drainage Area (acres)</strong>, <strong>Net Pay Thickness (ft)</strong>, and <strong>Porosity (%)</strong> in the reservoir properties form to enable OOIP estimation.
                        </Typography>
                      </Alert>
                    ) : null}
                  </Grid>
                )}

                {/* Charts */}

                {(priorForecast || posteriorForecast) && (
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                          : 'linear-gradient(135deg, #F7F9FC 0%, #E8F1F8 100%)',
                        boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(15, 76, 129, 0.12)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15, 76, 129, 0.1)'}`,
                        borderRadius: '12px',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81', display: 'flex', alignItems: 'center', gap: 1 }}>
                          📊 Production Forecast Analysis
                        </Typography>

                        {/* Metric Selector - Enhanced */}
                        <Box sx={{ 
                          mb: 4, 
                          display: 'flex', 
                          gap: 1, 
                          flexWrap: 'wrap',
                          p: 2,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '8px',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 76, 129, 0.1)'}`
                        }}>
                          {['oil', 'water', 'gas', 'pressure'].map((metric) => (
                            <Button
                              key={metric}
                              variant={chartMetric === metric ? 'contained' : 'outlined'}
                              onClick={() => setChartMetric(metric)}
                              sx={{
                                backgroundColor: chartMetric === metric 
                                  ? (theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81')
                                  : 'transparent',
                                color: chartMetric === metric 
                                  ? (theme.palette.mode === 'dark' ? '#0f172a' : 'white')
                                  : (theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81'),
                                borderColor: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: chartMetric === metric 
                                    ? (theme.palette.mode === 'dark' ? '#7dd3fc' : '#0d3a5c')
                                    : (theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 76, 129, 0.05)'),
                                  borderColor: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0D3A5C',
                                }
                              }}
                            >
                              {metric.charAt(0).toUpperCase() + metric.slice(1)}
                            </Button>
                          ))}
                        </Box>

                        {/* Prior Forecast Chart */}
                        {priorForecast && (
                          <Box sx={{ mb: 5 }}>
                            <ForecastCharts
                              forecast={priorForecast}
                              metric={chartMetric}
                              title={`${chartMetric.toUpperCase()} - Prior Forecast`}
                              forecastType="prior"
                            />
                          </Box>
                        )}

                        {/* Posterior Forecast Chart */}
                        {posteriorForecast && (
                          <Box sx={{ mb: 3 }}>
                            <ForecastCharts
                              forecast={posteriorForecast}
                              metric={chartMetric}
                              title={`${chartMetric.toUpperCase()} - Posterior Forecast`}
                              forecastType="posterior"
                            />
                          </Box>
                        )}

                        {!priorForecast && !posteriorForecast && (
                          <Alert 
                            severity="info"
                            sx={{
                              backgroundColor: 'rgba(15, 76, 129, 0.1)',
                              color: '#0F4C81',
                              '& .MuiAlert-icon': { color: '#0F4C81' }
                            }}
                          >
                            Forecasts are being generated. This typically takes 30-60 seconds. Refresh the page in a moment.
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Production Flow Visualization */}
                {(priorForecast || posteriorForecast) && (
                  <Grid item xs={12}>
                    <ProductionFlowVisualization
                      priorData={
                        priorForecast && priorForecast.predictions
                          ? {
                              oil: priorForecast.predictions.oil?.mean?.[0] || 45,
                              water: priorForecast.predictions.water?.mean?.[0] || 65,
                              gas: priorForecast.predictions.gas?.mean?.[0] || 80,
                              pressure: priorForecast.predictions.pressure?.mean?.[0] || 150,
                            }
                          : undefined
                      }
                      posteriorData={
                        posteriorForecast && posteriorForecast.predictions
                          ? {
                              oil: posteriorForecast.predictions.oil?.mean?.[0] || 65,
                              water: posteriorForecast.predictions.water?.mean?.[0] || 45,
                              gas: posteriorForecast.predictions.gas?.mean?.[0] || 85,
                              pressure: posteriorForecast.predictions.pressure?.mean?.[0] || 180,
                            }
                          : undefined
                      }
                    />
                  </Grid>
                )}

                {/* Download Section */}
                <Grid item xs={12}>
                  {exportError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {exportError}
                    </Alert>
                  )}
                  {exportSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {exportSuccess}
                    </Alert>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={downloadResults}
                      disabled={exportLoading}
                      sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#38bdf8' : '#0F4C81',
                        color: theme.palette.mode === 'dark' ? '#0f172a' : '#fff',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0d3a5c',
                        },
                        '&:disabled': { opacity: 0.6 }
                      }}
                    >
                      {exportLoading ? 'Exporting...' : 'Download Results (JSON)'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={generatePDFReport}
                      disabled={exportLoading}
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#4ade80' : '#28a745',
                        borderColor: theme.palette.mode === 'dark' ? '#4ade80' : '#28a745',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(40, 167, 69, 0.05)',
                          borderColor: theme.palette.mode === 'dark' ? '#86efac' : '#20c04a',
                        },
                        '&:disabled': { opacity: 0.6 }
                      }}
                    >
                      {exportLoading ? 'Generating PDF...' : 'Export Report (PDF)'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </Card>

        {/* Data Drawer */}
            <DataDrawer open={dataDrawerOpen} onClose={() => setDataDrawerOpen(false)} onDatasetCreated={(id?: number) => {
              if (id) setUploadedDatasetId(id)
            }} />

          {/* Manual Entry Modal (moved from DataDrawer) */}
          <DataInputModal
            isOpen={isManualModalOpen}
            onClose={() => setIsManualModalOpen(false)}
            onSave={handleManualDatasetSave}
          />

          <AttachReservoirModal
            isOpen={isAttachModalOpen}
            onClose={() => setIsAttachModalOpen(false)}
            onAttached={(id?: number) => {
              if (id) setUploadedDatasetId(id)
            }}
          />
      </Box>
    </Container>

    {/* Floating Interpret Button - Outside container for absolute positioning */}
    {simulationId && results && (
      <InterpretButton 
        simulationId={simulationId} 
        disabled={!results}
      />
    )}

    {/* Interpretation Drawer */}
    <InterpretationDrawer />
    </>
  )
}

export default SimulatorPage
