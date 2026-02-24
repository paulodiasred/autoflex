// Desenvolvido por Paulo Dias - Autoflex Challenge 2026
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadProducts } from '../features/products/productsSlice'
import { loadRawMaterials } from '../features/rawMaterials/rawMaterialsSlice'
import * as productsApi from '../api/products'
import * as productMaterialsApi from '../api/productMaterials'
import Modal from '../components/Modal'
import './Page.css'

const emptyProduct = { name: '', description: '' }
const emptyMaterial = { rawMaterialId: '', requiredQuantity: '' }

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((s) => s.products)
  const { items: rawMaterials } = useSelector((s) => s.rawMaterials)

  const [searchTerm, setSearchTerm] = useState('')
  const [productModal, setProductModal] = useState(null)
  const [materialsModal, setMaterialsModal] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [materialForm, setMaterialForm] = useState(emptyMaterial)
  const [materials, setMaterials] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [materialsCount, setMaterialsCount] = useState({})

  const loadMaterialsCount = useCallback(async () => {
    if (!products || products.length === 0) return
    
    const counts = {}
    for (const product of products) {
      try {
        const data = await productMaterialsApi.fetchProductMaterials(product.id)
        counts[product.id] = data.length
      } catch (error) {
        counts[product.id] = 0
      }
    }
    setMaterialsCount(counts)
  }, [products])

  useEffect(() => {
    if (products.length > 0) {
      loadMaterialsCount()
    }
  }, [products, loadMaterialsCount])

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || products.length === 0) return []

    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase().trim()
      if (searchLower === '') return true

      return product.id.toString().includes(searchLower) ||
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
    })

    return filtered.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    )
  }, [products, searchTerm])

  const clearSearch = () => setSearchTerm('')

  useEffect(() => {
    dispatch(loadProducts())
    dispatch(loadRawMaterials())
  }, [dispatch])

  const openCreate = () => { setForm(emptyProduct); setError(null); setProductModal('create') }
  const openEdit = (p) => { setForm({ name: p.name, description: p.description || '' }); setError(null); setProductModal(p) }

  const openMaterials = useCallback(async (product) => {
    setError(null)
    setMaterialForm(emptyMaterial)
    setMaterialsModal(product)
    const data = await productMaterialsApi.fetchProductMaterials(product.id)
    setMaterials(data)
  }, [])

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (productModal === 'create') {
        await productsApi.createProduct(form)
      } else {
        await productsApi.updateProduct(productModal.id, form)
      }
      dispatch(loadProducts())
      setProductModal(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Excluir este produto?')) return
    try {
      await productsApi.deleteProduct(id)
      dispatch(loadProducts())
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddMaterial = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await productMaterialsApi.addProductMaterial(materialsModal.id, {
        rawMaterialId: Number(materialForm.rawMaterialId),
        requiredQuantity: Number(materialForm.requiredQuantity),
      })
      const data = await productMaterialsApi.fetchProductMaterials(materialsModal.id)
      setMaterials(data)
      setMaterialForm(emptyMaterial)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMaterial = async (associationId) => {
    if (!confirm('Remover esta matéria-prima?')) return
    try {
      await productMaterialsApi.deleteProductMaterial(materialsModal.id, associationId)
      const data = await productMaterialsApi.fetchProductMaterials(materialsModal.id)
      setMaterials(data)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Produtos</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Produto</button>
      </div>

      <div className="search-bar">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, ID ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
        <div className="search-results">
          {searchTerm && (
            <span className="results-count">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'resultado' : 'resultados'}
            </span>
          )}
        </div>
      </div>

      {loading && <p className="loading">Carregando...</p>}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Materiais</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description || '—'}</td>
                <td>
                  <span className={`material-status ${materialsCount[p.id] > 0 ? 'status-complete' : 'status-incomplete'}`}>
                    {materialsCount[p.id] > 0 ? (
                      <>✅ {materialsCount[p.id]} {materialsCount[p.id] === 1 ? 'insumo' : 'insumos'}</>
                    ) : (
                      <>⚠️ Sem materiais</>
                    )}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn btn-sm btn-materials" onClick={() => openMaterials(p)}>Gerenciar</button>
                  <button className="btn btn-sm btn-edit" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productModal !== null && (
        <Modal
          title={productModal === 'create' ? 'Novo Produto' : 'Editar Produto'}
          onClose={() => setProductModal(null)}
        >
          <form onSubmit={handleSaveProduct} className="form">
            <div className="form-group">
              <label>Nome *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                placeholder="Nome do produto"
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={500}
                rows={3}
                placeholder="Descrição opcional"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setProductModal(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Modal>
      )}

      {materialsModal && (
        <Modal title={`Materiais — ${materialsModal.name}`} onClose={() => setMaterialsModal(null)}>
          <div className="materials-section">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Matéria-Prima</th>
                  <th>Qtd. Necessária</th>
                  <th>Unidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {materials.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty">
                      <div className="empty-icon">🔩</div>
                      <p className="empty-text">Nenhum material associado.</p>
                    </td>
                  </tr>
                )}
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td>{m.rawMaterialName}</td>
                    <td>{m.requiredQuantity}</td>
                    <td>{m.rawMaterialUnit}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMaterial(m.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="section-subtitle">Adicionar Matéria-Prima</h3>
            <form onSubmit={handleAddMaterial} className="form form-inline">
              <div className="form-group">
                <label>Matéria-Prima *</label>
                <select
                  className="input"
                  value={materialForm.rawMaterialId}
                  onChange={(e) => setMaterialForm({ ...materialForm, rawMaterialId: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  {rawMaterials.map((rm) => (
                    <option key={rm.id} value={rm.id}>{rm.name} ({rm.unit})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantidade Necessária *</label>
                <input
                  className="input"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={materialForm.requiredQuantity}
                  onChange={(e) => setMaterialForm({ ...materialForm, requiredQuantity: e.target.value })}
                  required
                  placeholder="Ex: 2.5"
                />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adicionando...' : 'Adicionar'}</button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}
