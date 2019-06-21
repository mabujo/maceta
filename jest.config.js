module.exports = {
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/*.{js,jsx}', 'src/**/*.{js,jsx}', '!**/node_modules/**'],
  setupFilesAfterEnv: ['jest-extended']
};
