import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductsPage.css'

const CheckoutPage = ({ sessionId, onOrderPlaced }) => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sessionId) fetchCart()
  }, [sessionId])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:5000/api/cart/${sessionId}`)
      if (res.ok) {
        const data = await res.json()
        setCart(data.data)
      } else {
        setCart({ items: [], totalPrice: 0 })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    // Save order to localStorage
    try {
      const newOrder = {
        items: cart.items,
        totalAmount: Math.round(cart.totalPrice * 1.18), // with tax
        placedAt: new Date().toISOString()
      }

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(newOrder)
      localStorage.setItem('orders', JSON.stringify(existingOrders))

      // Clear cart from backend
      const res = await fetch(`http://localhost:5000/api/cart/${sessionId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        if (onOrderPlaced) onOrderPlaced()
        alert('✅ Order placed successfully!')
        navigate('/orders')
      } else {
        const err = await res.json()
        alert(`❌ ${err.message || 'Failed to place order'}`)
      }
    } catch (err) {
      alert(`❌ ${err.message}`)
    }
  }

  if (loading) return <div className="loading">Loading checkout...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Checkout</h1>
        <p>Review your order and place it</p>
      </div>

      <div className="main-content">
        {(!cart || cart.items.length === 0) ? (
          <div className="no-products">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h3>Items</h3>
            <ul>
              {cart.items.map(i => (
                <li key={i.productId} style={{ marginBottom: 8 }}>
                  {i.name} x {i.quantity} — ₹{i.totalPrice}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 20 }}>
              <p>Subtotal: ₹{cart.totalPrice}</p>
              <p>Tax (18%): ₹{Math.round(cart.totalPrice * 0.18)}</p>
              <p><strong>Total: ₹{Math.round(cart.totalPrice * 1.18)}</strong></p>
            </div>

            <div style={{ marginTop: 20 }}>
              <button className="checkout-btn" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
