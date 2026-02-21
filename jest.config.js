module.exports = {
  testEnvironment: 'node',
  testTimeout: 15000,
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
