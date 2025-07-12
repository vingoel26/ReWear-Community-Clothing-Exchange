import { Link, useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { Menu, X, Sun, Moon, Search, Bell, User, ShoppingBag, Plus, Home, Grid3X3, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {
  const {
    currentUser,
    logout,
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    clearNotifications,
    searchQuery,
    setSearchQuery,
  } = useApp()

  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")

  // Sync local search with global search
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const search = urlParams.get("search")
    if (search && search !== searchQuery) {
      setSearchQuery(search)
    }
  }, [location.search, searchQuery, setSearchQuery])

  const handleLogout = () => {
    logout()
    navigate("/")
    setShowUserMenu(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery.trim())
      navigate(`/browse?search=${encodeURIComponent(localSearchQuery.trim())}`)
    } else {
      setSearchQuery("")
      navigate("/browse")
    }
  }

  const isActive = (path) => location.pathname === path

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setShowUserMenu(false)
      }
      if (!event.target.closest(".notifications-menu")) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-200 shadow-lg">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">ReWear</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/browse"
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/browse")
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Browse
              </Link>
              {currentUser && (
                <Link
                  to="/add-item"
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/add-item")
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Item
                </Link>
              )}
            </nav>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-green-500"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative notifications-menu">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative focus:ring-2 focus:ring-green-500"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                        {notifications.length > 9 ? "9+" : notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={() => {
                              clearNotifications()
                              setShowNotifications(false)
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-medium">No notifications</p>
                          <p className="text-xs mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Points display */}
                <div className="hidden sm:flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">
                    {currentUser.points.toLocaleString()}
                  </span>
                </div>

                {/* User menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                    aria-label="User menu"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {currentUser.avatar || currentUser.name.charAt(0)}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.points} points</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block" />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Home className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
