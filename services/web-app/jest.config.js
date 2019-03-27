module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.scss$": "identity-obj-proxy",
    "\\.module\\.scss$": "identity-obj-proxy"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["jest-localstorage-mock"],
  setupFilesAfterEnv: ["<rootDir>enzyme.config.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  collectCoverageFrom: ["**/src/**/*.ts(x)"]
};
