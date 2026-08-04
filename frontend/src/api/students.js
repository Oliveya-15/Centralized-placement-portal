import axiosClient from './axiosClient'

export const getMyProfile = () => axiosClient.get('/students/me').then((r) => r.data)
export const updateMyProfile = (payload) => axiosClient.put('/students/me', payload).then((r) => r.data)
export const getStudentProfile = (userId) => axiosClient.get(`/students/${userId}`).then((r) => r.data)
