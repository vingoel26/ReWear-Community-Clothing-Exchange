"use client"

import { useState } from "react"
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react"

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(0)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "S",
      lastMessage: "Is the denim jacket still available?",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "M",
      lastMessage: "Thanks for the quick swap!",
      time: "1h ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "E",
      lastMessage: "Would you be interested in trading?",
      time: "3h ago",
      unread: 1,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! I'm interested in your vintage denim jacket. Is it still available?",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Yes, it's still available! Are you looking to swap or redeem with points?",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "I'd love to swap! I have a beautiful floral dress that might interest you. Let me send some photos.",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content: "That sounds great! I'd love to see the photos.",
      time: "10:36 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content: "Is the denim jacket still available?",
      time: "Just now",
      isOwn: false,
    },
  ]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Messages</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(index)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
                    selectedChat === index
                      ? "bg-green-50 dark:bg-green-900/20 border-r-2 border-r-green-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{conversation.avatar}</span>
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{conversations[selectedChat]?.avatar}</span>
                  </div>
                  {conversations[selectedChat]?.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-gray-100">{conversations[selectedChat]?.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conversations[selectedChat]?.online ? "Online" : "Last seen 2h ago"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isOwn ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
