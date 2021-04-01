module.exports = {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['examples/**'],
    overrides: [
      {
        files: ['*.js'],
      },
    ],
  };