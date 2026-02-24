import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as capacityApi from '../../api/capacity'

export const loadCapacity = createAsyncThunk('capacity/loadAll', () => capacityApi.fetchProductionCapacity())

const capacitySlice = createSlice({
  name: 'capacity',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCapacity.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loadCapacity.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(loadCapacity.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
  },
})

export default capacitySlice.reducer
