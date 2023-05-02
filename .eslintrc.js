module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Enable Node.js global variables
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [],
  rules: {
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
