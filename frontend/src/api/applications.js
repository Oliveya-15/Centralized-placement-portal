import axiosClient from './axiosClient'

export const applyToJob = (jobId) => axiosClient.post(`/applications/apply/${jobId}`).then((r) => r.data)
export const myApplications = () => axiosClient.get('/applications/me').then((r) => r.data)
export const applicationsForJob = (jobId) => axiosClient.get(`/applications/job/${jobId}`).then((r) => r.data)
export const applicationsForTpo = () => axiosClient.get('/applications/tpo').then((r) => r.data)
export const updateApplicationStatus = (id, payload) =>
  axiosClient.patch(`/applications/${id}/status`, payload).then((r) => r.data)
