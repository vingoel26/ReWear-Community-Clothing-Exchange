import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import "./App.css"
import { AppProvider, useApp } from "./contexts/AppContext"
import NotificationToast from "./components/NotificationToast"

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
    createdAt: new Date("2024-01-15"),
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
    createdAt: new Date("2024-01-10"),
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
    createdAt: new Date("2024-01-12"),
  },
  {
    id: 4,
    title: "Cozy Winter Sweater",
    description: "Warm wool sweater perfect for cold days. Barely worn.",
    category: "Tops",
    type: "Sweater",
    size: "L",
    condition: "Excellent",
    tags: ["winter", "wool", "cozy"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 2,
    uploaderName: "Sarah Johnson",
    points: 30,
    status: "available",
    createdAt: new Date("2024-01-08"),
  },
  {
    id: 5,
    title: "Black Leather Boots",
    description: "Stylish black leather boots in great condition.",
    category: "Shoes",
    type: "Boots",
    size: "8",
    condition: "Good",
    tags: ["leather", "black", "boots"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 3,
    uploaderName: "Emma Wilson",
    points: 40,
    status: "available",
    createdAt: new Date("2024-01-05"),
  },
]

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", points: 150, role: "user", avatar: "J" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", points: 75, role: "user", avatar: "S" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", points: 100, role: "user", avatar: "E" },
  { id: 4, name: "Mike Chen", email: "mike@example.com", points: 200, role: "user", avatar: "M" },
  { id: 5, name: "Admin User", email: "admin@example.com", points: 0, role: "admin", avatar: "A" },
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
import ChatApp from "./components/ChatModal"

function AppContent() {
  const { currentUser, sidebarOpen } = useApp()
  
  // Add body class when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
    
    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [sidebarOpen])
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <div className="flex">
          {currentUser && <Sidebar />}
          <main className="main-content transition-all duration-300 flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-item"
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <NotificationToast />
      </div>
    </Router>
    // <ChatApp/>
  )
}

function ProtectedRoute({ children }) {
  const { currentUser } = useApp()
  return currentUser ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { currentUser } = useApp()
  return currentUser?.role === "admin" ? children : <Navigate to="/" />
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
