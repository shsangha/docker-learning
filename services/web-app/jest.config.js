module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
  setupFiles: 'jest-localstorage-mock',
  collectCoverageFrom: [
    '**/src/**/*.js(x)',
  ],
};
