module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": ['./tsconfig.json']
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    // '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    // '@typescript-eslint/no-unused-vars': [
    //   'warn',
    //   { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    // ],
  }
}

/*
for reference: 

https://typescript-eslint.io/docs/linting/type-linting
https://github.com/typescript-eslint/typescript-eslint/blob/main/.eslintrc.js
all the rules: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules

also install the vscode eslint plugin
*/