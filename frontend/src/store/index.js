import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'
import rawMaterialsReducer from '../features/rawMaterials/rawMaterialsSlice'
import capacityReducer from '../features/capacity/capacitySlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    capacity: capacityReducer,
  },
})
