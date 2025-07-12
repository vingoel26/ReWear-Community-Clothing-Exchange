"use client"

import { useApp } from "../App"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const { currentUser, items } = useApp()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const userItems = items.filter((item) => item.uploaderId === currentUser.id)
  const userPurchases = items.filter((item) => item.purchaserId === currentUser.id)

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome back, {currentUser.name}!</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 transition-colors duration-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transform transition-transform hover:scale-105">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-100 font-semibold text-lg">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold dark:text-white">{currentUser.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transform transition-transform hover:scale-105">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Points Balance</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{currentUser.points}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Available for redemption</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Last month</span>
                <span>+120</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-green-600 dark:bg-green-400 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transform transition-transform hover:scale-105">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/add-item"
                className="block w-full bg-green-600 dark:bg-green-500 text-white text-center py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300"
              >
                List New Item
              </Link>
              <Link
                to="/browse"
                className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">My Listings</h2>
          {userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transform transition-transform hover:scale-105"
                >
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold truncate dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.points} points</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        item.status === "available"
                          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4 dark:text-gray-300">You haven't listed any items yet.</p>
              <Link to="/add-item" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                List Your First Item
              </Link>
            </div>
          )}
        </div>

        {/* My Purchases */}
        <div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">My Purchases</h2>
          {userPurchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userPurchases.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transform transition-transform hover:scale-105"
                >
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold truncate dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Purchased for {item.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4 dark:text-gray-300">You haven't made any purchases yet.</p>
              <Link to="/browse" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
