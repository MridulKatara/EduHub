const Book = require('../models/book');
const User = require('../models/User.model');

const addBook = async (bookData) => {
  try {
    const { title, author, description } = bookData;
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      throw new Error('Book already exists');
    }
    const newBook = new Book({ title, author, description });
    return await newBook.save();
  } catch (error) {
    throw new Error('Failed to add book: ' + error.message);
  }
};

const browseBooks = async () => {
  try {
    return await Book.find();
  } catch (error) {
    throw new Error('Failed to browse books: ' + error.message);
  }
};

const borrowBook = async (bookId, userId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner !== null) {
      throw new Error('Book is already borrowed');
    }
    book.owner = userId;
    await book.save();
    return book;
  } catch (error) {
    throw new Error('Failed to borrow book: ' + error.message);
  }
};

const buyBook = async (bookId, userId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner !== null) {
      throw new Error('Book is already owned by another user');
    }
    book.owner = userId;
    await book.save();
    return book;
  } catch (error) {
    throw new Error('Failed to buy book: ' + error.message);
  }
};

const requestBook = async (bookId, borrowerId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner === null) {
      throw new Error('Book is available for borrowing or buying');
    }
    // Notify book owner about the request (e.g., via RabbitMQ or WebSocket)
    return book;
  } catch (error) {
    throw new Error('Failed to request book: ' + error.message);
  }
};

module.exports = {
  addBook,
  browseBooks,
  borrowBook,
  buyBook,
  requestBook,
};
