"use client"

import { useState, createContext, useContext, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"

// Context for user authentication and app state
const AppContext = createContext()

// Mock data
const mockItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    description: "Classic blue denim jacket in excellent condition. Perfect for layering.",
    category: "Outerwear",
    type: "Jacket",
    size: "M",
    condition: "Excellent",
    tags: ["vintage", "denim", "casual"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 2,
    uploaderName: "Sarah Johnson",
    points: 25,
    status: "available",
  },
  {
    id: 2,
    title: "Summer Floral Dress",
    description: "Beautiful floral print dress, perfect for summer occasions.",
    category: "Dresses",
    type: "Casual Dress",
    size: "S",
    condition: "Good",
    tags: ["floral", "summer", "casual"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 3,
    uploaderName: "Emma Wilson",
    points: 20,
    status: "available",
  },
  {
    id: 3,
    title: "Designer Sneakers",
    description: "Limited edition sneakers, barely worn. Original box included.",
    category: "Shoes",
    type: "Sneakers",
    size: "9",
    condition: "Like New",
    tags: ["designer", "sneakers", "limited"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 4,
    uploaderName: "Mike Chen",
    points: 35,
    status: "available",
  },
]

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", points: 150, role: "user" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", points: 75, role: "user" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", points: 100, role: "user" },
  { id: 4, name: "Mike Chen", email: "mike@example.com", points: 200, role: "user" },
  { id: 5, name: "Admin User", email: "admin@example.com", points: 0, role: "admin" },
]

// Components
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import ItemDetail from "./pages/ItemDetail"
import AddItem from "./pages/AddItem"
import BrowseItems from "./pages/BrowseItems"
import AdminPanel from "./pages/AdminPanel"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import Favorites from "./pages/Favorites"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [items, setItems] = useState(mockItems)
  const [users, setUsers] = useState(mockUsers)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const login = (email, password) => {
    const user = users.find((u) => u.email === email)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const register = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      points: 50, // Welcome bonus
      role: "user",
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    setSidebarOpen(false)
  }

  const addItem = (itemData) => {
    const newItem = {
      id: items.length + 1,
      ...itemData,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      status: "pending", // Items need admin approval
    }
    setItems([...items, newItem])
  }

  const updateItemStatus = (itemId, status) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, status } : item)))
  }

  const contextValue = {
    currentUser,
    items,
    users,
    darkMode,
    sidebarOpen,
    login,
    register,
    logout,
    addItem,
    updateItemStatus,
    setUsers,
    toggleDarkMode,
    setSidebarOpen,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <Sidebar />

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <main className={`transition-all duration-300 ${sidebarOpen && currentUser ? "lg:ml-64" : ""}`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/browse" element={<BrowseItems />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/messages" element={currentUser ? <Messages /> : <Navigate to="/login" />} />
                <Route path="/favorites" element={currentUser ? <Favorites /> : <Navigate to="/login" />} />
                <Route path="/add-item" element={currentUser ? <AddItem /> : <Navigate to="/login" />} />
                <Route path="/admin" element={currentUser?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppContext")
  }
  return context
}

export default App
