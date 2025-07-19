export default {
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
};
