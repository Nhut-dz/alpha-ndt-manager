import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
}

// Posts
export const postAPI = {
  list: () => api.get('/posts'),
  get: (id) => api.get(`/posts/${id}`),
  create: (data) => {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, v) })
    return api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  update: (id, data) => {
    const fd = new FormData()
    fd.append('_method', 'PUT')
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, v) })
    return api.post(`/posts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  delete: (id) => api.delete(`/posts/${id}`),
}

// Post Categories
export const categoryAPI = {
  list: () => api.get('/post-categories'),
  create: (data) => api.post('/post-categories', data),
  update: (id, data) => api.put(`/post-categories/${id}`, data),
  delete: (id) => api.delete(`/post-categories/${id}`),
}

// Contacts
export const contactAPI = {
  list: () => api.get('/contacts'),
  get: (id) => api.get(`/contacts/${id}`),
  updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/contacts/${id}`),
}

export default api
