const express = require('express');
const router = express.Router();
const {
    searchBooks,
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    uploadFiles
} = require('../controller/bookController');

// Define the routes
router.get('/searchBooks', searchBooks);  
router.get('/getAllBook', getAllBooks);     
router.get('/getBookById/:id', getBookById); 
router.post('/createBook', createBook); 
router.patch('/updatebook/:id', updateBook); 
router.delete('/deleteBook/:id', deleteBook);
router.post('/uploadFile', uploadFiles);
module.exports = router;
