import axiosClient from './axiosClient'

export const getPrepGuide = (companyName) =>
  axiosClient.get(`/ai/prep/${encodeURIComponent(companyName)}`).then((r) => r.data)
export const getFitScore = (jobId) => axiosClient.get(`/ai/fit-score/${jobId}`).then((r) => r.data)
