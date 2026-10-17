import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface InterpretationState {
  interpretation: any | null
  loading: boolean
  error: string | null
  simulationId: number | null
  drawerOpen: boolean
}

const initialState: InterpretationState = {
  interpretation: null,
  loading: false,
  error: null,
  simulationId: null,
  drawerOpen: false,
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Async thunk for fetching interpretation
export const fetchInterpretation = createAsyncThunk(
  'interpretation/fetchInterpretation',
  async (
    { simulationId, token }: { simulationId: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/simulations/${simulationId}/interpret/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.error || 'Failed to generate interpretation')
      }

      const data = await response.json()
      return data.interpretation
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }
)

const interpretationSlice = createSlice({
  name: 'interpretation',
  initialState,
  reducers: {
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload
    },
    setSimulationId: (state, action: PayloadAction<number>) => {
      state.simulationId = action.payload
    },
    clearInterpretation: (state) => {
      state.interpretation = null
      state.error = null
      state.simulationId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterpretation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchInterpretation.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false
          state.interpretation = action.payload
          state.drawerOpen = true
        }
      )
      .addCase(fetchInterpretation.rejected, (state, action) => {
        state.loading = false
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Failed to generate interpretation'
      })
  },
})

export const {
  setDrawerOpen,
  setSimulationId,
  clearInterpretation,
} = interpretationSlice.actions

export default interpretationSlice.reducer
