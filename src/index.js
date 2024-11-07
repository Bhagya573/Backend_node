
//index.js
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const EventEmitter = require('events');
const { URL } = require('url');
const async_hooks = require('async_hooks'); // Importing Async Hooks
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// EventEmitter instance for custom events
const eventEmitter = new EventEmitter();

// Set up multer configuration for file uploads
const upload = setupMulter();

// Async Hook for tracking async operations
const asyncData = new Map();
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    asyncData.set(asyncId, { type, triggerAsyncId, resource });
  },
  before(asyncId) {
    const data = asyncData.get(asyncId);
    console.log(`Before running ${data.type} with ID: ${asyncId}`);
  },
  after(asyncId) {
    const data = asyncData.get(asyncId);
    console.log(`Completed ${data.type} with ID: ${asyncId}`);
  },
  destroy(asyncId) {
    asyncData.delete(asyncId);
  }
});
hook.enable(); // Enable Async Hooks

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize logging for system info and base URL
initializeLogging();

// Task Routes with file upload handling
app.use('/api/tasks', upload.single('file'), taskRoutes);

// Root route with a welcome message
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Task Manager API</h1><p>Visit /api/tasks to view tasks.</p>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Emitting an event after the server starts
  eventEmitter.emit('serverStarted', { title: 'Server Started' });
});

// Setup Multer configuration
function setupMulter() {
  const uploadDir = path.join(__dirname, 'uploads');
  
  // Ensure the upload directory exists
  ensureDirectoryExists(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      cb(null, allowedTypes.includes(file.mimetype));
    },
  });
}

// Ensure upload directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });  // Create directory if it doesn't exist
  }
}

// Initialize logging for system info and base URL
function initializeLogging() {
  logSystemInfo();
  logBaseURL();
  setupEventListeners();
}

// Log system-related information
function logSystemInfo() {
  console.log(`Platform: ${os.platform()} | Arch: ${os.arch()}`);
  console.log(`Total memory: ${formatBytes(os.totalmem())} | Free memory: ${formatBytes(os.freemem())}`);
}

// Log the base URL dynamically
function logBaseURL() {
  const baseURL = new URL(`http://localhost:${PORT}`);
  console.log(`Base URL: ${baseURL.href}`);
}

// Set up event listeners for custom events
function setupEventListeners() {
  eventEmitter.on('serverStarted', (task) => {
    console.log(`${task.title}: Server is ready to accept requests.`);
  });

  // Add other event listeners if needed (e.g., task creation events)
  eventEmitter.on('taskCreated', (task) => {
    console.log(`Task created: ${task.title}`);
  });
}

// Convert bytes to a human-readable format (e.g., MB, GB)
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
  else return `${(bytes / 1073741824).toFixed(2)} GB`;
}

