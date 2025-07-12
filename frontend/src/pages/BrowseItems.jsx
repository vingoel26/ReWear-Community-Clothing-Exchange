"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useApp } from "../App"
import { motion, AnimatePresence } from "framer-motion"

export default function BrowseItems() {
  const { items } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]

  const availableItems = items.filter((item) => item.status === "available")

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.points - b.points
      case "price-high":
        return b.points - a.points
      case "newest":
      default:
        return b.id - a.id
    }
  })

  // Pagination
  const itemsPerPage = 12
  const paginatedItems = sortedItems.slice(0, page * itemsPerPage)

  useEffect(() => {
    if (paginatedItems.length === sortedItems.length) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [paginatedItems.length, sortedItems.length])

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  // Skeleton Loading
  const SkeletonItem = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="animate-pulse w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="animate-pulse h-6 bg-gray-200 mb-2 w-3/4"></div>
        <div className="animate-pulse h-4 bg-gray-200 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-200 w-1/2"></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Items</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category === "All" ? "" : category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Points: Low to High</option>
            <option value="price-high">Points: High to Low</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category === "All" ? "" : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (selectedCategory === category) || (selectedCategory === "" && category === "All")
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {paginatedItems.length} of {availableItems.length} items
        </p>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </div>
      ) : paginatedItems.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                layoutId={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/item/${item.id}`}>
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/item/${item.id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-green-600 transition-colors">{item.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-sm text-gray-500">Size {item.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">{item.points} points</span>
                    <span className="text-xs text-gray-500">by {item.uploaderName}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{item.tags.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("")
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button onClick={loadMore} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Load More
          </button>
        </div>
      )}
    </div>
  )

  // Debounce Hook
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }
}
