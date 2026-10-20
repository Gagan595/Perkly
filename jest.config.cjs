module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: { '\\.(css)$': '<rootDir>/src/test/styleMock.js' },
};
