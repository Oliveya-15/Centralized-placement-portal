import axiosClient from './axiosClient'

export const getTpoStats = () => axiosClient.get('/dashboard/tpo-stats').then((r) => r.data)
