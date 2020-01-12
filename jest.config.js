module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  globals: {
    // We need a separate tsconfig because we need to turn off strictNullChecks
    // as the component variables in the tests need to be null and we don't
    // want to keep on checking if they're null before using them
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
