import client from './client'

export const fetchRawMaterials = () => client.get('/raw-materials').then((r) => r.data)
export const createRawMaterial = (data) => client.post('/raw-materials', data).then((r) => r.data)
export const updateRawMaterial = (id, data) => client.put(`/raw-materials/${id}`, data).then((r) => r.data)
export const deleteRawMaterial = (id) => client.delete(`/raw-materials/${id}`)
