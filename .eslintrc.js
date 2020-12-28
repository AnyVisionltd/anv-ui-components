module.exports = {
  extends: ['react-app', 'prettier'],
  plugins: ['react-hooks'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-anonymous-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/require-default-props': 'off',
    'react/button-has-type': 'off',
    semi: ['error', 'never'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'arrow-parens': ['error', 'as-needed'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
