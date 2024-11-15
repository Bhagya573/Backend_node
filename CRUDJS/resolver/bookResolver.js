const Books = require('../models/books');

// search books
const searchBooksDetails = async (yearQuery, titleQuery, authorQuery, genreQuery) => {
    const query = {};

    // If a year is provided, add it to the query
    if (yearQuery) {
        const parsedYear = parseInt(yearQuery, 10);
        if (isNaN(parsedYear)) {
            const err = new Error("Invalid year format");
            err.statusCode = 400;
            throw err;
        }
        query.year = parsedYear;
    }

    // If a title is provided, add it to the query
    if (titleQuery) {
        query.title = { $regex: titleQuery, $options: 'i' }; 
    }

    // If an author is provided, add it to the query
    if (authorQuery) {
        query.author = { $regex: authorQuery, $options: 'i' };
    }

    // If a genre is provided, add it to the query
    if (genreQuery) {
        query.genre = { $regex: genreQuery, $options: 'i' };
    }

    try {
        const records = await Books.find(query);
        console.log('Search query:', query);
        console.log('Search results:', records,records.length);
        if (records.length === 0) {
            return { message: 'No books found matching the search criteria', status: 'success' };
        }
        return records;
    } catch (err) {
        throw new Error("Error performing search", err);
    }
};

// Get all books
const getAllBooksFromDB = async () => {
    try {
        console.log("Books fetched:", await Books.find()); 
        return await Books.find();
    } catch (err) {
        console.log(err,"err")
        throw new Error("Error retrieving books");
    }
};

// Get a book by ID
const getBookByIdFromDB = async (id) => {
    try {
        return await Books.findById(id);
    } catch (err) {
        throw new Error("Error retrieving book");
    }
};

// Create a new book
const createBookInDB = async (title, author, genre, year) => {
    try {
        const newBook = new Books({ title, author, genre, year });
        return await newBook.save();
    } catch (err) {
        const customError = new Error("Error creating book");
        customError.statusCode = 500;  
        throw customError;
    }
};

// Update a book by ID
const updateBookInDB = async (id, updatedFields) => {
    try {
        return await Books.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (err) {
        throw new Error("Error updating book");
    }
};

// Delete a book by ID
const deleteBookFromDB = async (id) => {
    try {
        const book = await Books.findById(id);
        if (!book) {
            return null;
        }
        await book.deleteOne();
        return book;
    } catch (err) {
        throw new Error("Error removing book");
    }
};

module.exports = {
    searchBooksDetails,
    getAllBooksFromDB,
    getBookByIdFromDB,
    createBookInDB,
    updateBookInDB,
    deleteBookFromDB 
};
