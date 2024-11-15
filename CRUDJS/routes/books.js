const express = require('express');
const router = express.Router();
const {
    searchBooks,
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('../controller/bookController');

// Define the routes
router.get('/search', searchBooks);  
router.get('/', getAllBooks);     
router.get('/:id', getBookById); 
router.post('/', createBook); 
router.patch('/:id', updateBook); 
router.delete('/:id', deleteBook);
module.exports = router;
