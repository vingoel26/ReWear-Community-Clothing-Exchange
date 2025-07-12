
import { useState } from "react"
import { useApp } from "../contexts/AppContext"

export default function AdminPanel() {
  const { items, users, updateItemStatus, setUsers } = useApp()
  const [activeTab, setActiveTab] = useState("items")

  const pendingItems = items.filter((item) => item.status === "pending")
  const allItems = items
  const allUsers = users.filter((user) => user.role !== "admin")

  const handleApproveItem = (itemId) => {
    updateItemStatus(itemId, "available")
  }

  const handleRejectItem = (itemId) => {
    updateItemStatus(itemId, "rejected")
  }

  const handleSuspendUser = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "suspended" ? "active" : "suspended" } : user,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, items, and platform content</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("items")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "items"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Items ({pendingItems.length} pending)
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab("all-items")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all-items"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Items
            </button>
          </nav>
        </div>

        {/* Pending Items Tab */}
        {activeTab === "items" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Pending Item Approvals</h2>
            {pendingItems.length > 0 ? (
              <div className="space-y-6">
                {pendingItems.map((item) => (
                  <div key={item.id} className="bg-white border rounded-lg p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Category:</span> {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {item.size}
                          </div>
                          <div>
                            <span className="font-medium">Condition:</span> {item.condition}
                          </div>
                          <div>
                            <span className="font-medium">Points:</span> {item.points}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium">Listed by:</span> {item.uploaderName}
                        </div>
                        <div className="mt-2">
                          <span className="font-medium">Tags:</span> {item.tags.map((tag) => `#${tag}`).join(", ")}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleApproveItem(item.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectItem(item.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending items</h3>
                <p className="text-gray-600">All items have been reviewed</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold">{user.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "suspended" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className={`${
                            user.status === "suspended"
                              ? "text-green-600 hover:text-green-900"
                              : "text-red-600 hover:text-red-900"
                          }`}
                        >
                          {user.status === "suspended" ? "Reactivate" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Items Tab */}
        {activeTab === "all-items" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.uploaderName}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-600 font-semibold">{item.points} points</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveItem(item.id)}
                          className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectItem(item.id)}
                          className="flex-1 bg-red-600 text-white text-xs py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
