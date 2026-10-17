import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDrawerOpen, clearInterpretation } from '../store/slices/interpretationSlice'
import type { RootState } from '../store/store'

export const InterpretationDrawer: React.FC = () => {
  const dispatch = useDispatch()
  const { interpretation, drawerOpen, loading } = useSelector(
    (state: RootState) => state.interpretation
  )

  // State for Accordion Sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    wellPerformance: true,
    pressure: true,
    water: false,
    trends: false,
    forecast: true,
    risks: true,
    recommendations: true,
    metrics: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleClose = () => dispatch(setDrawerOpen(false))

  // Helpers for dynamic styling
  const getStatusColor = (status: string) => {
    const normalized = status?.toLowerCase().replace(/\s+/g, '-') || ''
    const statusMap: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800 border-green-200',
      strong: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      poor: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    }
    return statusMap[normalized] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const p = priority?.toLowerCase()
    if (p === 'high') return 'border-l-4 border-red-500 bg-red-50'
    if (p === 'medium') return 'border-l-4 border-yellow-500 bg-yellow-50'
    return 'border-l-4 border-green-500 bg-green-50'
  }

  if (!drawerOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[1999] backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 w-full max-w-2xl h-screen bg-slate-50 shadow-2xl z-[2000] flex flex-col animate-in slide-in-from-right duration-300 dark:bg-[#0B0F19] dark:text-slate-100 dark:border-l dark:border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1F7A8C] dark:from-[#090D16] dark:to-[#0F172A] text-white p-6 flex justify-between items-center shadow-lg dark:border-b dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold dark:text-[#F8FAFC]">Simulation Interpretation</h2>
            {interpretation?.interpretation_timestamp && (
              <p className="text-xs opacity-80 dark:text-[#94A3B8]">
                Ref: {new Date(interpretation.interpretation_timestamp).toLocaleString()}
              </p>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0F4C81] dark:border-slate-800 dark:border-t-[#38BDF8] rounded-full animate-spin" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Analyzing reservoir data...</p>
            </div>
          ) : interpretation ? (
            <>
              {/* Executive Summary Section */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-[#111827] dark:border-white/10">
                  <button 
                    onClick={() => toggleSection('summary')}
                    className="w-full p-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors dark:bg-transparent dark:hover:bg-white/5"
                  >
                    <span className="font-bold text-[#0F4C81] dark:text-[#38BDF8] flex items-center gap-2">📊 Executive Summary</span>
                    <span className={`transform transition-transform ${expandedSections.summary ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {expandedSections.summary && (
                    <div className="p-4 border-t border-slate-100 dark:border-white/10">
                      <p className="text-sm text-slate-700 leading-relaxed italic dark:text-slate-300">{interpretation.executive_summary}</p>
                    </div>
                  )}
                </section>

              {/* Well Performance Grid */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Well Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interpretation.well_performance?.assessment?.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm dark:bg-[#111827] dark:border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.metric}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-[#0F4C81] dark:text-[#38BDF8]">{item.value}</div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-snug dark:text-slate-300">{item.insight}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Risk Factors */}
              {interpretation.risk_assessment && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-[#111827] dark:border-white/10">
                  <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center dark:bg-red-950/40 dark:border-red-900/40">
                    <h3 className="font-bold text-red-800 flex items-center gap-2 dark:text-red-300">⚠️ Risk Factors</h3>
                    <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md dark:bg-red-900/60 dark:text-red-300">
                      Score: {interpretation.risk_assessment.risk_score}/100
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {interpretation.risk_assessment.risk_factors?.map((risk: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-white/10">
                        <div className="flex justify-between font-semibold text-sm mb-1">
                          <span className="dark:text-slate-200">{risk.category}</span>
                          <span className={risk.level === 'High' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}>{risk.level}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{risk.factor}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1 dark:text-slate-400">Engineering Actions</h3>
                {interpretation.recommendations?.map((rec: any, i: number) => (
                  <div key={i} className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)} shadow-sm dark:bg-[#111827] dark:border-white/10`}>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-sm dark:text-slate-100">{rec.title}</h4>
                      <span className="text-[10px] font-black uppercase opacity-60 dark:text-slate-300">{rec.priority} Priority</span>
                    </div>
                      <p className="text-xs text-slate-700 mb-2 dark:text-slate-300">{rec.description}</p>
                      <div className="text-[10px] font-medium text-slate-500 flex gap-4 pt-2 border-t border-black/5 dark:border-white/10 dark:text-slate-400">
                      <span>Benefit: {rec.expected_benefit}</span>
                      <span>Effort: {rec.implementation_effort}</span>
                    </div>
                  </div>
                ))}
              </section>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">No interpretation data available.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 dark:bg-[#0B0F19] dark:border-white/10">
          <button 
            onClick={() => dispatch(clearInterpretation())}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            Clear Analysis
          </button>
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-[#0F4C81] dark:bg-[#38BDF8] text-white dark:text-[#090D16] text-sm font-bold rounded-lg hover:bg-[#0a355a] dark:hover:bg-[#7DD3FC] shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </>
  )
}