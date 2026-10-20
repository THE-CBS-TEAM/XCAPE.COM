import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const SENSITIVITY_LIB = '/libs/gas-lift-sensitivity-analyzer-frontend.umd.js'
const SENSITIVITY_CSS = '/libs/style.css'

function getGlobalLib() {
  // UMD attaches to global Pt.SensitivityAnalyzer or global SensitivityAnalyzer
  const g = (window as any).Pt?.SensitivityAnalyzer || (window as any).SensitivityAnalyzer
  return g && g.default ? g.default : g
}

const SensitivityPage: React.FC = () => {
  const [loaded, setLoaded] = React.useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { token } = useAuth()

  // Compute the correct sensitivity backend base URL:
  // Respect VITE_API_URL / VITE_API_BASE_URL if configured,
  // otherwise if running locally on localhost/127.0.0.1 target localhost:8000,
  // otherwise default to the production Render backend URL.
  const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim()
  let apiBase = ''
  if (rawApiUrl) {
    apiBase = `${rawApiUrl.replace(/\/+$/, '')}/sensitivity`
  } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    apiBase = 'http://localhost:8000/api/sensitivity'
  } else {
    apiBase = 'https://xcape-backend-com.onrender.com/api/sensitivity'
  }

  // Sync token whenever it changes or loads from localStorage
  useEffect(() => {
    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)
    if (typeof window !== 'undefined') {
      ;(window as any).__SENSITIVITY_API_BASE__ = apiBase
      if (activeToken) {
        ;(window as any).__SENSITIVITY_AUTH_TOKEN__ = activeToken
      }
    }
    const lib = getGlobalLib()
    if (lib && typeof lib.setAuthToken === 'function' && activeToken) {
      lib.setAuthToken(activeToken)
    }
  }, [token, apiBase])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)

    if (typeof window !== 'undefined') {
      ;(window as any).__SENSITIVITY_API_BASE__ = apiBase
      if (activeToken) {
        ;(window as any).__SENSITIVITY_AUTH_TOKEN__ = activeToken
      }
    }

    async function mountLib() {
      const lib = getGlobalLib()
      if (!lib) return
      try {
        if (typeof lib.setApiBase === 'function') lib.setApiBase(apiBase)
        // If XCAPE has an auth token in context or storage, pass it to the embedded lib
        const currentAuth = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)
        if (currentAuth && typeof lib.setAuthToken === 'function') {
          lib.setAuthToken(currentAuth)
        }

        if (typeof lib.mount === 'function') {
          lib.mount(container, { apiBase })
          setLoaded(true)
        } else {
          console.error('Sensitivity library missing mount()')
        }
      } catch (err) {
        console.error('Error mounting sensitivity lib', err)
      }
    }

    const existing = getGlobalLib()
    if (existing) {
      try { if (existing.unmount) existing.unmount(container) } catch {}
    }

    // Ensure host React/ReactDOM globals exist for the UMD bundle
    if (!(window as any).React) {
      ;(window as any).React = React
    }
    if (!(window as any).ReactDOM) {
      ;(window as any).ReactDOM = ReactDOM
    }
    // Some UMD bundles call createRoot from react-dom; ensure react-dom/client is available
    if (!(window as any).ReactDOMClient) {
      ;(window as any).ReactDOMClient = ReactDOMClient
    }

    // Ensure `process` exists in the browser for UMD bundles that reference it
    if (!(window as any).process) {
      ;(window as any).process = { env: { NODE_ENV: 'production' } }
    }

    const cacheBuster = Date.now()
    const cssHref = `${SENSITIVITY_CSS}?t=${cacheBuster}`
    const libSrc = `${SENSITIVITY_LIB}?t=${cacheBuster}`

    // Load CSS file
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = cssHref
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = libSrc
    script.async = true
    script.onload = () => { mountLib().catch(err => console.error(err)) }
    script.onerror = (e) => console.error('Failed to load sensitivity library', e)
    document.body.appendChild(script)

    return () => {
      const lib = getGlobalLib()
      try { if (lib && lib.unmount) lib.unmount(container) } catch {}
      if (script.parentNode) script.parentNode.removeChild(script)
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [apiBase])

  return (
    <Box sx={{ height: '100%', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
      {!loaded && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <div id="sensitivity-root" ref={containerRef} style={{ width: '100%', flex: 1, overflowY: 'auto' }} />
    </Box>
  )
}

export default SensitivityPage
