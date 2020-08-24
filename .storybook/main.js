module.exports = {
  stories: ['../src/**/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    './.storybook/av-theme-addon/register.js',
    '@storybook/addon-actions'
  ],
}
