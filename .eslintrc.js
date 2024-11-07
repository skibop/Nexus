module.exports = {
    parser: '@typescript-eslint/parser', // Use TypeScript parser for .ts and .tsx files
    extends: [
      'plugin:react/recommended', // Recommended React rules
      'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
      'next/core-web-vitals', // Next.js core web vitals rules
    ],
    parserOptions: {
      ecmaVersion: 2020, // Support modern JavaScript (async/await, etc.)
      sourceType: 'module', // Enable ES module syntax (import/export)
      ecmaFeatures: {
        jsx: true, // Support JSX syntax in React files
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // No need for React to be in scope with Next.js
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: Disable explicit types for function return types
      '@typescript-eslint/no-unused-vars': 'off', // Turn off unused variable check (can be adjusted as needed)
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' type (can be adjusted if needed)
      'react/no-unescaped-entities': 'off', // Disable rule for unescaped entities in JSX
      'import/no-unresolved': 'off', // Allow unresolved imports temporarily (adjust if needed)
      '@typescript-eslint/no-empty-object-type': 'off', // Disable the no-empty-object-type rule
    },
  };
  