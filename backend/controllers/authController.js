const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { generateToken } = require('../utils/authentication');

const register = async (args) => {
  try {
    const { name, email, age, address, photo, password, confirmPassword } = args;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
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
    throw new Error('Registration failed: ' + error.message);
  }
};

const login = async (args) => {
  try {
    const { email, password, role } = args;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    return { token };
  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
};

module.exports = {
  register,
  login,
};
