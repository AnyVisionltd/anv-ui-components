module.exports = {
  stories: ['../src/**/**/*.stories.js', '../src/**/**/*.stories.mdx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    './av-theme-addon/register.js',
    '@storybook/addon-actions'
  ],
}
