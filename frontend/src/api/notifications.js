import axiosClient from './axiosClient'

export const broadcastNotification = (payload) =>
  axiosClient.post('/notifications/broadcast', payload).then((r) => r.data)
export const myNotifications = () => axiosClient.get('/notifications/me').then((r) => r.data)
export const sentNotifications = () => axiosClient.get('/notifications/sent').then((r) => r.data)
export const markNotificationRead = (id) => axiosClient.patch(`/notifications/${id}/read`).then((r) => r.data)
