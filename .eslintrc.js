module.exports = {
  extends: ['react-app', 'airbnb'],
  rules: {
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/require-default-props': 'off',
    'react/button-has-type': 'off',
    'semi': ['error', 'never'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-curly-spacing': ['error', { 'when': 'always', 'children': true }],
    'object-curly-spacing': ['error', 'always'],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'no-unused-expressions': [2, { allowShortCircuit: true }]
  },
};
