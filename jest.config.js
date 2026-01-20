module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/index.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testTimeout: 60000,
  maxWorkers: 1
};
