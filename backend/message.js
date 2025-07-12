import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import cors from 'cors';


const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001", "https://claude.ai"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Enable CORS for Express
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001", "https://claude.ai"],
  credentials: true
}));

app.use(express.json());

// Store connected users
const connectedUsers = new Map();
const chatHistory = [];

// Serve static files (optional)
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.send('Chat Server is running!');
});

// API endpoint to get chat history
app.get('/api/messages', (req, res) => {
  res.json(chatHistory);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('user_join', (userData) => {
    const { username } = userData;
    
    // Store user info
    connectedUsers.set(socket.id, {
      id: socket.id,
      username: username,
      joinTime: new Date()
    });

    // Send welcome message
    socket.emit('welcome_message', {
      message: `Welcome to the chat, ${username}!`,
      timestamp: new Date().toISOString()
    });

    // Notify other users about new user
    socket.broadcast.emit('user_joined', {
      username: username,
      message: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
      userCount: connectedUsers.size
    });

    // Send current user count to all clients
    io.emit('user_count_update', {
      count: connectedUsers.size
    });

    // Send recent chat history to new user
    socket.emit('chat_history', chatHistory.slice(-50)); // Last 50 messages

    console.log(`User ${username} joined. Total users: ${connectedUsers.size}`);
  });

  // Handle chat messages
  socket.on('chat_message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: 'User not found. Please rejoin.' });
      return;
    }

    const message = {
      id: Date.now() + Math.random(),
      username: user.username,
      message: messageData.message,
      timestamp: new Date().toISOString(),
      socketId: socket.id
    };

    // Add to chat history
    chatHistory.push(message);
    
    // Keep only last 1000 messages
    if (chatHistory.length > 1000) {
      chatHistory.shift();
    }

    // Broadcast message to all clients
    io.emit('new_message', message);

    console.log(`Message from ${user.username}: ${messageData.message}`);
  });

  // Handle typing indicator
  socket.on('typing_start', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user_typing', {
        username: user.username,
        isTyping: true
      });
    }
  });

  socket.on('typing_stop', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user_typing', {
        username: user.username,
        isTyping: false
      });
    }
  });

  // Handle private messages (optional feature)
  socket.on('private_message', (data) => {
    const { targetUsername, message } = data;
    const sender = connectedUsers.get(socket.id);
    
    if (!sender) return;

    // Find target user
    const targetUser = Array.from(connectedUsers.values())
      .find(user => user.username === targetUsername);

    if (targetUser) {
      // Send to target user
      io.to(targetUser.id).emit('private_message', {
        from: sender.username,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Confirm to sender
      socket.emit('private_message_sent', {
        to: targetUsername,
        message: message,
        timestamp: new Date().toISOString()
      });
    } else {
      socket.emit('error', { message: 'User not found' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      // Remove user from connected users
      connectedUsers.delete(socket.id);

      // Notify other users
      socket.broadcast.emit('user_left', {
        username: user.username,
        message: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
        userCount: connectedUsers.size
      });

      // Update user count
      io.emit('user_count_update', {
        count: connectedUsers.size
      });

      console.log(`User ${user.username} disconnected. Total users: ${connectedUsers.size}`);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});