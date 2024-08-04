export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv:['<rootDir>/jest.setup.ts'],
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.app.json',
      }],
    },
    moduleNameMapper: {
      '^.+\\.svg$': 'jest-svg-transformer',
      "\\.(css|less)$": "identity-obj-proxy",
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  
