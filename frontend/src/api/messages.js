import axiosClient from './axiosClient'

export const getContacts = () => axiosClient.get('/messages/contacts').then((r) => r.data)
export const getThread = (otherUserId) => axiosClient.get(`/messages/thread/${otherUserId}`).then((r) => r.data)
export const sendMessage = (receiverId, content) =>
  axiosClient.post('/messages', { receiverId, content }).then((r) => r.data)
