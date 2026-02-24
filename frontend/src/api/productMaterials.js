import client from './client'

export const fetchProductMaterials = (productId) =>
  client.get(`/products/${productId}/materials`).then((r) => r.data)

export const addProductMaterial = (productId, data) =>
  client.post(`/products/${productId}/materials`, data).then((r) => r.data)

export const updateProductMaterial = (productId, associationId, data) =>
  client.put(`/products/${productId}/materials/${associationId}`, data).then((r) => r.data)

export const deleteProductMaterial = (productId, associationId) =>
  client.delete(`/products/${productId}/materials/${associationId}`)
