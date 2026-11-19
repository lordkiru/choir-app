import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

// Inject JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('choir_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Auth ---
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// --- Songs ---
export const getActiveSongs = () => api.get('/songs/active')
export const createSong = (formData) =>
  api.post('/songs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteSong = (id) => api.delete(`/songs/${id}`)

// --- Submissions ---
export const submitRecording = (formData) =>
  api.post('/submissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getMySubmissions = (songId) =>
  api.get('/submissions/my', { params: songId ? { songId } : {} })
export const getSubmissionsForReview = (songId) =>
  api.get('/submissions/review', { params: songId ? { songId } : {} })
export const reviewSubmission = (id, data) => api.patch(`/submissions/${id}/review`, data)

// --- Approvals ---
export const getFinalList = (weekLabel) =>
  api.get('/approvals/final-list', { params: weekLabel ? { weekLabel } : {} })
export const resetWeek = () => api.post('/approvals/admin/reset-week')

export default api
