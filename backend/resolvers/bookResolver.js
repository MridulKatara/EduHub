const Book = require('../models/book');
const User = require('../models/User.model');

const bookResolver = {
  Query: {
    books: async () => {
      try {
        return await Book.find();
      } catch (error) {
        throw new Error('Failed to fetch books: ' + error.message);
      }
    },
    book: async (_, { id }) => {
      try {
        return await Book.findById(id);
      } catch (error) {
        throw new Error('Failed to fetch book: ' + error.message);
      }
    },
  },
  Mutation: {
    addBook: async (_, args) => {
      try {
        const { title, author, description } = args;
        const existingBook = await Book.findOne({ title });
        if (existingBook) {
          throw new Error('Book already exists');
        }
        const newBook = new Book({ title, author, description });
        return await newBook.save();
      } catch (error) {
        throw new Error('Failed to add book: ' + error.message);
      }
    },
    borrowBook: async (_, args) => {
      try {
        const { bookId, userId } = args;
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
    },
    buyBook: async (_, args) => {
      try {
        const { bookId, userId } = args;
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
    },
    requestBook: async (_, args) => {
      try {
        const { bookId, borrowerId } = args;
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
    },
  },
  Book: {
    owner: async (parent) => {
      try {
        if (!parent.owner) return null;
        return await User.findById(parent.owner);
      } catch (error) {
        throw new Error('Failed to fetch book owner: ' + error.message);
      }
    },
  },
};

module.exports = bookResolver;
