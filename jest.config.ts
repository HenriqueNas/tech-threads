import type { Config } from 'jest';
import nextJest from 'next/jest.js';

import dotenv from 'dotenv';

dotenv.config({ path: ['.env', '.env.development'] });

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@v1/(.*)$': '<rootDir>/pages/api/v1/$1',
    '^@infra/(.*)$': '<rootDir>/infra/$1',
  },
};

module.exports = createJestConfig(config);
