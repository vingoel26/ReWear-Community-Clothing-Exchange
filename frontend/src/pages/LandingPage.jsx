"use client"

import { Link } from "react-router-dom"
import { useApp } from "../App"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const { items } = useApp()
  const featuredItems = items.filter((item) => item.status === "available").slice(0, 6)

  const [exchangedItems, setExchangedItems] = useState(1234)
  const [activeMembers, setActiveMembers] = useState(567)
  const [wasteReduction, setWasteReduction] = useState(89)

  useEffect(() => {
    const interval = setInterval(() => {
      setExchangedItems((prev) => (prev < 1500 ? prev + 10 : prev))
      setActiveMembers((prev) => (prev < 600 ? prev + 5 : prev))
      setWasteReduction((prev) => (prev < 95 ? prev + 1 : prev))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-2xl"
            style={{ x: "20vw", y: "10vh" }}
            animate={{ x: "80vw", y: "40vh" }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-2xl"
            style={{ x: "60vw", y: "60vh" }}
            animate={{ x: "10vw", y: "90vh" }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Welcome to ReWear
          </motion.h1>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Join our community clothing exchange platform. Swap unused clothing, earn points, and promote sustainable
            fashion while reducing textile waste.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/browse"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Swapping
            </Link>
            <Link
              to="/browse"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Browse Items
            </Link>
            <Link
              to="/add-item"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              List an Item
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">{item.points} points</span>
                    <Link
                      to={`/item/${item.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="text-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">Upload photos and details of clothing you no longer wear</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Swap or Redeem</h3>
              <p className="text-gray-600">Exchange items directly or use points to get what you want</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Help the Planet</h3>
              <p className="text-gray-600">Reduce textile waste and promote sustainable fashion</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{exchangedItems}</div>
              <div className="text-xl">Items Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{activeMembers}</div>
              <div className="text-xl">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{wasteReduction}%</div>
              <div className="text-xl">Waste Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "ReWear has transformed my closet! I've swapped clothes I no longer wear for amazing new pieces. It's
                sustainable and fun!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4">{/* Placeholder for user avatar */}</div>
                <div>
                  <p className="font-semibold">Jane Doe</p>
                  <p className="text-gray-500">ReWear User</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "I love the ReWear community! It's a great way to refresh my wardrobe without contributing to fast
                fashion. Plus, earning points is a great incentive!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4">{/* Placeholder for user avatar */}</div>
                <div>
                  <p className="font-semibold">John Smith</p>
                  <p className="text-gray-500">ReWear User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
