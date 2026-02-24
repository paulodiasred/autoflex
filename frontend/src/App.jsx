import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductsPage from './pages/ProductsPage'
import RawMaterialsPage from './pages/RawMaterialsPage'
import CapacityPage from './pages/CapacityPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/raw-materials" element={<RawMaterialsPage />} />
        <Route path="/capacity" element={<CapacityPage />} />
      </Routes>
    </BrowserRouter>
  )
}
