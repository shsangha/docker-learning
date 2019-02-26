const inTest = String(process.env.NODE_ENV) === 'test';

module.exports = {
  presets: [['@babel/preset-env', { modules: inTest ? 'commonjs' : false }], '@babel/preset-react'],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    inTest ? 'dynamic-import-node' : null
  ].filter(Boolean)
};
