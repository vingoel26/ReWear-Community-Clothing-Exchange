"use client"

import { useState } from "react"
import { useApp } from "../App"
import { Camera, Edit, Save, X, MapPin, Calendar, Award } from "lucide-react"

export default function Profile() {
  const { currentUser } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: "Passionate about sustainable fashion and reducing textile waste. Love finding unique pieces and giving them new life!",
    location: "San Francisco, CA",
    joinDate: "January 2024",
  })

  const handleSave = () => {
    // In a real app, you'd update the user data here
    setIsEditing(false)
  }

  const stats = [
    { label: "Items Listed", value: "15", icon: "📦" },
    { label: "Successful Swaps", value: "23", icon: "🔄" },
    { label: "Points Earned", value: currentUser?.points || 0, icon: "⭐" },
    { label: "Eco Impact", value: "89%", icon: "🌱" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 relative">
          <button className="absolute top-4 right-4 p-2 bg-black bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-200">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">{currentUser?.name.charAt(0)}</span>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-all duration-200 shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Details */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b-2 border-green-500 focus:outline-none text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-gray-600 dark:text-gray-400 bg-transparent border-b border-gray-300 focus:outline-none focus:border-green-500"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formData.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex space-x-2 mt-4 sm:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{formData.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-all duration-200"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "First Swap", description: "Completed your first item exchange", earned: true },
            { title: "Eco Warrior", description: "Prevented 10+ items from going to waste", earned: true },
            { title: "Community Helper", description: "Helped 5+ users find perfect items", earned: false },
            { title: "Trendsetter", description: "Listed 20+ unique items", earned: false },
          ].map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.earned
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  🏆
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      achievement.earned ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
