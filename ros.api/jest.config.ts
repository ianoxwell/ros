module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@base/(.*)$': '<rootDir>/base/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@models/(.*)$': '<rootDir>/../Models/$1'
  }
};
