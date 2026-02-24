import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">Paulo Dias - Autoflex Challenge</span>
      <ul className="navbar-links">
        <li><NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Produtos</NavLink></li>
        <li><NavLink to="/raw-materials" className={({ isActive }) => isActive ? 'active' : ''}>Matérias-Primas</NavLink></li>
        <li><NavLink to="/capacity" className={({ isActive }) => isActive ? 'active' : ''}>Capacidade de Produção</NavLink></li>
      </ul>
    </nav>
  )
}
