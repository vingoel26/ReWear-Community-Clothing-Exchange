
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { Heart, Grid, List, SlidersHorizontal, X, Search } from "lucide-react"

export default function BrowseItems() {
  const {
    filteredItems,
    favorites,
    toggleFavorite,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    setLoading,
  } = useApp()

  const location = useLocation()
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCondition, setSelectedCondition] = useState("")
  const [selectedSize, setSelectedSize] = useState("")

  const conditions = ["Like New", "Excellent", "Good", "Fair"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

  // Sync with URL params and global state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const search = urlParams.get("search")
    const category = urlParams.get("category")
    const sort = urlParams.get("sort")

    if (search && search !== searchQuery) {
      setSearchQuery(search)
      setLocalSearchQuery(search)
    }
    if (category && category !== selectedCategory) {
      setSelectedCategory(category)
    }
    if (sort && sort !== sortBy) {
      setSortBy(sort)
    }
  }, [location.search])

  // Update local search when global search changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Filter and sort items
  const processedItems = filteredItems
    .filter((item) => {
      const matchesCondition = !selectedCondition || item.condition === selectedCondition
      const matchesSize = !selectedSize || item.size === selectedSize
      const matchesPrice = item.points >= priceRange[0] && item.points <= priceRange[1]
      return matchesCondition && matchesSize && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.points - b.points
        case "price-high":
          return b.points - a.points
        case "popular":
          return b.views + b.likes - (a.views + a.likes)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localSearchQuery.trim())
    updateURL()
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "All" ? "" : category)
    updateURL()
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    updateURL()
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategory) params.set("category", selectedCategory)
    if (sortBy !== "newest") params.set("sort", sortBy)

    const newURL = `/browse${params.toString() ? `?${params.toString()}` : ""}`
    window.history.replaceState({}, "", newURL)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSortBy("newest")
    setLocalSearchQuery("")
    setSelectedCondition("")
    setSelectedSize("")
    setPriceRange([0, 100])
    window.history.replaceState({}, "", "/browse")
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    sortBy !== "newest" ||
    selectedCondition ||
    selectedSize ||
    priceRange[0] > 0 ||
    priceRange[1] < 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Items</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover amazing pre-loved fashion from our community</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>}
              </button>

              <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`${showFilters ? "block" : "hidden lg:block"} space-y-6 lg:space-y-0 lg:space-x-6 lg:flex-row`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search items, brands, or tags..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="form-input pl-12 pr-12"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  {localSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearchQuery("")
                        setSearchQuery("")
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap lg:flex-nowrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="form-select min-w-[150px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="form-select min-w-[150px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Any Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Any Size</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Points Range: {priceRange[0]} - {priceRange[1]}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  !selectedCategory
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{processedItems.length}</span>{" "}
              items
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="font-semibold text-gray-900 dark:text-gray-100">{searchQuery}</span>"
                </span>
              )}
              {selectedCategory && (
                <span>
                  {" "}
                  in <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Items Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden animate-shimmer"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : processedItems.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {processedItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 card-hover ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image */}
                <div className={viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square relative"}>
                  <Link to={`/item/${item.id}`}>
                    <img
                      src={item.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {viewMode === "grid" && (
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
                        favorites.includes(item.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white"
                      }`}
                      aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                    </button>
                  )}
                  {viewMode === "grid" && (
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`badge ${
                          item.status === "available"
                            ? "badge-green"
                            : item.status === "pending"
                              ? "badge-yellow"
                              : "badge-gray"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Link to={`/item/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    {viewMode === "list" && (
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`ml-2 p-1 rounded-full transition-colors duration-200 ${
                          favorites.includes(item.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                        aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="badge badge-blue">{item.category}</span>
                    <span className="text-gray-500 dark:text-gray-400">Size {item.size}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{item.points} points</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">by {item.uploaderName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      {item.views} views
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      {item.likes} likes
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-gray text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => {
                          setSearchQuery(tag)
                          setLocalSearchQuery(tag)
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">+{item.tags.length - 3}</span>
                    )}
                  </div>

                  {viewMode === "list" && (
                    <div className="flex space-x-2">
                      <Link to={`/item/${item.id}`} className="flex-1 btn-primary text-center text-sm py-2">
                        View Details
                      </Link>
                      <span
                        className={`badge ${
                          item.status === "available"
                            ? "badge-green"
                            : item.status === "pending"
                              ? "badge-yellow"
                              : "badge-gray"
                        } self-center`}
                      >
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search terms or filters"
                : "Be the first to list an item in this category!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-secondary">
                  Clear Filters
                </button>
              )}
              <Link to="/add-item" className="btn-primary">
                List an Item
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
