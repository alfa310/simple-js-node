const path = require('path');

module.exports = {
  testEnvironment: 'jest-environment-node',
  collectCoverageFrom: ['**/src/services/*Service.js'],
  moduleDirectories: ['node_modules', path.join(__dirname, 'test')],
};
