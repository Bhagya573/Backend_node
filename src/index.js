// app.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();

// Access the environment variables
const port = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
const greeting = process.env.GREETING || "Hi there!"; // Fallback greeting
app.get('/', (req, res) => {
  res.send(greeting); // Use the greeting from the environment variable
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
