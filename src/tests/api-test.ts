// This file is for testing the API imports
import {
  API_BASE_URL,
  del,
  fetchWithAuth,
  get,
  post,
  put,
} from '@/services/api'

// Test that all exports are functions
console.log('Testing API exports:')
console.log('fetchWithAuth type:', typeof fetchWithAuth)
console.log('get type:', typeof get)
console.log('post type:', typeof post)
console.log('put type:', typeof put)
console.log('del type:', typeof del)
console.log('API_BASE_URL:', API_BASE_URL)

// Test that fetchWithAuth is callable
if (typeof fetchWithAuth === 'function') {
  console.log('✅ fetchWithAuth is a function')
} else {
  console.log('❌ fetchWithAuth is NOT a function')
}

export { API_BASE_URL, del, fetchWithAuth, get, post, put }
