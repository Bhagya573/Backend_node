const mongoose = require('mongoose');
 const booksSchema = new mongoose.Schema({
     title: {
         type: String,
         required: true
     }, author: {
        type: String,
        required: true
    }, genre: {
        type: String,
        required: true
    },year: {
        type: Number,
        required: true
    }
 },{ collection: 'BooksCollection' })

 module.exports = mongoose.model('Book',booksSchema)