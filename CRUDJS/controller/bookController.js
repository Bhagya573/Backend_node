const { searchBooksDetails, getAllBooksFromDB, getBookByIdFromDB, createBookInDB, updateBookInDB, deleteBookFromDB } = require('../resolver/bookResolver');

// Search books by title, author, genre, and optionally by year
const searchBooks = async (req, res, next) => {
    const { year, title, author, genre } = req.query;

    try {
        const records = await searchBooksDetails(year, title, author, genre);
        return res.status(200).json(records);
    } catch (err) {
         next(err);
    }
};

// Get all books
const getAllBooks = async (req, res, next) => {
    try {
        const books = await getAllBooksFromDB();
        console.log("books",books)
        res.json(books);
    } catch (err) {
         next(err);
    }
};

// Get a single book by ID
const getBookById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const book = await getBookByIdFromDB(id);
        if (!book) {
            const error = new Error('Book not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(book);
    } catch (err) {
        next(err); 
    }
};

// Create a new book
const createBook = async (req, res, next) => {
    const { title, author, genre, year } = req.body;

    if (!title || !author || !genre || !year) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newBook = await createBookInDB(title, author, genre, year);
        res.status(201).json(newBook);
    } catch (err) {
         next(err);
    }
};

// Update a book by ID
const updateBook = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updatedBook = await updateBookInDB(id, req.body);
        if (!updatedBook) {
            const error = new Error('Book not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(updatedBook);
    } catch (err) {
             next(err);
    }
};

// Delete a book by ID
const deleteBook = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedBook = await deleteBookFromDB(id);
        if (!deletedBook) {
            const error = new Error('Book not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Book successfully deleted' });
    } catch (err) {
         next(err);
    }
};

module.exports = {
    searchBooks,
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};

