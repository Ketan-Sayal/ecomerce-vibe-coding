import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilter from '../components/ProductFilter'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/ProductsPage.css'

const ProductsPage = ({ onAddToCart, user }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/products?limit=50')

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      const allProducts = data.data.products || []
      setProducts(allProducts)

      // Extract unique categories
      const uniqueCategories = [...new Set(allProducts.map((p) => p.category))]
      setCategories(uniqueCategories)

      filterProducts(allProducts, '', '')
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const filterProducts = (allProducts, category, search) => {
    let filtered = allProducts

    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    filterProducts(products, category, searchTerm)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    filterProducts(products, selectedCategory, term)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProducts} />
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Jewelry Collection</h1>
        <p>Discover premium jewelry pieces crafted with perfection</p>
      </div>

      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />

      <div className="products-info">
        <p>Showing {paginatedProducts.length} of {filteredProducts.length} products</p>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try different filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                user={user}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsPage
