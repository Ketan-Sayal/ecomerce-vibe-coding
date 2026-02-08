import React from 'react'
import '../styles/ProductFilter.css'

const ProductFilter = ({ categories, selectedCategory, onCategoryChange, onSearch }) => {
  return (
    <div className="filter-section">
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search products..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
