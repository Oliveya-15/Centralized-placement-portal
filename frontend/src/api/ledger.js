import axiosClient from './axiosClient'

export const searchLedger = (filters) =>
  axiosClient.get('/ledger', { params: filters }).then((r) => r.data)
