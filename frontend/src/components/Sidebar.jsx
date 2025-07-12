import { Link, useLocation } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { Home, Grid3X3, Plus, User, MessageCircle, Heart, ShoppingBag, TrendingUp, X, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Sidebar() {
  const { currentUser, sidebarOpen, setSidebarOpen, userItems, favoriteItems, totalExchanges } = useApp()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard", description: "Overview & stats" },
    { path: "/browse", icon: Grid3X3, label: "Browse Items", description: "Discover new items" },
    { path: "/add-item", icon: Plus, label: "List an Item", description: "Share your clothes" },
    {
      path: "/favorites",
      icon: Heart,
      label: "Favorites",
      description: "Saved items",
      badge: favoriteItems.length,
    },
    { path: "/messages", icon: MessageCircle, label: "Messages", description: "Chat with users" },
    { path: "/profile", icon: User, label: "Profile", description: "Manage account" },
  ]

  const stats = [
    { label: "Items Listed", value: userItems.length, icon: "📦" },
    { label: "Favorites", value: favoriteItems.length, icon: "❤️" },
    { label: "Total Swaps", value: totalExchanges, icon: "🔄" },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for mobile (overlay) */}
      <aside
        className={`
          fixed top-16 left-0 z-50 w-72 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}
      >
        <SidebarContent
          currentUser={currentUser}
          setSidebarOpen={setSidebarOpen}
          menuItems={menuItems}
          stats={stats}
          isActive={isActive}
          collapsed={false}
          setCollapsed={() => {}}
        />
      </aside>

      {/* Sidebar for desktop (flex child) */}
      <aside
        className={`${sidebarOpen ? 'lg:flex' : 'lg:hidden'} hidden flex-col relative flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-none self-stretch transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <SidebarContent
          currentUser={currentUser}
          setSidebarOpen={setSidebarOpen}
          menuItems={menuItems}
          stats={stats}
          isActive={isActive}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  )
}

function SidebarContent({ currentUser, setSidebarOpen, menuItems, stats, isActive, collapsed, setCollapsed }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with close button (only on mobile) */}
      {!collapsed && (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Close sidebar"
          >
          </button>
        </div>
      )}
      {/* User info */}
      {!collapsed && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800">
              <span className="text-white font-bold text-xl">{currentUser.avatar || currentUser.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{currentUser.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <ShoppingBag className="w-4 h-4 text-green-500" />
                <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                  {currentUser.points.toLocaleString()} points
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentUser.role === "admin" ? "Administrator" : "Member"}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Collapse/Expand button just above navigation (desktop only) */}
      <button
        className="mx-4 mt-4 mb-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 hidden lg:block"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      {/* Navigation */}
      <nav className={`p-4 space-y-2 overflow-y-auto ${collapsed ? 'flex flex-col items-center' : ''}`} style={collapsed ? {padding: '1rem 0'} : {}}>
        <div className={collapsed ? "mb-4" : "mb-4"}>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h3>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} ${collapsed ? 'w-12 h-12' : 'px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive(item.path)
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}
                  />
                  {!collapsed && (
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  )}
                </div>
                {!collapsed && item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-bold shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {/* No badge when collapsed */}
              </Link>
            )
          })}
        </div>
        {/* Admin Panel Link */}
        {currentUser.role === "admin" && (
          <div className="mb-4">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Administration
              </h3>
            )}
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} ${collapsed ? 'w-12 h-12' : 'px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/admin")
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={collapsed ? "Admin Panel" : undefined}
            >
              <Settings
                className={`w-5 h-5 ${
                  isActive("/admin")
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                }`}
              />
              {!collapsed && (
                <div>
                  <p className="font-medium">Admin Panel</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage platform</p>
                </div>
              )}
            </Link>
          </div>
        )}
      </nav>
      {/* Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Your Stats
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">89% waste reduction</span>
          </div>
        </div>
      )}
    </div>
  )
}
// Export setSidebarOpen for header usage
export { Sidebar }
