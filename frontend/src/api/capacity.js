import client from './client'

export const fetchProductionCapacity = () => client.get('/production-capacity').then((r) => r.data)
