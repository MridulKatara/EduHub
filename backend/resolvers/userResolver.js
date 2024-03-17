const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { generateToken } = require('../utils/authentication');

const userResolver = {
  Query: {
    users: async () => {
      try {
        return await User.find();
      } catch (error) {
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
    user: async (_, { id }) => {
      try {
        return await User.findById(id);
      } catch (error) {
        throw new Error('Failed to fetch user: ' + error.message);
      }
    },
  },
  Mutation: {
    registerUser: async (_, args) => {
      try {
        const { name, email, age, address, photo, password, confirmPassword } = args;

        // Check if passwords match
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
          name,
          email,
          age,
          address,
          photo,
          password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id, newUser.role);

        return { token };
      } catch (error) {
        throw new Error('Failed to register user: ' + error.message);
      }
    },
    updateUser: async (_, args) => {
      try {
        const { id, name, age, address, photo } = args;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
          throw new Error('User not found');
        }

        // Update user fields
        user.name = name;
        user.age = age;
        user.address = address;
        user.photo = photo;

        // Save updated user to database
        await user.save();

        return user;
      } catch (error) {
        throw new Error('Failed to update user: ' + error.message);
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
          throw new Error('User not found');
        }

        // Delete user from database
        await User.findByIdAndDelete(id);

        return user;
      } catch (error) {
        throw new Error('Failed to delete user: ' + error.message);
      }
    },
  },
};

module.exports = userResolver;
