import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { username, email, password, confirmPassword } = formData

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirmPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      // Store token in cookie and user in localStorage
      Cookies.set('authToken', data.data.token, { expires: 7 })
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // Dispatch custom event to notify App of user change
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.data.user }))

      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
      setIsSignup(false)
      setTimeout(() => navigate('/'), 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { email, password } = formData

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store token in cookie and user in localStorage
      Cookies.set('authToken', data.data.token, { expires: 7 })
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // Dispatch custom event to notify App of user change
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.data.user }))

      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
      setTimeout(() => navigate('/'), 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = isSignup ? handleSignup : handleSignin

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#8b7355' }}>
        {isSignup ? 'Create Account' : 'Sign In'}
      </h2>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: 16, backgroundColor: '#fee', color: '#c33', borderRadius: 4, border: '1px solid #fcc' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
              required
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
            {isSignup ? 'Email' : 'Email'}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
            required
          />
        </div>

        {isSignup && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' }}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: loading ? '#ccc' : '#8b7355',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 12
          }}
        >
          {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 20, borderTop: '1px solid #ddd', paddingTop: 16 }}>
        <p>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setFormData({ username: '', email: '', password: '', confirmPassword: '' })
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            {isSignup ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
