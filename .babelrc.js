const isDevServer = process.env.SERVER

const presets = [
  ['@babel/preset-env', { modules: false }],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic'
    }
  ],
  ['@babel/preset-typescript']
]

const plugins = []

if (isDevServer) {
  plugins.push('react-refresh/babel')
}

module.exports = { presets, plugins }
