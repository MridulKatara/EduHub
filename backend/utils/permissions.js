const { ForbiddenError } = require('apollo-server-express');

const checkAdmin = (context) => {
  // Check if user is an admin
  if (context.user.role !== 'admin') {
    throw new ForbiddenError('You are not authorized to perform this action');
  }
};

const checkUser = (context) => {
  // Check if user is a regular user
  if (context.user.role !== 'user') {
    throw new ForbiddenError('You are not authorized to perform this action');
  }
};

module.exports = {
  checkAdmin,
  checkUser,
};
