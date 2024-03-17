const Book = require('../models/book');
const User = require('../models/User.model');

const addBook = async (_, args) => {
  try {
    const { title, author, description } = args;

    // Check if book already exists
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      throw new Error('Book already exists');
    }

    // Create new book
    const newBook = new Book({
      title,
      author,
      description,
    });

    // Save book to database
    await newBook.save();

    return { message: 'Book added successfully', book: newBook };
  } catch (error) {
    throw new Error('Failed to add book: ' + error.message);
  }
};

const browseBooks = async () => {
  try {
    // Fetch all books from database
    const books = await Book.find();
    return books;
  } catch (error) {
    throw new Error('Failed to browse books: ' + error.message);
  }
};

const borrowBook = async (_, args) => {
  try {
    const { bookId, userId } = args;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner !== null) {
      throw new Error('Book is already borrowed');
    }

    // Update book owner
    book.owner = userId;
    await book.save();

    return { message: 'Book borrowed successfully', book };
  } catch (error) {
    throw new Error('Failed to borrow book: ' + error.message);
  }
};

const buyBook = async (_, args) => {
  try {
    const { bookId, userId } = args;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner !== null) {
      throw new Error('Book is already owned by another user');
    }

    // Update book owner
    book.owner = userId;
    await book.save();

    return { message: 'Book bought successfully', book };
  } catch (error) {
    throw new Error('Failed to buy book: ' + error.message);
  }
};

const requestBook = async (_, args) => {
  try {
    const { bookId, borrowerId } = args;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (book.owner === null) {
      throw new Error('Book is available for borrowing or buying');
    }

    // Notify book owner about the request (e.g., via RabbitMQ or WebSocket)

    return { message: 'Request for borrowing book sent to the owner', book };
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
