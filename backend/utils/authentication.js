const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  // Generate JWT token with user ID and role
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

const verifyToken = (token) => {
  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
