module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
    '\\.module\\.scss$': 'identity-obj-proxy'
  },
  setupFiles: ['jest-localstorage-mock'],
  setupTestFrameworkScriptFile: '<rootDir>enzyme.config.js',
  collectCoverageFrom: ['**/src/**/*.js(x)']
};
