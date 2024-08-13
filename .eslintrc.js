/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  rules: {
    'react-native/no-inline-styles': 0,
  },
};
