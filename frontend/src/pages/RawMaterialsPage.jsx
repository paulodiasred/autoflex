// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadRawMaterials } from '../features/rawMaterials/rawMaterialsSlice'
import * as rawMaterialsApi from '../api/rawMaterials'
import Modal from '../components/Modal'
import './Page.css'

const emptyForm = { name: '', description: '', stockQuantity: '', unit: '' }

export default function RawMaterialsPage() {
  const dispatch = useDispatch()
  const { items: rawMaterials, loading } = useSelector((s) => s.rawMaterials)

  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { dispatch(loadRawMaterials()) }, [dispatch])

  const filteredAndSortedMaterials = useMemo(() => {
    if (!rawMaterials || rawMaterials.length === 0) return []

    const filtered = rawMaterials.filter(material => {
      const searchLower = searchTerm.toLowerCase().trim()
      if (searchLower === '') return true

      return material.id.toString().includes(searchLower) ||
        material.name.toLowerCase().includes(searchLower) ||
        (material.description && material.description.toLowerCase().includes(searchLower)) ||
        material.unit.toLowerCase().includes(searchLower)
    })

    return filtered.sort((a, b) => {
      if (a.stockQuantity === 0 && b.stockQuantity > 0) return -1
      if (a.stockQuantity > 0 && b.stockQuantity === 0) return 1

      if (a.stockQuantity !== b.stockQuantity) {
        return a.stockQuantity - b.stockQuantity
      }

      return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    })
  }, [rawMaterials, searchTerm])

  const clearSearch = () => setSearchTerm('')

  const openCreate = () => { setForm(emptyForm); setError(null); setModal('create') }
  const openEdit = (rm) => {
    setForm({ name: rm.name, description: rm.description || '', stockQuantity: rm.stockQuantity, unit: rm.unit })
    setError(null)
    setModal(rm)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = { ...form, stockQuantity: Number(form.stockQuantity) }
      if (modal === 'create') {
        await rawMaterialsApi.createRawMaterial(payload)
      } else {
        await rawMaterialsApi.updateRawMaterial(modal.id, payload)
      }
      dispatch(loadRawMaterials())
      setModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta matéria-prima?')) return
    try {
      await rawMaterialsApi.deleteRawMaterial(id)
      dispatch(loadRawMaterials())
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Matérias-Primas</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Nova Matéria-Prima</button>
      </div>

      <div className="search-bar">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, ID, unidade..."
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
              {filteredAndSortedMaterials.length} {filteredAndSortedMaterials.length === 1 ? 'material encontrado' : 'materiais encontrados'}
            </span>
          </div>
        )}
      </div>

      {loading && <p className="loading">Carregando...</p>}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Estoque</th>
              <th>Unidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredAndSortedMaterials.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  <div className="empty-icon">
                    {searchTerm ? '🔍' : '🧱'}
                  </div>
                  <p className="empty-text">
                    {searchTerm
                      ? `Nenhum material encontrado para "${searchTerm}".`
                      : 'Nenhuma matéria-prima cadastrada ainda.'
                    }
                    <br />
                    {searchTerm
                      ? <button className="btn btn-link" onClick={clearSearch}>Limpar busca</button>
                      : 'Clique em "+ Nova Matéria-Prima" para começar.'
                    }
                  </p>
                </td>
              </tr>
            )}
            {filteredAndSortedMaterials.map((rm) => (
              <tr key={rm.id} className={rm.stockQuantity === 0 ? 'row-critical' : rm.stockQuantity < 10 ? 'row-warning' : ''}>
                <td>{rm.id}</td>
                <td>{rm.name}</td>
                <td>{rm.description || '—'}</td>
                <td>
                  <span className={`stock-badge ${rm.stockQuantity === 0 ? 'stock-zero' : rm.stockQuantity < 10 ? 'stock-low' : 'stock-ok'}`}>
                    {rm.stockQuantity}
                  </span>
                </td>
                <td>{rm.unit}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-edit" onClick={() => openEdit(rm)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rm.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'Nova Matéria-Prima' : 'Editar Matéria-Prima'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleSave} className="form">
            <div className="form-group">
              <label>Nome *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} placeholder="Nome" />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={2} placeholder="Descrição opcional" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Estoque Atual *</label>
                <input className="input" type="number" min="0" step="0.0001" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required placeholder="Ex: 100" />
              </div>
              <div className="form-group">
              <label>Unidade *</label>
                <select
                  className="input"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="kg">kg (Quilograma)</option>
                  <option value="g">g (Grama)</option>
                  <option value="L">L (Litro)</option>
                  <option value="ml">ml (Mililitro)</option>
                  <option value="un">un (Unidade)</option>
                  <option value="m">m (Metro)</option>
                  <option value="cm">cm (Centímetro)</option>
                  <option value="m²">m² (Metro quadrado)</option>
                  <option value="m³">m³ (Metro cúbico)</option>
                  <option value="cx">cx (Caixa)</option>
                  <option value="pc">pc (Peça)</option>
                  <option value="par">par (Par)</option>
                  <option value="dúzia">dúzia (Dúzia)</option>
                </select>
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
