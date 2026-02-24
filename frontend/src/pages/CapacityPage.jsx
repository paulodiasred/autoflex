// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCapacity } from '../features/capacity/capacitySlice'
import './Page.css'
import './CapacityPage.css'

function Tooltip({ materials, anchor }) {
  if (!anchor || !materials || materials.length === 0) return null

  const GAP = 12
  const style = {
    position: 'fixed',
    top: anchor.top - GAP,
    left: anchor.left + anchor.width / 2,
    transform: 'translate(-50%, -100%)',
    zIndex: 9999,
  }

  return (
    <div className="tooltip-box" style={style}>
      <table className="tooltip-table">
        <thead>
          <tr>
            <th>Matéria-prima</th>
            <th>Necessário</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, i) => {
            const ok = Number(m.availableStock) >= Number(m.requiredQuantity)
            return (
              <tr key={i} className={ok ? '' : 'tooltip-row-danger'}>
                <td>{m.name}</td>
                <td>{m.requiredQuantity} {m.unit}</td>
                <td>{m.availableStock} {m.unit}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="tooltip-arrow" />
    </div>
  )
}

export default function CapacityPage() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((s) => s.capacity)
  const [tooltip, setTooltip] = useState(null)
  const [sortOrder, setSortOrder] = useState('priority')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { dispatch(loadCapacity()) }, [dispatch])

  const filteredAndSortedItems = useMemo(() => {
    if (!items || items.length === 0) return []
    
    const filtered = items.filter(item => {
      const searchLower = searchTerm.toLowerCase().trim()
      if (searchLower === '') return true
      
      return item.productId.toString().includes(searchLower) ||
             item.productName.toLowerCase().includes(searchLower)
    })
    
    return filtered.sort((a, b) => {
      const aViable = Number(a.producibleQuantity) > 0
      const bViable = Number(b.producibleQuantity) > 0
      
      if (aViable && !bViable) return -1
      if (!aViable && bViable) return 1
      
      if (aViable && bViable) {
        return Number(b.producibleQuantity) - Number(a.producibleQuantity)
      }
      
      return a.productName.localeCompare(b.productName)
    })
  }, [items, searchTerm])

  const clearSearch = () => setSearchTerm('')

  const showTooltip = useCallback((e, materials) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ anchor: rect, materials })
  }, [])

  const hideTooltip = useCallback(() => setTooltip(null), [])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Capacidade de Produção</h1>
        <button className="btn btn-primary" onClick={() => dispatch(loadCapacity())}>↺ Atualizar</button>
      </div>

      <p className="page-description">
        Exibe todos os produtos e quantas unidades podem ser produzidas com base no estoque atual de matérias-primas.
        Passe o mouse sobre o status para ver os detalhes de cada insumo.
      </p>

      <div className="search-bar">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome ou ID do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch}>✕</button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results">
            <span className="results-count">
              {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </span>
          </div>
        )}
      </div>

      {loading && <p className="loading">Calculando...</p>}
      {error && <p className="form-error">{error}</p>}

      <Tooltip materials={tooltip?.materials} anchor={tooltip?.anchor} />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Quantidade Possível</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredAndSortedItems.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  <div className="empty-icon">
                    {searchTerm ? '🔍' : '🏭'}
                  </div>
                  <p className="empty-text">
                    {searchTerm 
                      ? `Nenhum produto encontrado para "${searchTerm}".` 
                      : 'Nenhum produto cadastrado ainda.'
                    }
                    <br />
                    {searchTerm 
                      ? <button className="btn btn-link" onClick={clearSearch}>Limpar busca</button>
                      : 'Cadastre produtos e associe matérias-primas.'
                    }
                  </p>
                </td>
              </tr>
            )}
            {filteredAndSortedItems.map((item) => {
              const viable = Number(item.producibleQuantity) > 0
              return (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>
                    <span className={`badge ${viable ? 'badge-green' : 'badge-red'}`}>
                      {item.producibleQuantity} un.
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${viable ? 'badge-green' : 'badge-red'} badge-hoverable`}
                      onMouseEnter={(e) => showTooltip(e, item.materials)}
                      onMouseLeave={hideTooltip}
                    >
                      {viable ? 'Viável' : 'Inviável'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}