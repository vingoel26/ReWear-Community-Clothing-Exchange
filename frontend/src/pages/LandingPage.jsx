import { Link } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { useState, useEffect } from "react"
import { ArrowRight, Recycle, Users, TrendingUp, Star } from "lucide-react"

export default function LandingPage() {
  const { items } = useApp()
  const featuredItems = items.filter((item) => item.status === "available").slice(0, 6)

  const [stats, setStats] = useState({
    exchangedItems: 1234,
    activeMembers: 567,
    wasteReduction: 89,
  })

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps

        setStats({
          exchangedItems: Math.floor(1234 * progress),
          activeMembers: Math.floor(567 * progress),
          wasteReduction: Math.floor(89 * progress),
        })

        if (step >= steps) {
          clearInterval(interval)
          setStats({ exchangedItems: 1234, activeMembers: 567, wasteReduction: 89 })
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }

    const timer = setTimeout(animateStats, 500)
    return () => clearTimeout(timer)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content:
        "ReWear has completely transformed how I think about fashion. I've discovered amazing pieces while helping the environment!",
      rating: 5,
      avatar: "S",
    },
    {
      name: "Mike Chen",
      role: "Sustainable Living Advocate",
      content:
        "The point system is brilliant! I've earned enough points to get designer items just by sharing clothes I no longer wear.",
      rating: 5,
      avatar: "M",
    },
    {
      name: "Emma Wilson",
      role: "College Student",
      content: "Perfect for students on a budget. I've refreshed my entire wardrobe without spending a fortune!",
      rating: 5,
      avatar: "E",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">ReWear</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Join our community clothing exchange platform. Swap unused clothing, earn points, and promote sustainable
              fashion while reducing textile waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/browse"
                className="group bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
              >
                Start Swapping
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
              >
                Browse Items
              </Link>
              <Link
                to="/add-item"
                className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                List an Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Featured Items</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover amazing pre-loved fashion pieces from our community members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.images[0] || "/placeholder.svg?height=300&width=300"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {item.points} pts
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">{item.points} points</span>
                    <Link
                      to={`/item/${item.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple steps to start your sustainable fashion journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📷",
                title: "List Your Items",
                description: "Upload photos and details of clothing you no longer wear",
                color: "green",
              },
              {
                icon: "🔄",
                title: "Swap or Redeem",
                description: "Exchange items directly or use points to get what you want",
                color: "blue",
              },
              {
                icon: "🌱",
                title: "Help the Planet",
                description: "Reduce textile waste and promote sustainable fashion",
                color: "yellow",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`bg-${step.color}-100 dark:bg-${step.color}-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">Together, we're making a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
                <Recycle className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-4xl md:text-5xl font-bold mb-2">{stats.exchangedItems.toLocaleString()}</div>
                <div className="text-xl opacity-90">Items Exchanged</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
                <Users className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-4xl md:text-5xl font-bold mb-2">{stats.activeMembers.toLocaleString()}</div>
                <div className="text-xl opacity-90">Active Members</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-4xl md:text-5xl font-bold mb-2">{stats.wasteReduction}%</div>
                <div className="text-xl opacity-90">Waste Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from our amazing community members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already making a positive impact on the environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/browse"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
