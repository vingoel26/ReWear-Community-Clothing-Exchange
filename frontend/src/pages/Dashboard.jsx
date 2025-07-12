 
import { useApp } from "../contexts/AppContext"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Plus, Eye, Heart, ShoppingBag, TrendingUp, Users, Package, Star, Award, ArrowUpRight } from "lucide-react"

export default function Dashboard() {
  const { currentUser, userItems, favoriteItems, totalExchanges, availableItems } = useApp()
  const [timeRange, setTimeRange] = useState("week")

  const recentItems = userItems.slice(0, 4)
  const recentFavorites = favoriteItems.slice(0, 4)

  const stats = [
    {
      title: "Items Listed",
      value: userItems.length,
      change: "+2 this week",
      icon: Package,
      color: "blue",
      trend: "up",
    },
    {
      title: "Total Views",
      value: userItems.reduce((sum, item) => sum + item.views, 0),
      change: "+12% this week",
      icon: Eye,
      color: "green",
      trend: "up",
    },
    {
      title: "Favorites",
      value: favoriteItems.length,
      change: "+3 this week",
      icon: Heart,
      color: "red",
      trend: "up",
    },
    {
      title: "Points Balance",
      value: currentUser.points,
      change: "+50 this week",
      icon: Star,
      color: "yellow",
      trend: "up",
    },
  ]

  const achievements = [
    { title: "First Listing", description: "Listed your first item", earned: userItems.length > 0, icon: "🎯" },
    {
      title: "Popular Item",
      description: "Got 10+ views on an item",
      earned: userItems.some((item) => item.views >= 10),
      icon: "🔥",
    },
    { title: "Eco Warrior", description: "Saved 5+ items from waste", earned: favoriteItems.length >= 5, icon: "🌱" },
    { title: "Community Helper", description: "Made 3+ successful swaps", earned: totalExchanges >= 3, icon: "🤝" },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome back, {currentUser.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your sustainable fashion journey
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-900 text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Link
                to="/add-item"
                className="h-12 px-6 rounded-lg flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow transition hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4" />
                <span>List Item</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen w-full">
          {/* Recent Listings */}
          <div className="lg:col-span-2 flex flex-col flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Recent Listings</h2>
                <Link
                  to="/browse"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm flex items-center"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/item/${item.id}`}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    >
                      <img
                        src={item.images[0] || "/placeholder.svg?height=60&width=60"}
                        alt={item.title}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {item.views} views
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {item.likes} likes
                          </span>
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
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">{item.points} pts</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No items listed yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start sharing your unused clothes with the community
                  </p>
                  <Link to="/add-item" className="btn-primary">
                    List Your First Item
                  </Link>
                </div>
              )}
            </div>
            {/* Recent Favorites (moved here) */}
            {recentFavorites.length > 0 && (
              <div className="mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Favorites</h2>
                    <Link
                      to="/favorites"
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm flex items-center"
                    >
                      View all
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentFavorites.map((item) => (
                      <Link
                        key={item.id}
                        to={`/item/${item.id}`}
                        className="group bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 card-hover"
                      >
                        <img
                          src={item.images[0] || "/placeholder.svg?height=150&width=150"}
                          alt={item.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                            {item.title}
                          </h3>
                          <p className="text-green-600 dark:text-green-400 font-bold text-sm mt-1">{item.points} pts</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 self-stretch">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/add-item"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">List New Item</span>
                </Link>
                <Link
                  to="/browse"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Browse Items</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">View Favorites</span>
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      achievement.earned
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                        : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          achievement.earned
                            ? "text-yellow-800 dark:text-yellow-200"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Community Impact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Total Items</span>
                  <span className="font-bold">{availableItems.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Items Saved</span>
                  <span className="font-bold">{totalExchanges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">CO₂ Saved</span>
                  <span className="font-bold">2.4 tons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
