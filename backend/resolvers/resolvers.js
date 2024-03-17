const { merge } = require('lodash');
const userResolvers = require('./userResolver');
const bookResolvers = require('./bookResolver');
const authResolvers = require('./authResolver');

const resolvers = merge(userResolvers, bookResolvers);

module.exports = resolvers;