"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApp } from "../App"
import { motion } from "framer-motion"

export default function ItemDetail() {
  const { id } = useParams()
  const { items, currentUser } = useApp()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const imageRef = useRef(null)

  const item = items.find((item) => item.id === Number.parseInt(id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!item) {
    return (
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Item not found</h1>
          <button
            onClick={() => navigate("/browse")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Back to Browse
          </button>
        </div>
      </motion.div>
    )
  }

  const handleSwapRequest = () => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    alert("Swap request sent! The item owner will be notified.")
  }

  const handleRedeem = () => {
    if (!currentUser) {
      navigate("/login")
      return
    }
    if (currentUser.points < item.points) {
      alert("Insufficient points for this item.")
      return
    }
    alert(`Item redeemed for ${item.points} points!`)
  }

  const handleImageClick = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={() => navigate("/browse")}
        className="mb-6 text-green-600 hover:text-green-700 flex items-center"
      >
        ← Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4 relative">
            <motion.img
              ref={imageRef}
              src={item.images[selectedImage] || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg cursor-zoom-in"
              style={{
                objectFit: "cover",
                transformOrigin: "center",
                scale: isZoomed ? 1.5 : 1,
                transition: "transform 0.3s ease",
              }}
              onClick={handleImageClick}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {item.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? "border-green-500" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${item.title} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                item.status === "available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.status === "available" ? "Available" : "Not Available"}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900">Category</h4>
              <p className="text-gray-600">{item.category}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Type</h4>
              <p className="text-gray-600">{item.type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Size</h4>
              <p className="text-gray-600">{item.size}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Condition</h4>
              <p className="text-gray-600">{item.condition}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900">Listed by</h4>
            <p className="text-gray-600">{item.uploaderName}</p>
          </div>

          <div className="mb-8">
            <div className="text-2xl font-bold text-green-600 mb-2">{item.points} points</div>
            {currentUser && <p className="text-sm text-gray-600">Your balance: {currentUser.points} points</p>}
          </div>

          {item.status === "available" && currentUser?.id !== item.uploaderId && (
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSwapRequest}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Send Swap Request
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRedeem}
                disabled={currentUser && currentUser.points < item.points}
                className={`w-full py-3 rounded-lg font-semibold ${
                  currentUser && currentUser.points >= item.points
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Redeem with Points
              </motion.button>
            </div>
          )}

          {!currentUser && (
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Login to Swap or Redeem
              </motion.button>
            </div>
          )}

          {currentUser?.id === item.uploaderId && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">This is your listing.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
