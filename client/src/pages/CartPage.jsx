import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CartPage.css'

const CartPage = ({ sessionId, cart, onCartChange }) => {
  const navigate = useNavigate()
  const [localCart, setLocalCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCart()
  }, [sessionId])

  const fetchCart = async () => {
    if (!sessionId) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/cart/${sessionId}`)

      if (response.ok) {
        const data = await response.json()
        setLocalCart(data.data)
        setError(null)
        // notify parent to sync header count
        if (onCartChange) onCartChange()
      } else if (response.status === 404) {
        setLocalCart(null)
      } else {
        setError('Failed to fetch cart')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          productId,
          quantity: newQuantity,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLocalCart(data.data)
        if (onCartChange) onCartChange()
      } else {
        setError('Failed to update cart')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          productId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLocalCart(data.data)
        if (onCartChange) onCartChange()
      } else {
        setError('Failed to remove item')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear the entire cart?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        setLocalCart(data.data)
        if (onCartChange) onCartChange()
      } else {
        setError('Failed to clear cart')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>
  }

  const effectiveCart = localCart || cart

  if (!effectiveCart || effectiveCart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-container">
        <div className="cart-items-section">
          <h2>Cart Items ({effectiveCart.totalItems})</h2>

          <div className="cart-items">
            {effectiveCart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{effectiveCart.totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>

          <div className="summary-row">
            <span>Tax (18%):</span>
            <span>₹{Math.round(effectiveCart.totalPrice * 0.18).toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{Math.round(effectiveCart.totalPrice * 1.18).toLocaleString('en-IN')}</span>
          </div>

          <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>

          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
