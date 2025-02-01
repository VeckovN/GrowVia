"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestConfig = {
    preset: 'ts-jest', //using typescript
    testEnvironment: 'node', //'node' for backend-server,  'browser' for REACT client app
    verbose: true,
    coverageDirectory: "coverage",
    collectCoverage: true,
    testPathIgnorePatterns: ['/node_modules'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testMatch: ['<rootDir>/src/**/test/*.ts'], //Match the test files(from /test file)
    //for example /src/queues/test/emailConsumer.test.ts MATCHED
    collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1
        }
    },
    coverageReporters: ['text-summary', 'lcov'],
    moduleNameMapper: {
        '@notification/(.*)': ['<rootDir>/src/$1'] //let jest to now about @notification path
    }
};
exports.default = jestConfig;
//# sourceMappingURL=jest.config.js.map