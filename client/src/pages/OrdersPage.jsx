import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductsPage.css'

const OrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  if (!user) {
    return (
      <div className="products-page">
        <h1>My Orders</h1>
        <div className="no-products">
          <p>Please login to view your orders.</p>
          <button 
            className="continue-shopping-btn" 
            onClick={() => navigate('/login')}
            style={{ marginTop: 10 }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>My Orders</h1>
        <p>View your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-products">
          <p>You haven't placed any orders yet.</p>
          <button 
            className="continue-shopping-btn" 
            onClick={() => navigate('/')}
            style={{ marginTop: 10 }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {orders.map((order, idx) => (
            <div 
              key={idx} 
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                background: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3>Order #{idx + 1}</h3>
                  <p style={{ color: '#666', fontSize: '0.9em' }}>
                    Placed on: {new Date(order.placedAt).toLocaleDateString('en-IN')} at {new Date(order.placedAt).toLocaleTimeString('en-IN')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#ffd700' }}>
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p style={{ color: '#27ae60', fontSize: '0.9em' }}>Completed</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ddd', paddingTop: 12 }}>
                <h4>Items:</h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {order.items.map((item, i) => (
                    <li 
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingBottom: 8,
                        borderBottom: i < order.items.length - 1 ? '1px solid #eee' : 'none'
                      }}
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
