const express = require('express');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/Books';
const booksRouter = require('./routes/books');
const authRouter = require('./routes/authRoutes');
require('dotenv').config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
    
// Routes
app.use('/books',booksRouter);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('Error:', err.message, err.stack); // Log error details
  res.status(statusCode).json({
      message: err.message || 'Internal server error',
      status: 'error',
      ...(err.statusCode ? { statusCode: err.statusCode } : {}),
  });
});
// Start server
app.listen(9000, () => {
    console.log('Server running on port 9000');
});
