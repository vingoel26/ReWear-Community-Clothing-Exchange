"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../App"
import { Menu, X, Sun, Moon, Search, Bell, User, ShoppingBag, Plus, Home, Grid3X3 } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { currentUser, logout, darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setShowUserMenu(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ReWear
              </span>
            </Link>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/browse"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/browse")
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Grid3X3 className="w-4 h-4 inline mr-1" />
                Browse
              </Link>
              {currentUser && (
                <Link
                  to="/add-item"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive("/add-item")
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  List Item
                </Link>
              )}
            </nav>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Points display */}
                <div className="hidden sm:flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                  <ShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">{currentUser.points}</span>
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{currentUser.name.charAt(0)}</span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser.name}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium rounded-md hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </form>
      </div>
    </header>
  )
}
