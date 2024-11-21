const express = require('express');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/Books';
const booksRouter = require('./routes/books');
const authRouter = require('./routes/authRoutes');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
    
    // JWT Authentication Middleware
const JWT_SECRET = process.env.JWT_SECRET;
const protect = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else {
        return res.status(401).json({ message: 'Token is not valid' });
      }
  }
};


// Routes
app.use('/auth', authRouter); 
app.use('/books',protect,booksRouter);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
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
