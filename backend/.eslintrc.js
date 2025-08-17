module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off', // Allow console for logging
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'max-len': ['error', { code: 120 }],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'no-param-reassign': ['error', { props: false }],
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    'no-useless-escape': 'error',
    'no-useless-concat': 'error',
    'prefer-destructuring': ['error', {
      array: false,
      object: true,
    }],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off', // Allow MongoDB _id
    'camelcase': ['error', { properties: 'never' }], // Allow snake_case for API responses
    'import/extensions': ['error', 'ignorePackages'],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
    },
  ],
};
