import { createContext, useContext, useReducer, useEffect } from "react"

// Initial state
const initialState = {
  // User state
  currentUser: null,
  users: [],

  // Items state
  items: [],
  categories: ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"],

  // UI state
  darkMode: false,
  sidebarOpen: false,
  loading: false,

  // User interactions
  favorites: [],
  notifications: [],
  searchQuery: "",
  selectedCategory: "",
  sortBy: "newest",

  // Admin state
  pendingItems: [],

  // Messages state
  conversations: [],
  messages: {},
}

// Action types
const ActionTypes = {
  // User actions
  SET_CURRENT_USER: "SET_CURRENT_USER",
  ADD_USER: "ADD_USER",
  UPDATE_USER: "UPDATE_USER",
  LOGOUT: "LOGOUT",

  // Items actions
  SET_ITEMS: "SET_ITEMS",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  DELETE_ITEM: "DELETE_ITEM",

  // UI actions
  TOGGLE_DARK_MODE: "TOGGLE_DARK_MODE",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_LOADING: "SET_LOADING",

  // Search and filter actions
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  SET_SORT_BY: "SET_SORT_BY",

  // Favorites actions
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",

  // Notifications actions
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",

  // Messages actions
  ADD_CONVERSATION: "ADD_CONVERSATION",
  ADD_MESSAGE: "ADD_MESSAGE",
  UPDATE_CONVERSATION: "UPDATE_CONVERSATION",
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload }

    case ActionTypes.ADD_USER:
      return { ...state, users: [...state.users, action.payload] }

    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? { ...user, ...action.payload } : user)),
        currentUser:
          state.currentUser?.id === action.payload.id ? { ...state.currentUser, ...action.payload } : state.currentUser,
      }

    case ActionTypes.LOGOUT:
      return { ...state, currentUser: null, sidebarOpen: false }

    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload }

    case ActionTypes.ADD_ITEM:
      return { ...state, items: [...state.items, action.payload] }

    case ActionTypes.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload } : item)),
      }

    case ActionTypes.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case ActionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode }

    case ActionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }

    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }

    case ActionTypes.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload }

    case ActionTypes.SET_SORT_BY:
      return { ...state, sortBy: action.payload }

    case ActionTypes.ADD_TO_FAVORITES:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }

    case ActionTypes.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      }

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10),
      }

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }

    case ActionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] }

    case ActionTypes.ADD_CONVERSATION:
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      }

    case ActionTypes.ADD_MESSAGE:
      const { conversationId, message } = action.payload
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
      }

    case ActionTypes.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload.id ? { ...conv, ...action.payload } : conv,
        ),
      }

    default:
      return state
  }
}

// Mock data
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", points: 150, role: "user", avatar: "J", status: "active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", points: 75, role: "user", avatar: "S", status: "active" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", points: 100, role: "user", avatar: "E", status: "active" },
  { id: 4, name: "Mike Chen", email: "mike@example.com", points: 200, role: "user", avatar: "M", status: "active" },
  { id: 5, name: "Admin User", email: "admin@example.com", points: 0, role: "admin", avatar: "A", status: "active" },
]

const mockItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    description:
      "Classic blue denim jacket in excellent condition. Perfect for layering and adding a vintage touch to any outfit.",
    category: "Outerwear",
    type: "Jacket",
    size: "M",
    condition: "Excellent",
    tags: ["vintage", "denim", "casual", "blue"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 2,
    uploaderName: "Sarah Johnson",
    points: 25,
    status: "available",
    createdAt: new Date("2024-01-15"),
    views: 45,
    likes: 12,
  },
  {
    id: 2,
    title: "Summer Floral Dress",
    description: "Beautiful floral print dress, perfect for summer occasions. Light and comfortable fabric.",
    category: "Dresses",
    type: "Casual Dress",
    size: "S",
    condition: "Good",
    tags: ["floral", "summer", "casual", "light"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 3,
    uploaderName: "Emma Wilson",
    points: 20,
    status: "available",
    createdAt: new Date("2024-01-10"),
    views: 32,
    likes: 8,
  },
  {
    id: 3,
    title: "Designer Sneakers",
    description: "Limited edition sneakers, barely worn. Original box included. Perfect for sneaker enthusiasts.",
    category: "Shoes",
    type: "Sneakers",
    size: "9",
    condition: "Like New",
    tags: ["designer", "sneakers", "limited", "rare"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 4,
    uploaderName: "Mike Chen",
    points: 35,
    status: "available",
    createdAt: new Date("2024-01-12"),
    views: 67,
    likes: 23,
  },
  {
    id: 4,
    title: "Cozy Winter Sweater",
    description: "Warm wool sweater perfect for cold days. Soft and comfortable with a classic design.",
    category: "Tops",
    type: "Sweater",
    size: "L",
    condition: "Excellent",
    tags: ["winter", "wool", "cozy", "warm"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 2,
    uploaderName: "Sarah Johnson",
    points: 30,
    status: "available",
    createdAt: new Date("2024-01-08"),
    views: 28,
    likes: 15,
  },
  {
    id: 5,
    title: "Black Leather Boots",
    description: "Stylish black leather boots in great condition. Perfect for both casual and formal occasions.",
    category: "Shoes",
    type: "Boots",
    size: "8",
    condition: "Good",
    tags: ["leather", "black", "boots", "versatile"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 3,
    uploaderName: "Emma Wilson",
    points: 40,
    status: "available",
    createdAt: new Date("2024-01-05"),
    views: 51,
    likes: 19,
  },
  {
    id: 6,
    title: "Elegant Evening Gown",
    description: "Beautiful evening gown for special occasions. Worn only once, in perfect condition.",
    category: "Dresses",
    type: "Evening Dress",
    size: "M",
    condition: "Like New",
    tags: ["elegant", "evening", "formal", "special"],
    images: ["/placeholder.svg?height=400&width=400"],
    uploaderId: 1,
    uploaderName: "John Doe",
    points: 50,
    status: "pending",
    createdAt: new Date("2024-01-18"),
    views: 12,
    likes: 3,
  },
]

const mockConversations = [
  {
    id: 1,
    participants: [1, 2],
    lastMessage: "Is the denim jacket still available?",
    lastMessageTime: new Date("2024-01-20T10:30:00"),
    unreadCount: 2,
    itemId: 1,
  },
  {
    id: 2,
    participants: [1, 4],
    lastMessage: "Thanks for the quick swap!",
    lastMessageTime: new Date("2024-01-19T15:45:00"),
    unreadCount: 0,
    itemId: 3,
  },
]

// Context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    users: mockUsers,
    items: mockItems,
    conversations: mockConversations,
  })

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    if (savedUser) {
      dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: JSON.parse(savedUser) })
    }

    if (savedDarkMode !== state.darkMode) {
      dispatch({ type: ActionTypes.TOGGLE_DARK_MODE })
    }

    if (savedFavorites.length > 0) {
      savedFavorites.forEach((id) => {
        dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: id })
      })
    }

    // Apply dark mode to document
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [state.currentUser])

  useEffect(() => {
    localStorage.setItem("darkMode", state.darkMode.toString())
    if (state.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [state.darkMode])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(state.favorites))
  }, [state.favorites])

  // Action creators
  const actions = {
    // User actions
    login: (email, password) => {
      const user = state.users.find((u) => u.email === email && u.status !== "suspended")
      if (user) {
        dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: user })
        addNotification("Welcome back!", "success")
        return true
      }
      addNotification("Invalid credentials or account suspended", "error")
      return false
    },

    register: (userData) => {
      const existingUser = state.users.find((u) => u.email === userData.email)
      if (existingUser) {
        addNotification("Email already exists", "error")
        return false
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        points: 50, // Welcome bonus
        role: "user",
        avatar: userData.name.charAt(0).toUpperCase(),
        status: "active",
        createdAt: new Date(),
      }

      dispatch({ type: ActionTypes.ADD_USER, payload: newUser })
      dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: newUser })
      addNotification("Account created successfully! Welcome bonus: 50 points", "success")
      return true
    },

    logout: () => {
      dispatch({ type: ActionTypes.LOGOUT })
      addNotification("Logged out successfully", "info")
    },

    updateUser: (userId, updates) => {
      dispatch({ type: ActionTypes.UPDATE_USER, payload: { id: userId, ...updates } })
      addNotification("Profile updated successfully", "success")
    },

    updateUserPoints: (userId, pointsChange) => {
      const user = state.users.find((u) => u.id === userId)
      if (user) {
        const newPoints = Math.max(0, user.points + pointsChange)
        dispatch({ type: ActionTypes.UPDATE_USER, payload: { id: userId, points: newPoints } })
      }
    },

    // Items actions
    addItem: (itemData) => {
      const newItem = {
        id: Date.now(),
        ...itemData,
        uploaderId: state.currentUser.id,
        uploaderName: state.currentUser.name,
        status: "pending",
        createdAt: new Date(),
        views: 0,
        likes: 0,
      }

      dispatch({ type: ActionTypes.ADD_ITEM, payload: newItem })
      addNotification("Item submitted for review!", "success")
      return newItem
    },

    updateItem: (itemId, updates) => {
      dispatch({ type: ActionTypes.UPDATE_ITEM, payload: { id: itemId, ...updates } })

      if (updates.status === "available") {
        addNotification("Item approved and is now available!", "success")
      } else if (updates.status === "rejected") {
        addNotification("Item was rejected", "error")
      }
    },

    deleteItem: (itemId) => {
      dispatch({ type: ActionTypes.DELETE_ITEM, payload: itemId })
      addNotification("Item deleted successfully", "info")
    },

    redeemItem: (itemId) => {
      const item = state.items.find((i) => i.id === itemId)
      if (!item || !state.currentUser) return false

      if (state.currentUser.points < item.points) {
        addNotification("Insufficient points!", "error")
        return false
      }

      // Update user points
      actions.updateUserPoints(state.currentUser.id, -item.points)
      actions.updateUserPoints(item.uploaderId, item.points)

      // Update item status
      dispatch({
        type: ActionTypes.UPDATE_ITEM,
        payload: { id: itemId, status: "sold", buyerId: state.currentUser.id },
      })

      addNotification(`Successfully redeemed ${item.title} for ${item.points} points!`, "success")
      return true
    },

    // UI actions
    toggleDarkMode: () => {
      dispatch({ type: ActionTypes.TOGGLE_DARK_MODE })
    },

    toggleSidebar: () => {
      dispatch({ type: ActionTypes.TOGGLE_SIDEBAR })
    },

    setSidebarOpen: (open) => {
      if (open !== state.sidebarOpen) {
        dispatch({ type: ActionTypes.TOGGLE_SIDEBAR })
      }
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
    },

    // Search and filter actions
    setSearchQuery: (query) => {
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query })
    },

    setSelectedCategory: (category) => {
      dispatch({ type: ActionTypes.SET_SELECTED_CATEGORY, payload: category })
    },

    setSortBy: (sortBy) => {
      dispatch({ type: ActionTypes.SET_SORT_BY, payload: sortBy })
    },

    // Favorites actions
    addToFavorites: (itemId) => {
      if (!state.favorites.includes(itemId)) {
        dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: itemId })
        addNotification("Added to favorites!", "success")
      }
    },

    removeFromFavorites: (itemId) => {
      dispatch({ type: ActionTypes.REMOVE_FROM_FAVORITES, payload: itemId })
      addNotification("Removed from favorites", "info")
    },

    toggleFavorite: (itemId) => {
      if (state.favorites.includes(itemId)) {
        actions.removeFromFavorites(itemId)
      } else {
        actions.addToFavorites(itemId)
      }
    },

    // Notifications
    addNotification: (message, type = "info") => {
      const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date(),
      }
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification })

      // Auto-remove after 5 seconds
      setTimeout(() => {
        dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notification.id })
      }, 5000)
    },

    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id })
    },

    clearNotifications: () => {
      dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS })
    },

    // Messages actions
    sendMessage: (conversationId, content) => {
      const message = {
        id: Date.now(),
        senderId: state.currentUser.id,
        senderName: state.currentUser.name,
        content,
        timestamp: new Date(),
        read: false,
      }

      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: { conversationId, message } })

      // Update conversation
      dispatch({
        type: ActionTypes.UPDATE_CONVERSATION,
        payload: {
          id: conversationId,
          lastMessage: content,
          lastMessageTime: new Date(),
        },
      })

      addNotification("Message sent!", "success")
    },

    createConversation: (participantId, itemId) => {
      const conversation = {
        id: Date.now(),
        participants: [state.currentUser.id, participantId],
        lastMessage: "",
        lastMessageTime: new Date(),
        unreadCount: 0,
        itemId,
      }

      dispatch({ type: ActionTypes.ADD_CONVERSATION, payload: conversation })
      return conversation.id
    },
  }

  // Add the addNotification function to actions
  const addNotification = actions.addNotification

  // Computed values
  const computed = {
    availableItems: state.items.filter((item) => item.status === "available"),
    pendingItems: state.items.filter((item) => item.status === "pending"),
    userItems: state.items.filter((item) => item.uploaderId === state.currentUser?.id),
    favoriteItems: state.items.filter((item) => state.favorites.includes(item.id)),
    filteredItems: state.items.filter((item) => {
      const matchesSearch =
        !state.searchQuery ||
        item.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))

      const matchesCategory =
        !state.selectedCategory || state.selectedCategory === "All" || item.category === state.selectedCategory

      const isAvailable = item.status === "available"

      return matchesSearch && matchesCategory && isAvailable
    }),
    unreadNotifications: state.notifications.length,
    totalUsers: state.users.length,
    totalItems: state.items.length,
    totalExchanges: state.items.filter((item) => item.status === "sold").length,
  }

  const value = {
    ...state,
    ...actions,
    ...computed,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export { ActionTypes }
