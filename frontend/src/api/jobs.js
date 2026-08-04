import axiosClient from './axiosClient'

export const listOpenJobs = () => axiosClient.get('/jobs').then((r) => r.data)
export const listAllJobs = () => axiosClient.get('/jobs/all').then((r) => r.data)
export const listMyJobs = () => axiosClient.get('/jobs/mine').then((r) => r.data)
export const getJob = (id) => axiosClient.get(`/jobs/${id}`).then((r) => r.data)
export const createJob = (payload) => axiosClient.post('/jobs', payload).then((r) => r.data)
export const updateJob = (id, payload) => axiosClient.put(`/jobs/${id}`, payload).then((r) => r.data)
export const closeJob = (id) => axiosClient.patch(`/jobs/${id}/close`).then((r) => r.data)
