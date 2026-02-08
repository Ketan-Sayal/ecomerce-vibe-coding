import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductCard.css'

const ProductCard = ({ product, onAddToCart, user }) => {
  const navigate = useNavigate()

  const handleAddClick = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login')
      return
    }

    try {
      const sessionId = localStorage.getItem('sessionId')
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          productId: product._id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        await onAddToCart()
        alert('✅ Added to cart successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Error: ${errorData.message}`)
      }
    } catch (error) {
      alert(`❌ Error adding to cart: ${error.message}`)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="low-stock-badge">Only {product.stock} left!</span>
        )}
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 80)}...</p>

        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
          <span className="review-count">({product.reviews} reviews)</span>
        </div>

        <div className="product-price-section">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
          onClick={handleAddClick}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
