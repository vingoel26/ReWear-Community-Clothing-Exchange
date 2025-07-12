import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Users, Wifi, WifiOff, MessageCircle } from 'lucide-react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedChat, setSelectedChat] = useState(0);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (isConnected && username) {
      const io = require('socket.io-client');
      const newSocket = io('http://localhost:3001');

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnectionStatus('connected');
        newSocket.emit('user_join', { username });
      });

      newSocket.on('welcome_message', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: "System",
          message: data.message,
          timestamp: data.timestamp,
          isSystem: true
        }]);
      });

      newSocket.on('chat_history', (history) => {
        setMessages(history.map(msg => ({
          ...msg,
          isOwn: msg.socketId === newSocket.id
        })));
      });

      newSocket.on('new_message', (messageData) => {
        setMessages(prev => [...prev, {
          ...messageData,
          isOwn: messageData.socketId === newSocket.id
        }]);
      });

      newSocket.on('user_joined', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: "System",
          message: data.message,
          timestamp: data.timestamp,
          isSystem: true
        }]);
      });

      newSocket.on('user_left', (data) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: "System",
          message: data.message,
          timestamp: data.timestamp,
          isSystem: true
        }]);
      });

      newSocket.on('user_count_update', (data) => {
        setOnlineUsers(data.count);
      });

      newSocket.on('user_typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username]);
        } else {
          setTypingUsers(prev => prev.filter(u => u !== data.username));
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnectionStatus('disconnected');
        setOnlineUsers(0);
        setTypingUsers([]);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnectionStatus('error');
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isConnected, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoinChat = () => {
    if (username.trim()) {
      setIsConnected(true);
      setConnectionStatus('connecting');
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socket && connectionStatus === 'connected') {
      socket.emit('chat_message', {
        username: username,
        message: message.trim()
      });
      setMessage('');
      handleStopTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleStartTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping && socket && connectionStatus === 'connected') {
      setIsTyping(true);
      socket.emit('typing_start');
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('typing_stop');
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleLeaveChat = () => {
    if (socket) {
      socket.disconnect();
    }
    setIsConnected(false);
    setMessages([]);
    setUsername('');
    setOnlineUsers(0);
    setTypingUsers([]);
    setConnectionStatus('disconnected');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'connecting':
        return <Wifi className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4 text-red-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  // Mock conversations for the sidebar
  const conversations = [
    {
      id: 1,
      name: "Global Chat",
      avatar: "G",
      lastMessage: messages.length > 0 ? messages[messages.length - 1].message : "No messages yet",
      time: messages.length > 0 ? formatTime(messages[messages.length - 1].timestamp) : "Now",
      unread: 0,
      online: true,
    },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Join Chat</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your username to start chatting</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinChat()}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all"
                maxLength={20}
              />
            </div>
            
            <button
              type="button"
              onClick={handleJoinChat}
              disabled={!username.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-2rem)]">
          <div className="flex h-full flex-col lg:flex-row">
            {/* Conversations List */}
            <div className={`w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col ${isMobile && selectedChat !== null ? 'hidden' : ''}`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Real-time Chat</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{onlineUsers} online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getConnectionIcon()}
                      <span className="text-xs">{getConnectionText()}</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border-0 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
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
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-r-2 border-r-purple-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
                            <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
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
            <div className={`flex-1 flex flex-col ${isMobile && selectedChat === null ? 'hidden' : ''}`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
                    >
                      ←
                    </button>
                  )}
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">G</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="font-medium text-white">Global Chat</h2>
                    <p className="text-sm text-white/70">
                      {onlineUsers} users online
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLeaveChat}
                    className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                  >
                    Leave
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.isSystem
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-center text-sm mx-auto'
                          : msg.isOwn
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white dark:bg-gray-700 shadow-md text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {!msg.isSystem && (
                        <div className={`text-xs mb-1 ${msg.isOwn ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {msg.username} • {formatTime(msg.timestamp)}
                        </div>
                      )}
                      <div className={msg.isSystem ? '' : 'text-sm'}>{msg.message}</div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl text-sm text-gray-600 dark:text-gray-400 italic">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={connectionStatus === 'connected' ? "Type your message..." : "Connecting..."}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-gray-600"
                    maxLength={500}
                    disabled={connectionStatus !== 'connected'}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || connectionStatus !== 'connected'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;