import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productsApi from '../../api/products'

export const loadProducts = createAsyncThunk('products/loadAll', () => productsApi.fetchProducts())

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loadProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(loadProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
  },
})

export default productsSlice.reducer
