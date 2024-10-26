const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes'); 
const availabilityRoutes = require('./routes/availabilityRoutes');

dotenv.config();
const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL, // Use the frontend URL from .env
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Root route to display "API is working" in JSON format
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/availability', availabilityRoutes);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" }); // WebSocket server on "/ws" path

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('Received message from client:', message);
    ws.send('Message received'); // Acknowledge message from client
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Start server on the defined port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
