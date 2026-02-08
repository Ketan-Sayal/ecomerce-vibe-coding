import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import './styles/App.css'

function App() {
  const emptyCart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  }

  // ✅ Lazy initialize sessionId (no effect needed)
  const [sessionId] = useState(() => {
    const storedSessionId = localStorage.getItem('sessionId')

    if (storedSessionId) return storedSessionId

    const newSessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`

    localStorage.setItem('sessionId', newSessionId)
    return newSessionId
  })

  const [cart, setCart] = useState(emptyCart)
  const [user, setUser] = useState(null)

  // ✅ Fetch cart when sessionId changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${sessionId}`
        )

        if (response.ok) {
          const data = await response.json()
          setCart(data.data || emptyCart)
        } else {
          setCart(emptyCart)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
        setCart(emptyCart)
      }
    }

    if (sessionId) {
      fetchCart()
    }
  }, [sessionId])

  // ✅ Load user from storage on mount
  useEffect(() => {
    const storedToken = Cookies.get('authToken')
    const storedUser = localStorage.getItem('user')

    const setterFn = ()=>{
      if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Error parsing stored user:', err)
      }
    }
    }
    setterFn();
    const handleUserLoggedIn = (event) => {
      setUser(event.detail)
    }

    window.addEventListener('userLoggedIn', handleUserLoggedIn)

    return () =>
      window.removeEventListener('userLoggedIn', handleUserLoggedIn)
  }, [])

  // ✅ Refresh cart helper
  const refreshCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${sessionId}`
      )

      if (response.ok) {
        const data = await response.json()
        setCart(data.data || emptyCart)
      } else {
        setCart(emptyCart)
      }
    } catch (error) {
      console.error('Error refreshing cart:', error)
      setCart(emptyCart)
    }
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setCart(emptyCart)
  }

  return (
    <Router>
      <div className="app-container">
        <Header
          cartCount={cart.totalItems}
          user={user}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <ProductsPage
                  sessionId={sessionId}
                  onAddToCart={refreshCart}
                  user={user}
                />
              }
            />

            <Route
              path="/cart"
              element={
                <CartPage
                  sessionId={sessionId}
                  cart={cart}
                  onCartChange={refreshCart}
                  user={user}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <CheckoutPage
                  sessionId={sessionId}
                  onOrderPlaced={refreshCart}
                  user={user}
                />
              }
            />

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/orders"
              element={<OrdersPage user={user} />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
