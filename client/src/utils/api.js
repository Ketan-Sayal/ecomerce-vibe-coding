import Cookies from 'js-cookie'

// Helper function to make API calls with auth token from cookies
export const apiCall = async (url, options = {}) => {
  const token = Cookies.get('authToken')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies in request
  })

  return response
}

// GET request
export const get = (url, options = {}) => {
  return apiCall(url, { ...options, method: 'GET' })
}

// POST request
export const post = (url, body, options = {}) => {
  return apiCall(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// PATCH request
export const patch = (url, body, options = {}) => {
  return apiCall(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

// DELETE request
export const deleteRequest = (url, body = null, options = {}) => {
  const config = { ...options, method: 'DELETE' }
  if (body) {
    config.body = JSON.stringify(body)
  }
  return apiCall(url, config)
}
