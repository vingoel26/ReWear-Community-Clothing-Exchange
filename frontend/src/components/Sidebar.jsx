"use client"

import { Link, useLocation } from "react-router-dom"
import { useApp } from "../App"
import { Home, Grid3X3, Plus, User, MessageCircle, Heart, ShoppingBag, TrendingUp } from "lucide-react"

export default function Sidebar() {
  const { currentUser, sidebarOpen, setSidebarOpen } = useApp()
  const location = useLocation()

  if (!currentUser) return null

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/browse", icon: Grid3X3, label: "Browse Items" },
    { path: "/add-item", icon: Plus, label: "List an Item" },
    { path: "/favorites", icon: Heart, label: "Favorites" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{currentUser.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{currentUser.name}</p>
                <div className="flex items-center space-x-1">
                  <ShoppingBag className="w-3 h-3 text-green-500" />
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">{currentUser.points} points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Stats */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Items Listed</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Successful Swaps</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">12</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>Eco Impact: 89% waste reduction</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
