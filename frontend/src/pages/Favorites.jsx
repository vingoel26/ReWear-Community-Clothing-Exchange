
import { useState } from "react"
import { Link } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { Heart, Grid, List } from "lucide-react"

export default function Favorites() {
  const { items, favorites, removeFromFavorites } = useApp()
  const [viewMode, setViewMode] = useState("grid")
  const [filterCategory, setFilterCategory] = useState("all")

  const categories = ["all", "Outerwear", "Dresses", "Shoes", "Tops", "Bottoms", "Accessories"]

  // Get favorite items
  const favoriteItems = items.filter((item) => favorites.includes(item.id))
  const filteredItems = favoriteItems.filter((item) => filterCategory === "all" || item.category === filterCategory)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Favorites</h1>
            <p className="text-gray-600 dark:text-gray-400">{filteredItems.length} saved items</p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredItems.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Image */}
              <div className={viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square"}>
                <Link to={`/item/${item.id}`}>
                  <img
                    src={item.images[0] || "/placeholder.svg?height=300&width=300"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <Link to={`/item/${item.id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">{item.category}</span>
                  <span className="text-gray-500 dark:text-gray-400">Size {item.size}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400 font-semibold">{item.points} points</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">by {item.uploaderName}</span>
                  </div>
                </div>

                {viewMode === "list" && (
                  <div className="mt-3 flex space-x-2">
                    <Link
                      to={`/item/${item.id}`}
                      className="flex-1 bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition-colors duration-200 text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => removeFromFavorites(item.id)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No favorites yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start browsing items and save your favorites here</p>
          <Link
            to="/browse"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Browse Items
          </Link>
        </div>
      )}
    </div>
    </div>
  )
}
