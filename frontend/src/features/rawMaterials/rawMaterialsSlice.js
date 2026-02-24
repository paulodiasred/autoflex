import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rawMaterialsApi from '../../api/rawMaterials'

export const loadRawMaterials = createAsyncThunk('rawMaterials/loadAll', () => rawMaterialsApi.fetchRawMaterials())

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRawMaterials.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loadRawMaterials.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(loadRawMaterials.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
  },
})

export default rawMaterialsSlice.reducer
